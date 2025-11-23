import { VerificationController } from '../verification.controller';
import { AppDataSource } from '../../config/database';
import * as walletService from '../../services/wallet.service';

jest.mock('../../config/database', () => ({ AppDataSource: { getRepository: jest.fn() } }));
jest.mock('../../services/wallet.service', () => ({ WalletService: jest.fn().mockImplementation(() => ({ issueCredits: jest.fn().mockResolvedValue({ success: true, data: {} }) })) }));

describe('approveVerification', () => {
  afterEach(() => jest.clearAllMocks());
  it('approves verification and issues credits', async () => {
    const verificationRepo = { findOne: jest.fn().mockResolvedValue({ id: 'v1', user_id: 'u1', status: 'pending', co2_amount: 10, credits_issued: 0 }), save: jest.fn().mockResolvedValue(true) };
    const kycRepo = { findOne: jest.fn() };
    const certRepo = { save: jest.fn().mockResolvedValue({ id: 'c1' }) };
    const db = require('../../config/database');
    db.AppDataSource.getRepository.mockImplementation((arg: any) => {
      if (arg && arg.name && arg.name.toLowerCase().includes('verification')) return verificationRepo;
      if (arg && arg.name && arg.name.toLowerCase().includes('certificate')) return certRepo;
      return { findOne: jest.fn(), save: jest.fn() };
    });

    const req: any = { body: { verification_id: 'v1', cva_id: 'cva1', credits_amount: 5 } };
    const controller = new VerificationController();
    const json = jest.fn();
    const res: any = { status: jest.fn().mockReturnThis(), json };

    await controller.approveVerification(req, res);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});
