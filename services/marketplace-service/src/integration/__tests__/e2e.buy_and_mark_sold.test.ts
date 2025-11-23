import * as listingService from '../../services/listingService';
import * as apiClient from '../../utils/apiClient';
import * as orderService from '../../services/orderService';
jest.mock('../../services/orderService');
jest.mock('../../utils/apiClient');
import { AppDataSource } from '../../data-source';

jest.mock('../../data-source', () => ({ AppDataSource: { transaction: jest.fn() } }));

describe('E2E: buy listing and mark sold', () => {
  afterEach(() => jest.resetAllMocks());

  it('should buy a listing and mark it sold', async () => {
    const listing: any = { id: 'l1', userId: 'seller1', amount: 10, pricePerCredit: 2, status: 'OPEN', save: jest.fn() };
    const dataSource = require('../../data-source');
    dataSource.AppDataSource.getRepository = jest.fn().mockReturnValue({ findOneBy: jest.fn().mockResolvedValue(listing) });

    (apiClient as any).transferCredits.mockResolvedValue({ status: 200, data: { success: true } });
    const createdOrder: any = { id: 'order1' };
    (orderService as any).createOrder.mockResolvedValue(createdOrder);
    (AppDataSource.transaction as any).mockImplementation(async (cb: any) => {
      return await cb({ save: async (x: any) => x, getRepository: () => ({ save: async (x: any) => ({ id: 'order-1' }) }) });
    });

    const res = await listingService.buyListing('l1', 'buyer1');
    expect(res.order).toBeDefined();
    expect(res.listing.status).toBe('SOLD');
  });
});
