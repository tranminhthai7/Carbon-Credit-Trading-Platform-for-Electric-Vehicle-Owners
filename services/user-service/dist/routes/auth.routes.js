"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
/**
 * @route   POST /register
 * @desc    Register a new user
 * @access  Public
 * Note: API Gateway routes /api/users/register to this endpoint
 */
router.post('/register', auth_controller_1.register);
/**
 * @route   POST /login
 * @desc    Login user
 * @access  Public
 * Note: API Gateway routes /api/users/login to this endpoint
 */
router.post('/login', auth_controller_1.login);
/**
 * @route POST /refresh
 * @desc Refresh access token using refresh token cookie
 */
router.post('/refresh', auth_controller_1.refresh);
/**
 * @route POST /logout
 * @desc Logout - clear refresh token cookie and remove record
 */
router.post('/logout', auth_controller_1.logout);
/**
 * @route GET /verify/:token
 * @desc Verify email using token
 */
router.get('/verify/:token', auth_controller_1.verifyEmail);
// Dev-only: get last verification token (for test automation)
router.get('/internal/last-verification-token', auth_controller_1.getLastVerificationToken);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map