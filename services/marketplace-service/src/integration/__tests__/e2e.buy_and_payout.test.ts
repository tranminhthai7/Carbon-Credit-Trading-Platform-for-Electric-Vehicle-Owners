// Set required env variables for imported services
process.env.DB_HOST = process.env.DB_HOST || '127.0.0.1';
process.env.DB_PORT = process.env.DB_PORT || '5432';
process.env.DB_USERNAME = process.env.DB_USERNAME || 'test';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'test';
process.env.DB_NAME = process.env.DB_NAME || 'testdb';
process.env.STRIPE_CONNECT_MOCK = process.env.STRIPE_CONNECT_MOCK || 'true';
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_123';

import * as listingService from '../../services/listingService';
import * as apiClient from '../../utils/apiClient';
import * as orderService from '../../services/orderService';
import { AppDataSource } from '../../data-source';
import { PaymentController } from '../../../../payment-service/src/controllers/payment.controller';

jest.mock('../../utils/apiClient');
jest.mock('../../services/orderService');

describe('E2E: buy listing and process payout', () => {
  afterEach(() => jest.resetAllMocks());

  it('should buy listing and then process payout via PaymentController (mock stripe)', async () => {
    const listing: any = { id: 'l1', userId: 'seller1', amount: 10, pricePerCredit: 2, status: 'OPEN', save: jest.fn() };
    const dataSource = require('../../data-source');
    dataSource.AppDataSource.getRepository = jest.fn().mockReturnValue({ findOneBy: jest.fn().mockResolvedValue(listing) });
    dataSource.AppDataSource.transaction = jest.fn().mockImplementation(async (cb: any) => {
      return await cb({ save: async (x: any) => x, getRepository: () => ({ save: async (x: any) => ({ id: 'order-1' }) }) });
    });

    (apiClient as any).transferCredits.mockResolvedValue({ status: 200, data: { success: true } });
    const createdOrder: any = { id: 'order1' };
    (orderService as any).createOrder.mockResolvedValue(createdOrder);
    //(AppDataSource.transaction as any).mockImplementation(async (cb: any) => {
    //  return await cb({ save: async (x: any) => x, getRepository: () => ({ save: async (x: any) => ({ id: 'order-1' }) }) });
    //});

    const res = await listingService.buyListing('l1', 'buyer1');
    expect(res.order).toBeDefined();
    expect(res.listing.status).toBe('SOLD');

    // Now simulate payout processing
    process.env.STRIPE_CONNECT_MOCK = 'true';
    const controller = new PaymentController();
    const mockWithdrawal: any = {
      id: 'w1',
      user_id: 'seller1',
      amount: 100,
      fee: 2,
      net_amount: 98,
      method: 'stripe',
      bank_details: { stripe_account_id: 'acct_test_123' },
      status: 'pending'
    };
    const repo: any = (controller as any).withdrawalRepository;
    jest.spyOn(repo, 'findOne').mockResolvedValue(mockWithdrawal);
    const saveSpy = jest.spyOn(repo, 'save').mockImplementation(async (wd: any) => wd);

    const req: any = { body: { withdrawal_id: 'w1' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res2: any = { status, json };

    await controller.processWithdrawal(req as any, res2 as any);

    expect(saveSpy).toHaveBeenCalled();
    expect(mockWithdrawal.status).toBe('completed');
    expect(mockWithdrawal.transaction_id).toMatch(/^mock-stripe-tx-/);
    expect(status).toHaveBeenCalledWith(200);
  });
});
