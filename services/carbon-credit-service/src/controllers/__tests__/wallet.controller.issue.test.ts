import { issueCreditsHandler } from '../walletController';
import * as walletService from '../../services/walletService';

jest.mock('../../services/walletService');

describe('issueCreditsHandler', () => {
  afterEach(() => jest.clearAllMocks());

  it('should call mintCredits and return success', async () => {
    (walletService as any).mintCredits.mockResolvedValue({ wallet: { userId: 'u1', balance: 10 }, tx: { id: 'tx1' } });
    const req: any = { body: { user_id: 'u1', amount: 5 } };
    const json = jest.fn();
    const res: any = { status: jest.fn().mockReturnThis(), json };
    await issueCreditsHandler(req, res);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});
