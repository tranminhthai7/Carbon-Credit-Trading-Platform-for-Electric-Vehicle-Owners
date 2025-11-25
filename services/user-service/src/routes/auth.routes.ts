import { Router } from 'express';
import { register, login, refresh, logout, getProfile, updateProfile, getAllUsers } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

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
 * @route   POST /refresh
 * @desc    Refresh access token using refresh token cookie
 * @access  Public (reads cookie)
 */
router.post('/refresh', refresh);

/**
 * @route   POST /logout
 * @desc    Logout and clear refresh token
 */
router.post('/logout', logout);

/**
 * @route   GET /profile
 * @desc    Get current user's profile
 */
router.get('/profile', authMiddleware, getProfile);

/**
 * @route   PUT /:id
 * @desc    Update user profile (protected)
 */
router.put('/:id', authMiddleware, updateProfile);

/**
 * @route   GET /users
 * @desc    Get all users (admin only)
 * @access  Private (Admin)
 */
router.get('/users', getAllUsers); // Temporarily remove authMiddleware for testing
router.get('/admin/users', getAllUsers); // Add admin route for API Gateway

export default router;
