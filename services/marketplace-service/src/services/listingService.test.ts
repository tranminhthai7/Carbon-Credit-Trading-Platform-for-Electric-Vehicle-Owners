import { getListingById } from './listingService';
import { AppDataSource } from '../data-source';
import { jest } from '@jest/globals';
import { Listing } from '../entities/Listing';

describe('listingService.getListingById', () => {
  const mockRepo: any = { findOneBy: jest.fn() };
  beforeAll(() => {
    // Mock the AppDataSource.getRepository to return mockRepo
    jest.spyOn(AppDataSource, 'getRepository' as any).mockImplementation(() => mockRepo);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should return listing when found', async () => {
    const listing: Partial<Listing> = { id: 'abc', userId: 'u1', amount: 5 };
    mockRepo.findOneBy.mockResolvedValue(listing);
    const res = await getListingById('abc');
    expect(res).toEqual(listing);
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 'abc' });
  });

  it('should return null when not found', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    const res = await getListingById('does-not-exist');
    expect(res).toBeNull();
  });
});
