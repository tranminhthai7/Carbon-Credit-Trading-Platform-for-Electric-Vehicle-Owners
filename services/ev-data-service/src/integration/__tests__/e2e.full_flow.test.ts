// Set required env vars before importing any modules that load envConfig or database connections
process.env.DB_HOST = process.env.DB_HOST || '127.0.0.1';
process.env.DB_PORT = process.env.DB_PORT || '5432';
process.env.DB_USERNAME = process.env.DB_USERNAME || 'test';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'test';
process.env.DB_NAME = process.env.DB_NAME || 'testdb';
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_123';
process.env.WALLET_SERVICE_URL = process.env.WALLET_SERVICE_URL || 'http://localhost:4000';
process.env.API_SECRET_KEY = process.env.API_SECRET_KEY || 'test_api_secret';
import 'reflect-metadata';
import { generateCredits } from '../../controllers/trip.controller';
import { createCreditRequest } from '../../../../carbon-credit-service/src/controllers/credit.controller';
import { VerificationController } from '../../../../verification-service/src/controllers/verification.controller';

import * as creditClient from '../../utils/creditClient';

describe('E2E: import->generate->createCreditRequest->approve->issue', () => {
  afterEach(() => jest.resetAllMocks());

  it('should execute the full flow and call wallet.issueCredits', async () => {
    // Setup: vehicle that has >1000 kg CO2 saved
    const mockVehicle: any = {
      _id: 'veh1',
      user_id: 'user1',
      trips: [ { co2_saved_kg: 2000 } ],
      credit_request_keys: [],
      save: jest.fn(async function () { return this; }),
    };
    jest.spyOn(require('../../models/vehicle.model').Vehicle, 'findOne' as any).mockResolvedValue(mockVehicle);

    // Intercept submitCreditRequest to capture payload and simulate call to carbon-credit create handler
    const capturedPayload: any = {};
    jest.spyOn(creditClient, 'submitCreditRequest' as any).mockImplementation(async (payload: any) => {
      capturedPayload.payload = payload;
      // Simulate a call to create credit request controller but we will call it below for clarity
      return { data: { id: 'cr1' } };
    });

    const genReq: any = { params: { id: 'veh1' }, body: {}, user: { id: 'user1' }, headers: { 'idempotency-key': 'g1' } };
    const status1 = jest.fn().mockReturnThis();
    const json1 = jest.fn();
    const res1: any = { status: status1, json: json1 };

    await generateCredits(genReq, res1);
    expect(status1).toHaveBeenCalledWith(201);
    expect(capturedPayload.payload).toBeDefined();

    // Now simulate createCreditRequest: stub out the credit repo and verification client
    const savedCreditReq: any = { id: 'cr1', userId: 'user1', co2Amount: capturedPayload.payload.co2Amount, creditsAmount: capturedPayload.payload.creditsAmount };
    const repo = { save: jest.fn().mockResolvedValue(savedCreditReq), findOne: jest.fn().mockResolvedValue(undefined) };
    const db = require('../../../../carbon-credit-service/src/data-source');
    db.AppDataSource.getRepository = jest.fn().mockReturnValue(repo);

    const createReq: any = { body: capturedPayload.payload };
    const json2 = jest.fn();
    const res2: any = { status: jest.fn().mockReturnThis(), json: json2 };
    await createCreditRequest(createReq, res2);
    expect(repo.save).toHaveBeenCalled();

    // Simulate verification approval: set up the verification repo and wallet service
    const verificationRepo = { findOne: jest.fn().mockResolvedValue({ id: 'v1', user_id: 'user1', status: 'pending', co2_amount: savedCreditReq.co2Amount, credits_issued: 0 }), save: jest.fn().mockResolvedValue(true) };
    const certRepo = { save: jest.fn().mockResolvedValue({ id: 'c1' }) };
    const dbv = require('../../../../verification-service/src/config/database');
    dbv.AppDataSource.getRepository = jest.fn().mockImplementation((arg: any) => {
      if (arg && arg.name && arg.name.toLowerCase().includes('verification')) return verificationRepo;
      if (arg && arg.name && arg.name.toLowerCase().includes('certificate')) return certRepo;
      return { findOne: jest.fn(), save: jest.fn() };
    });

    // Mock wallet service on controller instance
    const verificationController = new VerificationController();
    (verificationController as any).walletService.issueCredits = jest.fn().mockResolvedValue({ success: true, data: {} });
    const approveReq: any = { body: { verification_id: 'v1', cva_id: 'cva1', credits_amount: 2 } };
    const json3 = jest.fn();
    const res3: any = { status: jest.fn().mockReturnThis(), json: json3 };
    await verificationController.approveVerification(approveReq, res3);

    expect(verificationRepo.save).toHaveBeenCalled();
    expect((verificationController as any).walletService.issueCredits).toHaveBeenCalled();
    expect(json3).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});
