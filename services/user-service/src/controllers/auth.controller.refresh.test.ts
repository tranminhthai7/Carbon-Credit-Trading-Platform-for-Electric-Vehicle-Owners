import { refresh } from './auth.controller';
import { query } from '../config/database';

jest.mock('../config/database');

describe('refresh controller', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    mockReq = { cookies: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    };
    mockNext = jest.fn();
    (query as jest.MockedFunction<any>).mockReset();
  });

  it('returns 401 if no refresh cookie', async () => {
    await refresh(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'No refresh token' });
  });

  it('returns 401 if token not found in DB', async () => {
    mockReq.cookies.refreshToken = 'abc';
    (query as jest.MockedFunction<any>).mockResolvedValue({ rows: [] });
    await refresh(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Invalid refresh token' });
  });
});
