// Provide minimal env values required by config/env.ts
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_USERNAME = process.env.DB_USERNAME || 'test';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'test';
process.env.DB_NAME = process.env.DB_NAME || 'test';
process.env.WALLET_SERVICE_URL = process.env.WALLET_SERVICE_URL || 'http://wallet';
process.env.API_SECRET_KEY = process.env.API_SECRET_KEY || 'secret';

import { VerificationController } from '../verification.controller';
import { AppDataSource } from '../../config/database';
import { Certificate } from '../../entities/Certificate';

jest.mock('../../config/database', () => ({ AppDataSource: { getRepository: jest.fn().mockReturnValue({ find: jest.fn().mockResolvedValue([]), findOne: jest.fn().mockResolvedValue(null) }) } }));

describe('Verification Certificates endpoints', () => {
  const controller = new VerificationController();
  afterEach(() => jest.clearAllMocks());

  it('should return certificates for current user', async () => {
    const mockCerts = [{ id: 'c1', user_id: 'u1' }];
    const repo = AppDataSource.getRepository(Certificate as any);
    (repo.find as jest.Mock).mockResolvedValueOnce(mockCerts);

    const req: any = { user: { id: 'u1' } };
    const json = jest.fn();
    const res: any = { status: jest.fn().mockReturnThis(), json };
    await controller.getCertificatesForCurrentUser(req, res);
    expect(json).toHaveBeenCalledWith({ success: true, data: { certificates: mockCerts, total: mockCerts.length } });
  });

  it('should 404 when downloading non-existing certificate', async () => {
    const req: any = { user: { id: 'u1' }, params: { id: 'does-not-exist' } };
    const json = jest.fn();
    const status = jest.fn().mockReturnThis();
    const res: any = { status, json, setHeader: jest.fn(), send: jest.fn(), redirect: jest.fn() };
    await controller.downloadCertificatePdf(req, res);
    expect(status).toHaveBeenCalledWith(404);
  });

  it('should create a share link for an existing certificate', async () => {
    const mockCert = { id: 'c1', user_id: 'u1' };
    const repo = AppDataSource.getRepository(Certificate as any);
    (repo.findOne as jest.Mock).mockResolvedValueOnce(mockCert);

    const req: any = { user: { id: 'u1' }, params: { id: 'c1' } };
    const json = jest.fn();
    const status = jest.fn().mockReturnThis();
    const res: any = { status, json };
    await controller.createCertificateShareLink(req, res);
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: expect.objectContaining({ shareUrl: expect.any(String) }) }));
  });
});
