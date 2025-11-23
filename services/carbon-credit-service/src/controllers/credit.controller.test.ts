import { createCreditRequest } from './credit.controller';
import { AppDataSource } from '../data-source';

jest.mock('../data-source', () => ({ AppDataSource: { getRepository: jest.fn().mockReturnValue({ save: jest.fn().mockResolvedValue({ id: 'req1', userId: 'u1', co2Amount: 10, creditsAmount: 1 }) }) } }));
jest.mock('../utils/verificationClient', () => ({ submitVerification: jest.fn().mockResolvedValue({ status: 201, data: { success: true } }) }));

describe('createCreditRequest', () => {
  it('should create a credit request', async () => {
    const req: any = { body: { userId: 'u1', co2Amount: 10, creditsAmount: 1 } };
    const json = jest.fn();
    const status = jest.fn().mockReturnThis();
    const res: any = { status, json };

    await createCreditRequest(req, res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    const { submitVerification } = require('../utils/verificationClient');
    expect(submitVerification).toHaveBeenCalled();
    expect((submitVerification as jest.Mock).mock.calls[0][0]).toEqual(expect.objectContaining({ user_id: 'u1', co2_amount: 10, credits_amount: 1 }));
  });
});
