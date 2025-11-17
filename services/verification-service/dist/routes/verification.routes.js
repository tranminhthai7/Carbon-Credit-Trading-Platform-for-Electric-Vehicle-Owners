"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verification_controller_1 = require("../controllers/verification.controller");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
const verificationController = new verification_controller_1.VerificationController();
// CVA Verification Management
router.get('/pending', verificationController.getPendingVerifications);
router.post('/approve', validation_1.validateApproval, verificationController.approveVerification);
router.post('/reject', validation_1.validateRejection, verificationController.rejectVerification);
// KYC Management
router.post('/kyc/submit', validation_1.validateKYCSubmit, verificationController.submitKYC);
router.get('/kyc/status/:userId', validation_1.validateUserId, verificationController.getKYCStatus);
// Credit Verification & Approval
router.post('/credits/verify', validation_1.validateVerificationSubmit, verificationController.verifyCredits);
router.post('/credits/approve', validation_1.validateApproval, verificationController.approveCredits);
router.post('/credits/reject', validation_1.validateRejection, verificationController.rejectCredits);
// Certificates
router.get('/certificates/:userId', validation_1.validateUserId, verificationController.getUserCertificates);
// Reports
router.get('/reports/verification', validation_1.validateReportQuery, verificationController.generateVerificationReport);
exports.default = router;
