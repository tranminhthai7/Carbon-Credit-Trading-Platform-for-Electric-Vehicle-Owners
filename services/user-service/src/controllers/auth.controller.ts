import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';
import { registerSchema, loginSchema } from '../validators/auth.validator';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(d => d.message)
      });
    }

    const { email, password, role, full_name, phone } = value;

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // TEMP: Use crypto instead of bcrypt for dev (bcrypt too slow in Docker Windows)
    // TODO: Switch back to bcrypt in production!
    const password_hash = crypto.createHash('sha256').update(password + 'salt123').digest('hex');

    // Insert user
    const result = await query(
      `INSERT INTO users (email, password_hash, role, full_name, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, role, full_name, phone, created_at`,
      [email, password_hash, role, full_name || null, phone || null]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as jwt.SignOptions
    );

    // issue refresh token cookie for session refresh
    await issueRefreshToken(res, user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          phone: user.phone,
          created_at: user.created_at
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(d => d.message)
      });
    }

    const { email, password } = value;

    // Find user
    const result = await query(
      'SELECT id, email, password_hash, role, full_name, phone FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = result.rows[0];

    // TEMP: Verify password with crypto (matching registration)
    const password_hash = crypto.createHash('sha256').update(password + 'salt123').digest('hex');
    const isValidPassword = password_hash === user.password_hash;
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as jwt.SignOptions
    );

    // issue refresh token cookie for session refresh
    await issueRefreshToken(res, user.id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          phone: user.phone
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Issue and persist a refresh token (HTTP-only cookie)
const issueRefreshToken = async (res: Response, userId: string) => {
  const refreshToken = crypto.randomBytes(48).toString('hex');
  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const refreshTokenExpiryMs = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN_MS || '604800000');
  const refreshTokenExpiry = new Date(Date.now() + refreshTokenExpiryMs);

  // remove existing tokens (simple cleanup) and insert the new one
  await query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
  await query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [userId, refreshTokenHash, refreshTokenExpiry]
  );

  // set cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: refreshTokenExpiryMs,
  });
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const raw = req.cookies?.refreshToken;
    if (!raw) {
      return res.status(401).json({ success: false, message: 'No refresh token' });
    }

    const refreshTokenHash = crypto.createHash('sha256').update(raw).digest('hex');
    const result = await query('SELECT user_id, expires_at FROM refresh_tokens WHERE token_hash = $1', [refreshTokenHash]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const row = result.rows[0];
    const expiresAt = new Date(row.expires_at);
    if (expiresAt.getTime() < Date.now()) {
      // expired: delete record and return 401
      await query('DELETE FROM refresh_tokens WHERE token_hash = $1', [refreshTokenHash]);
      return res.status(401).json({ success: false, message: 'Refresh token expired' });
    }

    const userResult = await query('SELECT id, email, role, full_name, phone, created_at FROM users WHERE id = $1', [row.user_id]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const user = userResult.rows[0];

    // rotate refresh token (delete old + issue new cookie and db entry)
    await query('DELETE FROM refresh_tokens WHERE token_hash = $1', [refreshTokenHash]);
    await issueRefreshToken(res, user.id);

    // issue new access token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as jwt.SignOptions
    );

    return res.json({ success: true, message: 'Refresh successful', data: { user: { id: user.id, email: user.email, role: user.role, full_name: user.full_name, phone: user.phone, created_at: user.created_at }, token } });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'No authenticated user' });

    const result = await query('SELECT id, email, role, full_name, phone, created_at FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const raw = req.cookies?.refreshToken;
    if (raw) {
      const refreshTokenHash = crypto.createHash('sha256').update(raw).digest('hex');
      await query('DELETE FROM refresh_tokens WHERE token_hash = $1', [refreshTokenHash]);
    }
    res.clearCookie('refreshToken');
    return res.json({ success: true, message: 'Logged out' });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const { full_name, phone } = req.body;
    const result = await query('UPDATE users SET full_name = $1, phone = $2, updated_at = NOW() WHERE id = $3 RETURNING id, email, role, full_name, phone, created_at', [full_name || null, phone || null, userId]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
