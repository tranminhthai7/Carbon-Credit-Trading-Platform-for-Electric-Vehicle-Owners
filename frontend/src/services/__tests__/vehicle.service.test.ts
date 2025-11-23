// Mock the api client used by the service
const mockPost = jest.fn();
const mockGet = jest.fn();
jest.mock('../api', () => ({ apiClient: { post: mockPost, get: mockGet } }));

const { vehicleService } = require('../trip.service');

describe('vehicleService.registerVehicle', () => {
  beforeEach(() => jest.clearAllMocks());

  it('normalizes registrationNumber -> license_plate and batteryCapacity -> battery_capacity', async () => {
    mockPost.mockResolvedValueOnce({ data: { id: 'v1' } });

    const payload = { make: 'Nissan', model: 'Leaf', year: 2021, batteryCapacity: 40, registrationNumber: 'ABC123' };
    const res = await vehicleService.registerVehicle(payload);

    expect(mockPost).toHaveBeenCalledTimes(1);
    const [url, body] = mockPost.mock.calls[0];
    expect(url).toBe('/api/vehicles');
    expect(body.battery_capacity).toBe(40);
    expect(body.license_plate).toBe('ABC123');
    expect(res).toEqual({ id: 'v1' });
  });

  it('propagates axios errors with status and message (eg. 409 conflict)', async () => {
    const err: any = new Error('Request failed');
    err.response = { status: 409, data: { message: 'License plate already registered' } };
    mockPost.mockRejectedValueOnce(err);

    await expect(vehicleService.registerVehicle({ make: 'a', model: 'b', year: 2020, batteryCapacity: 20, registrationNumber: 'X' })).rejects.toMatchObject({
      message: 'License plate already registered',
      status: 409,
    });
  });
});
