import * as listingService from './listingService';
import * as apiClient from '../utils/apiClient';
import * as orderService from './orderService';
import { AppDataSource } from '../data-source';
import { Listing } from '../entities/Listing';

jest.mock('../utils/apiClient');
jest.mock('./orderService');
jest.mock('../data-source', () => ({ AppDataSource: { transaction: jest.fn() } }));

describe('buyListing', () => {
  afterEach(() => jest.clearAllMocks());

  it('should transfer credits and create order', async () => {
    const listing: any = { id: 'l1', userId: 'seller1', amount: 10, pricePerCredit: 2, status: 'OPEN', save: jest.fn() };
    const dataSource = require('../data-source');
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

  it('should throw when transfer fails', async () => {
    const listing: any = { id: 'l2', userId: 'seller1', amount: 10, pricePerCredit: 2, status: 'OPEN', save: jest.fn() };
    const dataSource = require('../data-source');
    dataSource.AppDataSource.getRepository = jest.fn().mockReturnValue({ findOneBy: jest.fn().mockResolvedValue(listing) });
    (apiClient as any).transferCredits.mockResolvedValue({ status: 500, data: { success: false, message: 'fail' } });

    await expect(listingService.buyListing('l2', 'buyer1')).rejects.toThrow('fail');
  });
});
