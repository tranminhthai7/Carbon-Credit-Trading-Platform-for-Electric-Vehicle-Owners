// Set required environment variables for tests before importing modules that use envConfig
process.env.DB_HOST = '127.0.0.1';
process.env.DB_USERNAME = 'testuser';
process.env.DB_PASSWORD = 'testpass';
process.env.DB_NAME = 'testdb';
process.env.STRIPE_SECRET_KEY = 'sk_test_12345';

import { PaymentController } from '../../controllers/payment.controller';
import { envConfig } from '../../config/env';

describe('PaymentController.processWithdrawal', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should process a STRIPE withdrawal in mock mode and set status to COMPLETED', async () => {
    const controller = new PaymentController();
    // enable mock
    (envConfig as any).STRIPE_CONNECT_MOCK = true;

    const mockWithdrawal: any = {
      id: 'w1',
      user_id: 'u1',
      amount: 100,
      fee: 2,
      net_amount: 98,
      method: 'stripe',
      bank_details: { stripe_account_id: 'acct_test_123' },
      status: 'pending'
    };

    // Access private repository via cast
    const repo: any = (controller as any).withdrawalRepository;
    jest.spyOn(repo, 'findOne').mockResolvedValue(mockWithdrawal);
    const saveSpy = jest.spyOn(repo, 'save').mockImplementation(async (wd: any) => wd);

    const req: any = { body: { withdrawal_id: 'w1' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await controller.processWithdrawal(req as any, res as any);

    expect(saveSpy).toHaveBeenCalled();
    expect(mockWithdrawal.status).toBe('completed');
    expect(mockWithdrawal.transaction_id).toMatch(/^mock-stripe-tx-/);
    expect(status).toHaveBeenCalledWith(200);
  });
});
