import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Verification, VerificationStatus } from '../entities/Verification';
import { KYC, KYCStatus } from '../entities/KYC';
import { Certificate, CertificateType } from '../entities/Certificate';
import { WalletService } from '../services/wallet.service';
import { v4 as uuidv4 } from 'uuid';

export class VerificationController {
    private verificationRepository = AppDataSource.getRepository(Verification);
    private kycRepository = AppDataSource.getRepository(KYC);
    private certificateRepository = AppDataSource.getRepository(Certificate);
    private walletService = new WalletService();

    // CVA xem pending verifications
    getPendingVerifications = async (req: Request, res: Response): Promise<void> => {
        try {
            const { page = '1', limit = '10' } = req.query;
            const pageNum = parseInt(page as string, 10);
            const limitNum = parseInt(limit as string, 10);

            const [verifications, total] = await this.verificationRepository.findAndCount({
                where: { status: VerificationStatus.PENDING },
                order: { created_at: 'DESC' },
                take: limitNum,
                skip: (pageNum - 1) * limitNum
            });

            res.json({
                success: true,
                data: {
                    verifications,
                    pagination: {
                        page: pageNum,
                        limit: limitNum,
                        total,
                        totalPages: Math.ceil(total / limitNum)
                    }
                }
            });
        } catch (error) {
            console.error('Get pending verifications error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get pending verifications'
            });
        }
    };

    // Get verifications for a specific user
    getUserVerifications = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;

            const verifications = await this.verificationRepository.find({
                where: { user_id: userId },
                order: { created_at: 'DESC' }
            });

            res.json(verifications);
        } catch (error) {
            console.error('Get user verifications error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get user verifications'
            });
        }
    };

    // Duyệt verification và cấp credits
    approveVerification = async (req: Request, res: Response): Promise<void> => {
        try {
            const { verification_id, cva_id, notes, credits_amount } = req.body;

            const verification = await this.verificationRepository.findOne({
                where: { id: verification_id }
            });

            if (!verification) {
                res.status(404).json({
                    success: false,
                    message: 'Verification not found'
                });
                return;
            }

            if (verification.status !== VerificationStatus.PENDING) {
                res.status(400).json({
                    success: false,
                    message: 'Verification already processed'
                });
                return;
            }

            // Update verification status
            verification.status = VerificationStatus.APPROVED;
            verification.cva_id = cva_id;
            verification.notes = notes;
            verification.credits_issued = credits_amount || verification.co2_amount;
            verification.reviewed_at = new Date();

            await this.verificationRepository.save(verification);

            // Issue credits to wallet
            const walletResult = await this.walletService.issueCredits({
                user_id: verification.user_id,
                amount: verification.credits_issued,
                verification_id: verification.id,
                co2_amount: verification.co2_amount,
                description: `Carbon credits for ${verification.co2_amount}kg CO2 reduction`
            });

            // Generate certificate only if wallet service succeeds or for audit trail
            const certificate = new Certificate();
            certificate.id = uuidv4();
            certificate.user_id = verification.user_id;
            certificate.verification_id = verification.id;
            certificate.type = CertificateType.CARBON_CREDIT;
            certificate.certificate_number = `CC-${Date.now()}-${verification.id.slice(0, 8)}`;
            certificate.co2_amount = verification.co2_amount;
            certificate.credits_amount = verification.credits_issued;
            certificate.description = `Carbon Credit Certificate for ${verification.co2_amount}kg CO2 reduction`;
            certificate.issued_by = cva_id;

            await this.certificateRepository.save(certificate);

            if (!walletResult.success) {
                console.error('Failed to issue credits:', walletResult.message);
                // Note: Certificate still created for audit trail
            }

            res.json({
                success: true,
                data: {
                    verification_id: verification.id,
                    status: verification.status,
                    credits_issued: verification.credits_issued,
                    certificate_id: certificate.id,
                    certificate_number: certificate.certificate_number,
                    wallet_success: walletResult.success
                }
            });
        } catch (error) {
            console.error('Approve verification error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to approve verification'
            });
        }
    };

    // Từ chối verification
    rejectVerification = async (req: Request, res: Response): Promise<void> => {
        try {
            const { verification_id, cva_id, notes } = req.body;

            const verification = await this.verificationRepository.findOne({
                where: { id: verification_id }
            });

            if (!verification) {
                res.status(404).json({
                    success: false,
                    message: 'Verification not found'
                });
                return;
            }

            if (verification.status !== VerificationStatus.PENDING) {
                res.status(400).json({
                    success: false,
                    message: 'Verification already processed'
                });
                return;
            }

            verification.status = VerificationStatus.REJECTED;
            verification.cva_id = cva_id;
            verification.notes = notes;
            verification.reviewed_at = new Date();

            await this.verificationRepository.save(verification);

            res.json({
                success: true,
                data: {
                    verification_id: verification.id,
                    status: verification.status,
                    reviewed_at: verification.reviewed_at
                }
            });
        } catch (error) {
            console.error('Reject verification error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to reject verification'
            });
        }
    };

    // Submit KYC
    submitKYC = async (req: Request, res: Response): Promise<void> => {
        try {
            const { user_id, full_name, date_of_birth, nationality, address, phone_number, documents } = req.body;

            const existingKYC = await this.kycRepository.findOne({
                where: { user_id }
            });

            if (existingKYC && existingKYC.status === KYCStatus.APPROVED) {
                res.status(400).json({
                    success: false,
                    message: 'KYC already approved for this user'
                });
                return;
            }

            const kyc = new KYC();
            kyc.id = uuidv4();
            kyc.user_id = user_id;
            kyc.full_name = full_name;
            kyc.date_of_birth = new Date(date_of_birth);
            kyc.nationality = nationality;
            kyc.address = address;
            kyc.phone_number = phone_number;
            kyc.documents = documents;
            kyc.status = KYCStatus.PENDING;

            await this.kycRepository.save(kyc);

            res.status(201).json({
                success: true,
                data: {
                    kyc_id: kyc.id,
                    status: kyc.status,
                    submitted_at: kyc.created_at
                }
            });
        } catch (error) {
            console.error('Submit KYC error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to submit KYC'
            });
        }
    };

    // Get KYC status
    getKYCStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;

            const kyc = await this.kycRepository.findOne({
                where: { user_id: userId },
                order: { created_at: 'DESC' }
            });

            if (!kyc) {
                res.status(404).json({
                    success: false,
                    message: 'KYC not found for this user'
                });
                return;
            }

            res.json({
                success: true,
                data: {
                    kyc_id: kyc.id,
                    status: kyc.status,
                    submitted_at: kyc.created_at,
                    reviewed_at: kyc.reviewed_at,
                    rejection_reason: kyc.rejection_reason
                }
            });
        } catch (error) {
            console.error('Get KYC status error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get KYC status'
            });
        }
    };

    // Verify credits (submit for verification)
    verifyCredits = async (req: Request, res: Response): Promise<void> => {
        try {
            const { user_id, vehicle_id, co2_amount, trips_count, emission_data, trip_details } = req.body;

            const verification = new Verification();
            verification.id = uuidv4();
            verification.user_id = user_id;
            verification.vehicle_id = vehicle_id;
            verification.co2_amount = co2_amount;
            verification.trips_count = trips_count;
            verification.emission_data = emission_data;
            verification.trip_details = trip_details;
            verification.status = VerificationStatus.PENDING;

            await this.verificationRepository.save(verification);

            res.status(201).json({
                success: true,
                data: {
                    verification_id: verification.id,
                    status: verification.status,
                    co2_amount: verification.co2_amount,
                    submitted_at: verification.created_at
                }
            });
        } catch (error) {
            console.error('Verify credits error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to submit verification'
            });
        }
    };

    // Approve credits (separate from verification approve)
    approveCredits = async (req: Request, res: Response): Promise<void> => {
        try {
            const { verification_id, cva_id, notes, credits_amount } = req.body;

            const verification = await this.verificationRepository.findOne({
                where: { id: verification_id }
            });

            if (!verification) {
                res.status(404).json({
                    success: false,
                    message: 'Verification not found'
                });
                return;
            }

            if (verification.status !== VerificationStatus.PENDING) {
                res.status(400).json({
                    success: false,
                    message: 'Verification already processed'
                });
                return;
            }

            // Update verification status
            verification.status = VerificationStatus.APPROVED;
            verification.cva_id = cva_id;
            verification.notes = notes;
            verification.credits_issued = credits_amount || verification.co2_amount;
            verification.reviewed_at = new Date();

            await this.verificationRepository.save(verification);

            // Issue credits to wallet
            const walletResult = await this.walletService.issueCredits({
                user_id: verification.user_id,
                amount: verification.credits_issued,
                verification_id: verification.id,
                co2_amount: verification.co2_amount,
                description: `Carbon credits approved for ${verification.co2_amount}kg CO2 reduction`
            });

            res.json({
                success: true,
                data: {
                    verification_id: verification.id,
                    status: verification.status,
                    credits_issued: verification.credits_issued,
                    wallet_success: walletResult.success,
                    reviewed_at: verification.reviewed_at
                }
            });
        } catch (error) {
            console.error('Approve credits error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to approve credits'
            });
        }
    };

    // Reject credits (separate from verification reject)
    rejectCredits = async (req: Request, res: Response): Promise<void> => {
        try {
            const { verification_id, cva_id, notes } = req.body;

            const verification = await this.verificationRepository.findOne({
                where: { id: verification_id }
            });

            if (!verification) {
                res.status(404).json({
                    success: false,
                    message: 'Verification not found'
                });
                return;
            }

            if (verification.status !== VerificationStatus.PENDING) {
                res.status(400).json({
                    success: false,
                    message: 'Verification already processed'
                });
                return;
            }

            verification.status = VerificationStatus.REJECTED;
            verification.cva_id = cva_id;
            verification.notes = notes;
            verification.reviewed_at = new Date();

            await this.verificationRepository.save(verification);

            res.json({
                success: true,
                data: {
                    verification_id: verification.id,
                    status: verification.status,
                    reviewed_at: verification.reviewed_at
                }
            });
        } catch (error) {
            console.error('Reject credits error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to reject credits'
            });
        }
    };

    // Get user certificates
    getUserCertificates = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;

            const certificates = await this.certificateRepository.find({
                where: { user_id: userId },
                order: { issued_at: 'DESC' }
            });

            res.json({
                success: true,
                data: {
                    certificates,
                    total: certificates.length
                }
            });
        } catch (error) {
            console.error('Get certificates error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get certificates'
            });
        }
    };

    // Get certificates for current authenticated user
    getCertificatesForCurrentUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Not authenticated' });
                return;
            }
            const certificates = await this.certificateRepository.find({ where: { user_id: userId }, order: { issued_at: 'DESC' } });
            res.json({ success: true, data: { certificates, total: certificates.length } });
        } catch (error) {
            console.error('Get certificates for current user error:', error);
            res.status(500).json({ success: false, message: 'Failed to get certificates' });
        }
    };

    // Download certificate PDF
    downloadCertificatePdf = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const cert = await this.certificateRepository.findOne({ where: { id } });
            if (!cert) {
                res.status(404).json({ success: false, message: 'Certificate not found' });
                return;
            }
            const userId = (req as any).user?.id;
            // Ensure user owns the certificate
            if (cert.user_id !== userId) {
                res.status(403).json({ success: false, message: 'Forbidden' });
                return;
            }

            // If certificate_url exists, redirect
            if (cert.certificate_url) {
                // For demo, redirect to certificate_url
                res.redirect(cert.certificate_url);
                return;
            }

            // Otherwise return a placeholder PDF
            const buffer = Buffer.from('%PDF-1.4\n%Placeholder PDF for certificate\n', 'utf-8');
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="certificate-${id}.pdf"`);
            res.status(200).send(buffer);
        } catch (error) {
            console.error('Download certificate error:', error);
            res.status(500).json({ success: false, message: 'Failed to download certificate' });
        }
    };

    // Create share link for certificate (no persistence for demo)
    createCertificateShareLink = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const cert = await this.certificateRepository.findOne({ where: { id } });
            if (!cert) {
                res.status(404).json({ success: false, message: 'Certificate not found' });
                return;
            }
            const userId = (req as any).user?.id;
            if (cert.user_id !== userId) {
                res.status(403).json({ success: false, message: 'Forbidden' });
                return;
            }

            const shareToken = uuidv4();
            // For demo, construct a share URL that points to the frontend /public page
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            const shareUrl = `${frontendUrl}/public/certificates/${id}?token=${shareToken}`;
            res.status(201).json({ success: true, data: { shareUrl } });
        } catch (error) {
            console.error('Create share link error:', error);
            res.status(500).json({ success: false, message: 'Failed to create share link' });
        }
    };

    // Generate verification report
    generateVerificationReport = async (req: Request, res: Response): Promise<void> => {
        try {
            const { start_date, end_date, cva_id } = req.query;

            let whereConditions: any = {};
            if (cva_id) {
                whereConditions.cva_id = cva_id;
            }

            // Build query with date filtering
            let query = this.verificationRepository.createQueryBuilder('verification');
            
            if (start_date && end_date) {
                query = query.where('verification.created_at BETWEEN :start_date AND :end_date', {
                    start_date: new Date(start_date as string),
                    end_date: new Date(end_date as string)
                });
            }
            
            if (cva_id) {
                query = query.andWhere('verification.cva_id = :cva_id', { cva_id });
            }

            // Get verification statistics
            const totalVerifications = await query.getCount();

            const approvedVerifications = await query
                .clone()
                .andWhere('verification.status = :status', { status: VerificationStatus.APPROVED })
                .getCount();

            const rejectedVerifications = await query
                .clone()
                .andWhere('verification.status = :status', { status: VerificationStatus.REJECTED })
                .getCount();

            const pendingVerifications = await query
                .clone()
                .andWhere('verification.status = :status', { status: VerificationStatus.PENDING })
                .getCount();

            // Get total CO2 and credits for approved verifications
            let approvedQuery = this.verificationRepository
                .createQueryBuilder('verification')
                .select('SUM(verification.co2_amount)', 'total_co2')
                .addSelect('SUM(verification.credits_issued)', 'total_credits')
                .where('verification.status = :status', { status: VerificationStatus.APPROVED });

            if (start_date && end_date) {
                approvedQuery = approvedQuery.andWhere('verification.created_at BETWEEN :start_date AND :end_date', {
                    start_date: new Date(start_date as string),
                    end_date: new Date(end_date as string)
                });
            }

            if (cva_id) {
                approvedQuery = approvedQuery.andWhere('verification.cva_id = :cva_id', { cva_id });
            }

            const approvedData = await approvedQuery.getRawOne();

            // Get KYC statistics
            const totalKYC = await this.kycRepository.count();
            const approvedKYC = await this.kycRepository.count({
                where: { status: KYCStatus.APPROVED }
            });

            // Get certificates issued
            const certificatesIssued = await this.certificateRepository.count({
                where: {
                    type: CertificateType.CARBON_CREDIT
                }
            });

            res.json({
                success: true,
                data: {
                    period: {
                        start_date: start_date || 'All time',
                        end_date: end_date || 'All time'
                    },
                    verification_stats: {
                        total: totalVerifications,
                        approved: approvedVerifications,
                        rejected: rejectedVerifications,
                        pending: pendingVerifications,
                        approval_rate: totalVerifications > 0 ? 
                            ((approvedVerifications / totalVerifications) * 100).toFixed(2) + '%' : '0%'
                    },
                    environmental_impact: {
                        total_co2_reduced: parseFloat(approvedData.total_co2) || 0,
                        total_credits_issued: parseFloat(approvedData.total_credits) || 0
                    },
                    kyc_stats: {
                        total_submissions: totalKYC,
                        approved: approvedKYC,
                        approval_rate: totalKYC > 0 ? 
                            ((approvedKYC / totalKYC) * 100).toFixed(2) + '%' : '0%'
                    },
                    certificates: {
                        total_issued: certificatesIssued
                    },
                    generated_at: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Generate report error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate verification report'
            });
        }
    };

    // Get verification statistics for dashboard
    getStats = async (req: Request, res: Response): Promise<void> => {
        try {
            const total = await this.verificationRepository.count();
            const approved = await this.verificationRepository.count({ where: { status: VerificationStatus.APPROVED } });
            const rejected = await this.verificationRepository.count({ where: { status: VerificationStatus.REJECTED } });
            const pending = await this.verificationRepository.count({ where: { status: VerificationStatus.PENDING } });

            res.json({
                total,
                approved,
                rejected,
                pending
            });
        } catch (error) {
            console.error('Get stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get verification statistics'
            });
        }
    }

    // Get recent verification activities
    getRecentActivities = async (req: Request, res: Response): Promise<void> => {
        try {
            const recentVerifications = await this.verificationRepository.find({
                order: { updated_at: 'DESC' },
                take: 10
            });

            res.json(recentVerifications);
        } catch (error) {
            console.error('Get recent activities error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get recent verification activities'
            });
        }
    }
}