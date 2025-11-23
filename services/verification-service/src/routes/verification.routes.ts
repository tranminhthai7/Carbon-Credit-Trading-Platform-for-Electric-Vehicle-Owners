import { Router } from 'express';
import { VerificationController } from '../controllers/verification.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { 
  validateVerificationSubmit, 
  validateKYCSubmit, 
  validateApproval, 
  validateRejection,
  validateReportQuery,
  validateUserId
} from '../middleware/validation';

const router: Router = Router();
const verificationController = new VerificationController();

// CVA Verification Management (requires CVA role)
router.get('/pending', authMiddleware, requireRole(['cva']), verificationController.getPendingVerifications);
router.get('/stats', authMiddleware, requireRole(['cva']), verificationController.getStats);
router.get('/recent', authMiddleware, requireRole(['cva']), verificationController.getRecentActivities);
router.post('/approve', authMiddleware, requireRole(['cva']), validateApproval, verificationController.approveVerification);
router.post('/reject', authMiddleware, requireRole(['cva']), validateRejection, verificationController.rejectVerification);

// KYC Management
router.post('/kyc/submit', authMiddleware, validateKYCSubmit, verificationController.submitKYC);
router.get('/kyc/status/:userId', authMiddleware, validateUserId, verificationController.getKYCStatus);

// Credit Verification & Approval
router.post('/credits/verify', authMiddleware, validateVerificationSubmit, verificationController.verifyCredits);
router.post('/credits/approve', authMiddleware, requireRole(['cva']), validateApproval, verificationController.approveCredits);
router.post('/credits/reject', authMiddleware, requireRole(['cva']), validateRejection, verificationController.rejectCredits);

// Certificates
// Routes for current user
router.get('/certificates', authMiddleware, verificationController.getCertificatesForCurrentUser);
router.get('/certificates/:id/pdf', authMiddleware, verificationController.downloadCertificatePdf);
router.post('/certificates/:id/share', authMiddleware, verificationController.createCertificateShareLink);
// Legacy route (by user id) kept for convenience
router.get('/certificates/:userId', validateUserId, verificationController.getUserCertificates);

// Reports
router.get('/reports/verification', validateReportQuery, verificationController.generateVerificationReport);

export default router;