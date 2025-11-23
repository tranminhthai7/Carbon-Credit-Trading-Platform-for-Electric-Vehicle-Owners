// Full E2E flow: import -> generate -> request -> verify -> issue -> list -> buy -> payout
// Ensure required env vars are set before importing any service modules which read envConfig
process.env.DB_HOST = process.env.DB_HOST || '127.0.0.1';
process.env.DB_PORT = process.env.DB_PORT || '5432';
process.env.DB_USERNAME = process.env.DB_USERNAME || 'test';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'test';
process.env.DB_NAME = process.env.DB_NAME || 'testdb';
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_123';
process.env.WALLET_SERVICE_URL = process.env.WALLET_SERVICE_URL || 'http://localhost:4000';
process.env.API_SECRET_KEY = process.env.API_SECRET_KEY || 'test_api_secret';
process.env.STRIPE_CONNECT_MOCK = process.env.STRIPE_CONNECT_MOCK || 'true';
import 'reflect-metadata';
import { importTrips, generateCredits } from '../../controllers/trip.controller';
// Mock verification client in carbon-credit-service to avoid real network calls (prevents open sockets)
jest.mock('../../../../carbon-credit-service/src/utils/verificationClient', () => ({
  submitVerification: jest.fn().mockResolvedValue({ status: 200, data: {} })
}));
import { createCreditRequest } from '../../../../carbon-credit-service/src/controllers/credit.controller';
import { VerificationController } from '../../../../verification-service/src/controllers/verification.controller';
import * as creditClient from '../../utils/creditClient';
import * as listingService from '../../../../marketplace-service/src/services/listingService';
import * as apiClient from '../../../../marketplace-service/src/utils/apiClient';
import { PaymentController } from '../../../../payment-service/src/controllers/payment.controller';

describe('E2E: complete flow import->generate->verify->list->buy->payout', () => {
  afterEach(() => jest.resetAllMocks());

  it('should perform full flow with mocks across services', async () => {
    // 1. Setup vehicle
    const mockVehicle: any = {
      _id: 'veh1',
      user_id: 'seller1',
      trips: [],
      total_distance_km: 0,
      total_co2_saved_kg: 0,
      save: jest.fn(async function () { return this; }),
    };
    jest.spyOn(require('../../models/vehicle.model').Vehicle, 'findOne' as any).mockResolvedValue(mockVehicle);

    // 2. Import trips
    const csv = `start_time,end_time,distance_km,start_lat,start_long,end_lat,end_long,notes\n${new Date().toISOString()},${new Date().toISOString()},10000,10,10,11,11,trip1`;
    const file = { buffer: Buffer.from(csv, 'utf-8') } as any;
    const importReq: any = { params: { id: 'veh1' }, file, user: { id: 'seller1' }, headers: { 'idempotency-key': 'import-key' } };
    await importTrips(importReq, { status: jest.fn().mockReturnThis(), json: jest.fn() } as any);
    console.log('Imported trips');

    // 3. Generate credits
    const submitted: any = {};
    jest.spyOn(creditClient, 'submitCreditRequest' as any).mockImplementation(async (payload: any) => {
      submitted.payload = payload;
      return { data: { id: 'req1' } };
    });
    await generateCredits({ params: { id: 'veh1' }, user: { id: 'seller1' }, headers: { 'idempotency-key': 'gen-key' } } as any, { status: jest.fn().mockReturnThis(), json: jest.fn() } as any);
    console.log('Generated credits');
    expect(submitted.payload).toBeDefined();

    // 4. Create credit request in carbon-credit service (stub repo)
    const savedCreditReq: any = { id: 'cr1', userId: 'seller1', co2Amount: submitted.payload.co2Amount, creditsAmount: submitted.payload.creditsAmount, idempotency_key: 'gen-key' };
    const repo = { save: jest.fn().mockResolvedValue(savedCreditReq), findOne: jest.fn().mockResolvedValue(undefined) };
    const db = require('../../../../carbon-credit-service/src/data-source');
    db.AppDataSource.getRepository = jest.fn().mockReturnValue(repo);
    await createCreditRequest({ body: submitted.payload } as any, { status: jest.fn().mockReturnThis(), json: jest.fn() } as any);
    console.log('Created credit request');

    // 5. Verification approval (wallet issuance)
    const verificationRepo = { findOne: jest.fn().mockResolvedValue({ id: 'v1', user_id: 'seller1', status: 'pending', co2_amount: savedCreditReq.co2Amount, credits_issued: 0 }), save: jest.fn().mockResolvedValue(true) };
    const certRepo = { save: jest.fn().mockResolvedValue({ id: 'c1' }) };
    const dbv = require('../../../../verification-service/src/config/database');
    dbv.AppDataSource.getRepository = jest.fn().mockImplementation((arg: any) => {
      if (arg && arg.name && arg.name.toLowerCase().includes('verification')) return verificationRepo;
      if (arg && arg.name && arg.name.toLowerCase().includes('certificate')) return certRepo;
      return { findOne: jest.fn(), save: jest.fn() };
    });
    const verificationController = new VerificationController();
    (verificationController as any).walletService.issueCredits = jest.fn().mockResolvedValue({ success: true, data: {} });
    await verificationController.approveVerification({ body: { verification_id: 'v1', cva_id: 'cva1', credits_amount: 2 } } as any, { status: jest.fn().mockReturnThis(), json: jest.fn() } as any);
    console.log('Approved verification and issued credits');
    expect((verificationController as any).walletService.issueCredits).toHaveBeenCalled();

    // 6. Seller creates a listing
    const listing: any = { id: 'l1', userId: 'seller1', amount: 2, pricePerCredit: 3, status: 'OPEN', save: jest.fn() };
    const listingDb = require('../../../../marketplace-service/src/data-source');
    listingDb.AppDataSource.getRepository = jest.fn().mockReturnValue({ create: jest.fn().mockReturnValue(listing), save: jest.fn().mockResolvedValue(listing) });
    try {
      const createdListing = await require('../../../../marketplace-service/src/services/listingService').createListing('seller1', 2, 3);
      console.log('Created listing');
      expect(createdListing).toBeDefined();
    } catch (err: any) {
      console.error('createListing exception:', err?.message || err);
      throw err;
    }

    // 7. Buyer buys listing: mock transferCredits and order creation
    jest.spyOn(apiClient, 'transferCredits' as any).mockResolvedValue({ status: 200, data: { success: true } });
    const orderService = require('../../../../marketplace-service/src/services/orderService');
    orderService.createOrder = jest.fn().mockResolvedValue({ id: 'order1' });
    try {
      const listingRepoMock = { findOneBy: jest.fn().mockResolvedValue(listing), save: jest.fn() };
      listingDb.AppDataSource.getRepository = jest.fn().mockReturnValue(listingRepoMock);
      listingDb.AppDataSource.transaction = jest.fn().mockImplementation(async (cb: any) => {
        return await cb({ save: async (x: any) => x, getRepository: () => ({ save: async (x: any) => ({ id: 'order-1' }) }) });
      });
      const result = await require('../../../../marketplace-service/src/services/listingService').buyListing('l1', 'buyer1');
      console.log('Executed buy listing');
      expect(result.order).toBeDefined();
    } catch (err: any) {
      console.error('buyListing exception:', err?.message || err);
      throw err;
    }

    // 8. Process payout (withdrawal) via payment service
    process.env.STRIPE_CONNECT_MOCK = 'true';
    const controller = new PaymentController();
    const mockWithdrawal: any = { id: 'w1', user_id: 'seller1', amount: 6, fee: 0.3, net_amount: 5.7, method: 'stripe', bank_details: { stripe_account_id: 'acct_test' }, status: 'pending' };
    const repoW: any = (controller as any).withdrawalRepository;
    jest.spyOn(repoW, 'findOne').mockResolvedValue(mockWithdrawal);
    jest.spyOn(repoW, 'save').mockImplementation(async (wd: any) => wd);
    process.env.STRIPE_CONNECT_MOCK = 'true';
    await controller.processWithdrawal({ body: { withdrawal_id: 'w1' } } as any, { status: jest.fn().mockReturnThis(), json: jest.fn() } as any);
    console.log('Processed withdrawal');
    expect(mockWithdrawal.status).toBe('completed');
  });
});
