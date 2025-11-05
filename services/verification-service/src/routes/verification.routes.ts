import { Router } from 'express';
import { VerificationController } from '../controllers/verification.controller';
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

// CVA Verification Management
router.get('/pending', verificationController.getPendingVerifications);
router.post('/approve', validateApproval, verificationController.approveVerification);
router.post('/reject', validateRejection, verificationController.rejectVerification);

// KYC Management
router.post('/kyc/submit', validateKYCSubmit, verificationController.submitKYC);
router.get('/kyc/status/:userId', validateUserId, verificationController.getKYCStatus);

// Credit Verification & Approval
router.post('/credits/verify', validateVerificationSubmit, verificationController.verifyCredits);
router.post('/credits/approve', validateApproval, verificationController.approveCredits);
router.post('/credits/reject', validateRejection, verificationController.rejectCredits);

// Certificates
router.get('/certificates/:userId', validateUserId, verificationController.getUserCertificates);

// Reports
router.get('/reports/verification', validateReportQuery, verificationController.generateVerificationReport);

export default router;