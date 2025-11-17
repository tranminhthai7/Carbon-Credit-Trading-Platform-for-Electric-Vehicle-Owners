import { Router } from 'express';
import { register, login, refresh, logout, verifyEmail, getLastVerificationToken } from '../controllers/auth.controller';

const router = Router();

/**
 * @route   POST /register
 * @desc    Register a new user
 * @access  Public
 * Note: API Gateway routes /api/users/register to this endpoint
 */
router.post('/register', register);

/**
 * @route   POST /login
 * @desc    Login user
 * @access  Public
 * Note: API Gateway routes /api/users/login to this endpoint
 */
router.post('/login', login);

/**
 * @route POST /refresh
 * @desc Refresh access token using refresh token cookie
 */
router.post('/refresh', refresh);

/**
 * @route POST /logout
 * @desc Logout - clear refresh token cookie and remove record
 */
router.post('/logout', logout);

/**
 * @route GET /verify/:token
 * @desc Verify email using token
 */
router.get('/verify/:token', verifyEmail);

// Dev-only: get last verification token (for test automation)
router.get('/internal/last-verification-token', getLastVerificationToken);

export default router;
