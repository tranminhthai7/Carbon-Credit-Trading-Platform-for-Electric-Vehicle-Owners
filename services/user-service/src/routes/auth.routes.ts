import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

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

export default router;
