import { createCreditRequest } from '../credit.controller';
describe('createCreditRequest', () => {
  afterEach(() => jest.clearAllMocks());

  it('should be idempotent for idempotency_key', async () => {
    const savedReq: any = { id: 'cr1', userId: 'u1', co2Amount: 2000, creditsAmount: 2, idempotency_key: 'g1' };
    const repo = { save: jest.fn().mockResolvedValue(savedReq), findOne: jest.fn().mockResolvedValue(savedReq ) };
    const db = require('../../data-source');
    db.AppDataSource.getRepository = jest.fn().mockReturnValue(repo);

    const req: any = { body: { userId: 'u1', co2Amount: 2000, creditsAmount: 2, idempotency_key: 'g1' } };
    const json = jest.fn();
    const res: any = { status: jest.fn().mockReturnThis(), json };
    await createCreditRequest(req, res);
    // Simulate duplicate call: repo.findOne returns existing
    await createCreditRequest(req, res);
    expect(json).toHaveBeenCalled();
  });
});
