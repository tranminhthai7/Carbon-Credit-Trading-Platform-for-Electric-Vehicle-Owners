"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastVerificationToken = exports.verifyEmail = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const auth_validator_1 = require("../validators/auth.validator");
const register = async (req, res, next) => {
    try {
        // Validate input
        const { error, value } = auth_validator_1.registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(d => d.message)
            });
        }
        const { email, password, role, full_name, phone } = value;
        // Check if user already exists
        const existingUser = await (0, database_1.query)('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        // Use bcrypt to hash passwords
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
        const password_hash = await bcryptjs_1.default.hash(password, saltRounds);
        // Insert user
        const result = await (0, database_1.query)(`INSERT INTO users (email, password_hash, role, full_name, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, role, full_name, phone, created_at`, [email, password_hash, role, full_name || null, phone || null]);
        const user = result.rows[0];
        // Generate JWT token
        const jwtSecret = (process.env.JWT_SECRET || 'default-secret');
        const jwtExpiresIn = (process.env.JWT_EXPIRES_IN || '24h');
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            role: user.role
        }, jwtSecret, { expiresIn: jwtExpiresIn });
        // Create email verification token and save to DB
        const verificationToken = crypto_1.default.randomBytes(24).toString('hex');
        const verificationExpiry = new Date(Date.now() + (24 * 3600 * 1000)); // 24h
        await (0, database_1.query)(`INSERT INTO email_verifications (user_id, token, expires_at) VALUES ($1, $2, $3)`, [user.id, verificationToken, verificationExpiry]);
        // Issue a refresh token and save to DB
        const refreshToken = crypto_1.default.randomBytes(48).toString('hex');
        const refreshTokenHash = crypto_1.default.createHash('sha256').update(refreshToken).digest('hex');
        const refreshTokenExpiry = new Date(Date.now() + (parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN_MS || '604800000') || 7 * 24 * 3600 * 1000));
        await (0, database_1.query)(`INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`, [user.id, refreshTokenHash, refreshTokenExpiry]);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN_MS || '604800000')
        });
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
            },
            ...(process.env.NODE_ENV !== 'production' && { verificationToken })
        });
        // If not production, return verification token so devs can verify easily
        // Not ideal for production, but useful for local testing (link copy/paste)
        if (process.env.NODE_ENV !== 'production') {
            // Append verification token to response body
            // (res.body already sent above — but for simplicity in dev we can also log it)
            console.log('📩 Dev Email verification token:', verificationToken);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        // Validate input
        const { error, value } = auth_validator_1.loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(d => d.message)
            });
        }
        const { email, password } = value;
        // Find user
        const result = await (0, database_1.query)('SELECT id, email, password_hash, role, full_name, phone, email_verified FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        const user = result.rows[0];
        // Verify password using bcrypt
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        // Generate JWT token
        const jwtSecret = (process.env.JWT_SECRET || 'default-secret');
        const jwtExpiresIn = (process.env.JWT_EXPIRES_IN || '24h');
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            role: user.role
        }, jwtSecret, { expiresIn: jwtExpiresIn });
        // Create refresh token cookie like in register
        const refreshToken = crypto_1.default.randomBytes(48).toString('hex');
        const refreshTokenHash = crypto_1.default.createHash('sha256').update(refreshToken).digest('hex');
        const refreshTokenExpiry = new Date(Date.now() + (parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN_MS || '604800000') || 7 * 24 * 3600 * 1000));
        await (0, database_1.query)(`INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`, [user.id, refreshTokenHash, refreshTokenExpiry]);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN_MS || '604800000')
        });
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
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
// Refresh token endpoint: read cookie, verify, issue new access token
const refresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken)
            return res.status(401).json({ success: false, message: 'No refresh token' });
        const refreshTokenHash = crypto_1.default.createHash('sha256').update(refreshToken).digest('hex');
        const result = await (0, database_1.query)('SELECT user_id, expires_at FROM refresh_tokens WHERE token_hash = $1', [refreshTokenHash]);
        if (result.rows.length === 0)
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        const stored = result.rows[0];
        if (new Date(stored.expires_at) < new Date()) {
            await (0, database_1.query)('DELETE FROM refresh_tokens WHERE token_hash = $1', [refreshTokenHash]);
            return res.status(401).json({ success: false, message: 'Refresh token expired' });
        }
        const userResult = await (0, database_1.query)('SELECT id, email, role, full_name, phone FROM users WHERE id = $1', [stored.user_id]);
        if (userResult.rows.length === 0)
            return res.status(401).json({ success: false, message: 'User not found' });
        const user = userResult.rows[0];
        const jwtSecret2 = (process.env.JWT_SECRET || 'default-secret');
        const jwtExpiresIn2 = (process.env.JWT_EXPIRES_IN || '15m');
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, jwtSecret2, { expiresIn: jwtExpiresIn2 });
        return res.status(200).json({ success: true, data: { token: accessToken, user } });
    }
    catch (error) {
        next(error);
    }
};
exports.refresh = refresh;
// Logout: remove refresh token (if cookie present) and clear cookie
const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            const refreshTokenHash = crypto_1.default.createHash('sha256').update(refreshToken).digest('hex');
            await (0, database_1.query)('DELETE FROM refresh_tokens WHERE token_hash = $1', [refreshTokenHash]);
        }
        res.clearCookie('refreshToken');
        return res.status(200).json({ success: true, message: 'Logout successful' });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
// Verify email token
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;
        if (!token)
            return res.status(400).json({ success: false, message: 'Token is required' });
        const result = await (0, database_1.query)('SELECT user_id, expires_at FROM email_verifications WHERE token = $1', [token]);
        if (result.rows.length === 0)
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        const record = result.rows[0];
        if (new Date(record.expires_at) < new Date())
            return res.status(400).json({ success: false, message: 'Token expired' });
        await (0, database_1.query)('UPDATE users SET email_verified = true WHERE id = $1', [record.user_id]);
        await (0, database_1.query)('DELETE FROM email_verifications WHERE token = $1', [token]);
        return res.status(200).json({ success: true, message: 'Email verified' });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyEmail = verifyEmail;
// Dev-only: return last verification token for testing
const getLastVerificationToken = async (req, res, next) => {
    try {
        if (process.env.NODE_ENV === 'production')
            return res.status(401).json({ success: false, message: 'Not allowed' });
        const result = await (0, database_1.query)('SELECT token, user_id, expires_at FROM email_verifications ORDER BY created_at DESC LIMIT 1');
        if (result.rows.length === 0)
            return res.status(404).json({ success: false, message: 'No verifications found' });
        const rec = result.rows[0];
        return res.json({ success: true, data: rec });
    }
    catch (err) {
        next(err);
    }
};
exports.getLastVerificationToken = getLastVerificationToken;
//# sourceMappingURL=auth.controller.js.map