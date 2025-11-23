// Provide a manual mock for apiClient so importing modules that use
// import.meta don't accidentally break under Jest (which doesn't provide
// import.meta.env). We mock the apiClient before requiring the service.
const mockPost = jest.fn();
jest.mock('../api', () => ({ apiClient: { post: mockPost } }));

const { tripService } = require('../trip.service');

describe('tripService.createTrip', () => {

  beforeEach(() => jest.clearAllMocks());

  it('normalizes camelCase payload and POSTs JSON', async () => {
    mockPost.mockResolvedValueOnce({ data: { id: 't1' } });
    const inPayload = {
      startTime: '2000-11-11T04:11:00.000Z',
      endTime: '2001-11-11T04:11:00.000Z',
      distance: 111,
      energyConsumed: 111,
    } as any;

    const res = await tripService.createTrip(inPayload);

    expect(mockPost).toHaveBeenCalledTimes(1);
    const [url, body] = mockPost.mock.calls[0];
    expect(url).toBe('/api/vehicles/trips');
    expect(body.start_time).toBe('2000-11-11T04:11:00.000Z');
    expect(body.end_time).toBe('2001-11-11T04:11:00.000Z');
    expect(body.distance_km).toBe(111);
    // createTrip now normalizes server responses and returns a Trip-shaped object
    expect(res.id).toBe('t1');
  });

  it('accepts snake_case payload and posts normalized object', async () => {
    mockPost.mockResolvedValueOnce({ data: { id: 't2' } });
    const inPayload = {
      start_time: '2000-11-11T04:11:00.000Z',
      end_time: '2001-11-11T04:11:00.000Z',
      distance_km: 12.5,
      energy_consumed: 6.2,
    } as any;

    const res = await tripService.createTrip(inPayload);

    expect(mockPost).toHaveBeenCalledTimes(1);
    const [url, body] = mockPost.mock.calls[0];
    expect(body.distance_km).toBe(12.5);
    expect(body.energy_consumed).toBe(6.2);
    expect(res.id).toBe('t2');
  });

  it('throws when missing or invalid required fields', async () => {
    await expect(
      // missing dates
      tripService.createTrip({ distance: 10 } as any)
    ).rejects.toThrow(/start_time and end_time are required/);

    await expect(
      // invalid distance (less than server's min 0.1 km)
      tripService.createTrip({ startTime: '2000-11-11T04:11:00.000Z', endTime: '2001-11-11T04:11:00.000Z', distance: 0 } as any)
    ).rejects.toThrow(/distance must be at least 0.1 km/);
  });

  it('normalizes a server wrapper response where data.trip exists', async () => {
    const serverTrip = { _id: 'abc123', start_time: '2000-11-11T04:11:00.000Z', end_time: '2000-11-11T05:11:00.000Z', distance_km: 7.5 };
    mockPost.mockResolvedValueOnce({ data: { success: true, message: 'Trip added', data: { trip: serverTrip } } });

    const inPayload = {
      startTime: '2000-11-11T04:11:00.000Z',
      endTime: '2000-11-11T05:11:00.000Z',
      distance: 7.5,
      vehicleId: 'v1',
    } as any;

    const res = await tripService.createTrip(inPayload);
    expect(res).toBeTruthy();
    expect(res.id).toBe('abc123');
    expect(res.distance).toBe(7.5);
    expect(res.vehicleId).toBe('v1');
  });

  it('normalizes a server wrapper where data is already frontend-shaped', async () => {
    const serverOut = { id: 'tout', vehicleId: 'v9', startTime: '2000-11-11T04:11:00.000Z', endTime: '2000-11-11T05:11:00.000Z', distance: 55 };
    mockPost.mockResolvedValueOnce({ data: { success: true, message: 'Trip created', data: serverOut } });

    const out = await tripService.createTrip({ startTime: serverOut.startTime, endTime: serverOut.endTime, distance: serverOut.distance, vehicleId: serverOut.vehicleId } as any);
    expect(out).toBeTruthy();
    expect(out.id).toBe('tout');
    expect(out.vehicleId).toBe('v9');
    expect(out.distance).toBe(55);
  });
});
