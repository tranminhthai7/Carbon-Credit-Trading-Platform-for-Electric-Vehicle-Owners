import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
// import { query } from '../config/database';
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

    // Mock response - skip database for now
    const { email, role, full_name, phone } = value;
    const user = {
      id: 'mock-' + Date.now(),
      email,
      role: role.toUpperCase(),
      full_name: full_name || null,
      phone: phone || null,
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user
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

    const { email } = value;

    // Mock user - skip database for now
    const user = {
      id: 'mock-user-' + Date.now(),
      email,
      role: email.includes('admin') ? 'admin' : 'buyer',
      full_name: email.split('@')[0],
      phone: null
    };

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as SignOptions
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};



export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const raw = req.cookies?.refreshToken;
    if (!raw) {
      return res.status(401).json({ success: false, message: 'No refresh token' });
    }

    // Mock refresh - skip database for now
    const mockUser = {
      id: '1',
      email: 'user@example.com',
      role: 'EV_OWNER',
      full_name: 'Mock User',
      phone: '+1234567890',
      created_at: new Date().toISOString()
    };

    const token = jwt.sign(
      { userId: mockUser.id, email: mockUser.email, role: mockUser.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as jwt.SignOptions
    );

    return res.json({ success: true, message: 'Refresh successful', data: { user: mockUser, token } });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'No authenticated user' });

    // Mock profile - skip database for now
    const profile = {
      id: userId,
      email: req.user?.email || 'user@example.com',
      role: req.user?.role || 'BUYER',
      full_name: req.user?.email?.split('@')[0] || 'User',
      phone: null,
      created_at: new Date().toISOString()
    };

    return res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Mock logout - skip database for now
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

    // Mock response - skip database for now
    const mockUser = {
      id: userId,
      email: 'user@example.com',
      role: 'EV_OWNER',
      full_name: full_name || 'Updated User',
      phone: phone || '+1234567890',
      created_at: new Date().toISOString()
    };

    return res.json(mockUser);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /users
 * @desc    Get all users (admin only)
 * @access  Private (Admin)
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Mock data - skip database for now
    const users = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'EV_OWNER',
        kycVerified: true,
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'BUYER',
        kycVerified: false,
        createdAt: '2024-02-20'
      },
      {
        id: '3',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN',
        kycVerified: true,
        createdAt: '2024-01-01'
      },
      {
        id: '4',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'EV_OWNER',
        kycVerified: true,
        createdAt: '2024-03-10'
      },
      {
        id: '5',
        name: 'Bob Wilson',
        email: 'bob@example.com',
        role: 'BUYER',
        kycVerified: false,
        createdAt: '2024-04-05'
      },
      {
        id: '6',
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        role: 'CVA',
        kycVerified: true,
        createdAt: '2024-05-12'
      },
      {
        id: '7',
        name: 'Diana Prince',
        email: 'diana@example.com',
        role: 'EV_OWNER',
        kycVerified: true,
        createdAt: '2024-06-18'
      },
      {
        id: '8',
        name: 'Eve Adams',
        email: 'eve@example.com',
        role: 'BUYER',
        kycVerified: false,
        createdAt: '2024-07-22'
      }
    ];

    res.json({
      success: true,
      data: users,
      total: users.length
    });
  } catch (error) {
    next(error);
  }
};
