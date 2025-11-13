// verification.routes.ts
import { Router } from 'express';
import { VerificationController } from '../controllers/verification.controller';
import { AppDataSource } from '../config/database';
import { Verification, VerificationStatus } from '../entities/Verification';
import { Certificate } from '../entities/Certificate';

const router: Router = Router();
const verificationController = new VerificationController();

// ✅ ADD THIS: Get verification statistics
router.get('/stats', async (req, res) => {
  try {
    const verificationRepo = AppDataSource.getRepository(Verification);
    
    // Query all counts in parallel for better performance
    const [total, approved, rejected, pending] = await Promise.all([
      verificationRepo.count(),
      verificationRepo.count({ where: { status: VerificationStatus.APPROVED } }),
      verificationRepo.count({ where: { status: VerificationStatus.REJECTED } }),
      verificationRepo.count({ where: { status: VerificationStatus.PENDING } })
    ]);

    res.json({
      success: true,
      data: {
        total,
        approved,
        rejected,
        pending,
        approval_rate: total > 0 ? ((approved / total) * 100).toFixed(2) : '0.00'
      }
    });
  } catch (err: any) {
    console.error('Get stats error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to get verification statistics',
      error: err.message
    });
  }
});

// ✅ OPTIONAL: Get stats for specific CVA
router.get('/stats/cva/:cvaId', async (req, res) => {
  try {
    const { cvaId } = req.params;
    const verificationRepo = AppDataSource.getRepository(Verification);
    
    const [total, approved, rejected, pending] = await Promise.all([
      verificationRepo.count({ where: { cva_id: cvaId } }),
      verificationRepo.count({ where: { cva_id: cvaId, status: VerificationStatus.APPROVED } }),
      verificationRepo.count({ where: { cva_id: cvaId, status: VerificationStatus.REJECTED } }),
      verificationRepo.count({ where: { cva_id: cvaId, status: VerificationStatus.PENDING } })
    ]);

    res.json({
      success: true,
      data: {
        cva_id: cvaId,
        total,
        approved,
        rejected,
        pending,
        approval_rate: total > 0 ? ((approved / total) * 100).toFixed(2) : '0.00'
      }
    });
  } catch (err: any) {
    console.error('Get CVA stats error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to get CVA statistics',
      error: err.message
    });
  }
});

// CVA Verification Management
router.get('/pending', verificationController.getPendingVerifications);
router.post('/approve', verificationController.approveVerification);
router.post('/reject', verificationController.rejectVerification);

// KYC Management
router.post('/kyc/submit', verificationController.submitKYC);
router.get('/kyc/status/:userId', verificationController.getKYCStatus);

// Credit Verification & Approval
router.post('/credits/verify', verificationController.verifyCredits);
router.post('/credits/approve', verificationController.approveCredits);
router.post('/credits/reject', verificationController.rejectCredits);

// Certificates
router.get('/certificates/:userId', verificationController.getUserCertificates);
router.get('/certificates', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId query parameter is required'
      });
    }

    const certificateRepo = AppDataSource.getRepository(Certificate);
    const certificates = await certificateRepo.find({
      where: { user_id: userId },
      order: { issued_at: 'DESC' }
    });
    
    res.json(certificates);
  } catch (err: any) {
    console.error("Error fetching certificates:", err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificates',
      error: err.message
    });
  }
});

// Reports
router.get('/reports/verification', verificationController.generateVerificationReport);

// Get verifications by CVA
router.get('/cva/:cvaId', async (req, res) => {
  try {
    const verificationRepo = AppDataSource.getRepository(Verification);
    const verifications = await verificationRepo.find({
      where: { cva_id: req.params.cvaId },
      order: { created_at: 'DESC' }
    });
    res.json(verifications);
  } catch (err: any) {
    console.error("Error fetching CVA verifications:", err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch verifications',
      error: err.message 
    });
  }
});

export default router;