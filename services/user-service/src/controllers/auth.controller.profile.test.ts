import { getProfile, updateProfile } from './auth.controller';
import { query } from '../config/database';

jest.mock('../config/database');

describe('User Profile', () => {
  afterEach(() => jest.clearAllMocks());

  it('should return profile data for authenticated user', async () => {
    const mockUser = { id: 'user-1', email: 'user@test.local', role: 'ev_owner', full_name: 'Test', phone: '+123456' };
    (query as jest.MockedFunction<typeof query>).mockResolvedValueOnce({ rows: [mockUser] } as any);

    const req: any = { user: { id: 'user-1' } };
    const json = jest.fn();
    const res: any = { status: jest.fn().mockReturnThis(), json };
    const next = jest.fn();

    await getProfile(req, res, next);

    expect(json).toHaveBeenCalledWith({ success: true, data: mockUser });
  });

  it('should update profile data and return new data', async () => {
    const updatedUser = { id: 'user-1', email: 'user@test.local', role: 'ev_owner', full_name: 'Updated', phone: '+999' };
    (query as jest.MockedFunction<typeof query>).mockResolvedValueOnce({ rows: [updatedUser] } as any);

    const req: any = { user: { id: 'user-1' }, body: { full_name: 'Updated', phone: '+999' } };
    const json = jest.fn();
    const res: any = { status: jest.fn().mockReturnThis(), json };
    const next = jest.fn();

    await updateProfile(req, res, next);

    expect(json).toHaveBeenCalledWith({ success: true, data: updatedUser });
  });
});
