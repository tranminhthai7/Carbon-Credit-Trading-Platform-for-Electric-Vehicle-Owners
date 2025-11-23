import { addTrip, addTripToDefaultVehicle, generateCredits, importTrips } from '../trip.controller';
import { Vehicle } from '../../models/vehicle.model';
import * as creditClient from '../../utils/creditClient';

describe('addTrip controller', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should add a trip and update vehicle totals', async () => {
    const mockVehicle: any = {
      _id: 'veh1',
      user_id: 'user1',
      trips: [],
      total_distance_km: 0,
      total_co2_saved_kg: 0,
      save: jest.fn(async function () { return this; }),
    };

    jest.spyOn(Vehicle, 'findOne' as any).mockResolvedValue(mockVehicle);

    const now = new Date();
    const req: any = {
      params: { id: 'veh1' },
      body: {
        start_time: new Date(now.getTime() - 60000).toISOString(),
        end_time: now.toISOString(),
        distance_km: 12.345,
        start_location: { latitude: 10, longitude: 10 },
        end_location: { latitude: 11, longitude: 11 },
        notes: 'short trip',
        energy_consumed: 7.5,
      },
      user: { id: 'user1' },
    };

    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await addTrip(req, res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalled();

    const responseArg = json.mock.calls[0][0];
    expect(responseArg.success).toBe(true);
    // energy_consumed from request should be reflected in trip returned
    expect(responseArg.data.trip.energy_consumed).toBe(7.5);
    expect(responseArg.data.vehicle_totals.total_trips).toBe(1);
    expect(responseArg.data.vehicle_totals.total_distance_km).toBeGreaterThan(0);
    expect(mockVehicle.save).toHaveBeenCalled();
  });

  it('should accept start_location/end_location given as strings and coerce them', async () => {
    const mockVehicle: any = {
      _id: 'veh1',
      user_id: 'user1',
      trips: [],
      total_distance_km: 0,
      total_co2_saved_kg: 0,
      save: jest.fn(async function () { return this; }),
    };

    jest.spyOn(Vehicle, 'findOne' as any).mockResolvedValue(mockVehicle);

    const now = new Date();
    const req: any = {
      params: { id: 'veh1' },
      body: {
        start_time: new Date(now.getTime() - 60000).toISOString(),
        end_time: now.toISOString(),
        distance_km: 12.345,
        // start_location as simple comma string, end_location as space-separated string
        start_location: '10.5,20.5',
        end_location: '11 21',
        notes: 'string coords',
        energy_consumed: 7.5,
      },
      user: { id: 'user1' },
    };

    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await addTrip(req, res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalled();
    const responseArg = json.mock.calls[0][0];
    expect(responseArg.success).toBe(true);
    // ensure location values were parsed into numeric lat/lon on the vehicle saved data
    expect(mockVehicle.save).toHaveBeenCalled();
    expect(mockVehicle.trips.length).toBe(1);
    const savedTrip = mockVehicle.trips[0];
    expect(savedTrip.start_location.latitude).toBeCloseTo(10.5);
    expect(savedTrip.start_location.longitude).toBeCloseTo(20.5);
    expect(savedTrip.end_location.latitude).toBeCloseTo(11);
    expect(savedTrip.end_location.longitude).toBeCloseTo(21);
  });

  it('should return 400 for negative distance', async () => {
    const mockVehicle: any = {
      _id: 'veh1',
      user_id: 'user1',
      trips: [],
      total_distance_km: 0,
      total_co2_saved_kg: 0,
      save: jest.fn(async function () { return this; }),
    };

    jest.spyOn(Vehicle, 'findOne' as any).mockResolvedValue(mockVehicle);

    const now = new Date();
    const req: any = {
      params: { id: 'veh1' },
      body: {
        start_time: new Date(now.getTime() - 60000).toISOString(),
        end_time: now.toISOString(),
        distance_km: -5,
        start_location: { latitude: 10, longitude: 10 },
        end_location: { latitude: 11, longitude: 11 },
        notes: 'invalid trip',
      },
      user: { id: 'user1' },
    };

    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await addTrip(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalled();
    const responseArg = json.mock.calls[0][0];
    expect(responseArg.success).toBe(false);
    expect(responseArg.errors[0].field).toBe('distance_km');
  });

  it('should accept camelCase energyConsumed and persist it', async () => {
    const mockVehicle: any = {
      _id: 'veh1',
      user_id: 'user1',
      trips: [],
      total_distance_km: 0,
      total_co2_saved_kg: 0,
      save: jest.fn(async function () { return this; }),
    };

    jest.spyOn(Vehicle, 'findOne' as any).mockResolvedValue(mockVehicle);

    const now = new Date();
    const req: any = {
      params: { id: 'veh1' },
      body: {
        start_time: new Date(now.getTime() - 60000).toISOString(),
        end_time: now.toISOString(),
        distance_km: 8.25,
        start_location: { latitude: 10, longitude: 10 },
        end_location: { latitude: 11, longitude: 11 },
        notes: 'camelCase energy',
        energyConsumed: 12.34,
      },
      user: { id: 'user1' },
    };

    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await addTrip(req, res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalled();

    const responseArg = json.mock.calls[0][0];
    expect(responseArg.success).toBe(true);
    // controller should map camelCase energyConsumed to energy_consumed
    expect(responseArg.data.trip.energy_consumed).toBe(12.34);
    expect(mockVehicle.save).toHaveBeenCalled();
  });

  it('should add trip to default vehicle and accept camelCase energyConsumed', async () => {
    const mockVehicle: any = {
      _id: 'veh1',
      user_id: 'user1',
      trips: [],
      total_distance_km: 0,
      total_co2_saved_kg: 0,
      save: jest.fn(async function () { return this; }),
    };

    jest.spyOn(Vehicle, 'findOne' as any).mockResolvedValue(mockVehicle);

    const now = new Date();
    const req: any = {
      body: {
        startTime: new Date(now.getTime() - 60000).toISOString(),
        endTime: now.toISOString(),
        distance: 5.5,
        energyConsumed: 3.2,
      },
      user: { id: 'user1' },
    };

    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await addTripToDefaultVehicle(req, res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalled();
    const responseArg = json.mock.calls[0][0];
    expect(responseArg.success).toBe(true);
    expect(responseArg.data.energyConsumed).toBe(3.2);
    expect(mockVehicle.save).toHaveBeenCalled();
  });

  it('should add trip to default vehicle and accept snake_case energy_consumed', async () => {
    const mockVehicle: any = {
      _id: 'veh1',
      user_id: 'user1',
      trips: [],
      total_distance_km: 0,
      total_co2_saved_kg: 0,
      save: jest.fn(async function () { return this; }),
    };

    jest.spyOn(Vehicle, 'findOne' as any).mockResolvedValue(mockVehicle);

    const now = new Date();
    const req: any = {
      body: {
        start_time: new Date(now.getTime() - 60000).toISOString(),
        end_time: now.toISOString(),
        distance: 6.75,
        energy_consumed: 4.5,
      },
      user: { id: 'user1' },
    };

    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await addTripToDefaultVehicle(req, res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalled();
    const responseArg = json.mock.calls[0][0];
    expect(responseArg.success).toBe(true);
    expect(responseArg.data.energyConsumed).toBe(4.5);
    expect(mockVehicle.save).toHaveBeenCalled();
  });

  it('should accept start_lat/start_long on the default-vehicle addTrip endpoint', async () => {
    const mockVehicle: any = {
      _id: 'veh1',
      user_id: 'user1',
      trips: [],
      total_distance_km: 0,
      total_co2_saved_kg: 0,
      save: jest.fn(async function () { return this; }),
    };

    jest.spyOn(Vehicle, 'findOne' as any).mockResolvedValue(mockVehicle);

    const now = new Date();
    const req: any = {
      body: {
        start_time: new Date(now.getTime() - 60000).toISOString(),
        end_time: now.toISOString(),
        distance: 3.14,
        // lat/long separate fields
        start_lat: '12.5',
        start_long: '55.25',
      },
      user: { id: 'user1' },
    };

    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await addTripToDefaultVehicle(req, res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalled();
    expect(mockVehicle.save).toHaveBeenCalled();
    expect(mockVehicle.trips[0].start_location.latitude).toBeCloseTo(12.5);
    expect(mockVehicle.trips[0].start_location.longitude).toBeCloseTo(55.25);
  });
});

describe('generateCredits controller', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should submit a credit request when enough CO2 saved', async () => {
    const mockVehicle: any = {
      _id: 'veh1',
      user_id: 'user1',
      trips: [
        { co2_saved_kg: 800 },
        { co2_saved_kg: 300 },
      ],
      import_keys: [{ key: 'csv1', added_at: new Date() }],
      save: jest.fn(async function () { return this; }),
    };
    jest.spyOn(Vehicle, 'findOne' as any).mockResolvedValue(mockVehicle);
    const mockSubmit = jest.fn().mockResolvedValue({ data: { id: 'req1' } });
    jest.spyOn(creditClient, 'submitCreditRequest' as any).mockImplementation(mockSubmit);

    const req: any = { params: { id: 'veh1' }, user: { id: 'user1' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await generateCredits(req, res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalled();
    expect(mockSubmit).toHaveBeenCalled();
  });

  it('should return 400 when not enough CO2 for credits', async () => {
    const mockVehicle: any = {
      _id: 'veh1',
      user_id: 'user1',
      trips: [{ co2_saved_kg: 100 }],
      save: jest.fn(async function () { return this; }),
    };
    jest.spyOn(Vehicle, 'findOne' as any).mockResolvedValue(mockVehicle);
    const req: any = { params: { id: 'veh1' }, user: { id: 'user1' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };
    await generateCredits(req, res);
    expect(status).toHaveBeenCalledWith(400);
  });
  it('should support date range for credit calculation', async () => {
    const tripOld: any = { start_time: new Date('2020-01-01T10:00:00Z').toISOString(), co2_saved_kg: 2000 };
    const tripNew: any = { start_time: new Date('2024-01-01T10:00:00Z').toISOString(), co2_saved_kg: 2000 };
    const mockVehicle: any = {
      _id: 'veh1',
      user_id: 'user1',
      trips: [tripOld, tripNew],
      save: jest.fn(async function () { return this; }),
    };
    jest.spyOn(Vehicle, 'findOne' as any).mockResolvedValue(mockVehicle);
    const mockSubmit = jest.fn().mockResolvedValue({ data: { id: 'req1' } });
    jest.spyOn(require('../../utils/creditClient'), 'submitCreditRequest' as any).mockImplementation(mockSubmit);
    const req: any = { params: { id: 'veh1' }, body: { start_time: '2023-12-31T00:00:00Z', end_time: '2024-12-31T00:00:00Z' }, user: { id: 'user1' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };
    await generateCredits(req, res);
    expect(status).toHaveBeenCalledWith(201);
    expect(mockSubmit).toHaveBeenCalled();
  });

  it('should be idempotent when using idempotency header', async () => {
    const mockVehicle: any = {
      _id: 'veh1',
      user_id: 'user1',
      trips: [ { co2_saved_kg: 1200 } ],
      credit_request_keys: [],
      save: jest.fn(async function () { return this; }),
    };
    jest.spyOn(Vehicle, 'findOne' as any).mockResolvedValue(mockVehicle);
    const mockSubmit = jest.fn().mockResolvedValue({ data: { id: 'req1' } });
    jest.spyOn(creditClient, 'submitCreditRequest' as any).mockImplementation(mockSubmit);

    const req: any = { params: { id: 'veh1' }, user: { id: 'user1' }, headers: { 'idempotency-key': 'g1' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await generateCredits(req, res);
    expect(status).toHaveBeenCalledWith(201);
    expect(mockSubmit).toHaveBeenCalled();

    // Simulate saved credit_request_keys on vehicle and call again with same key
    mockVehicle.credit_request_keys = [{ key: 'g1', created_at: new Date() }];
    mockSubmit.mockClear();
    const status2 = jest.fn().mockReturnThis();
    const json2 = jest.fn();
    const res2: any = { status: status2, json: json2 };
    await generateCredits(req, res2);
    expect(status2).toHaveBeenCalledWith(200);
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should prune old credit_request_keys and enforce max keys', async () => {
    const mockVehicle: any = {
      _id: 'veh1',
      user_id: 'user1',
      trips: [ { co2_saved_kg: 2000 } ],
      credit_request_keys: Array.from({ length: 55 }).map((_, i) => ({ key: `g${i}`, created_at: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000) })),
      save: jest.fn(async function () { return this; }),
    };
    jest.spyOn(Vehicle, 'findOne' as any).mockResolvedValue(mockVehicle);
    const mockSubmit = jest.fn().mockResolvedValue({ data: { id: 'req1' } });
    jest.spyOn(creditClient, 'submitCreditRequest' as any).mockImplementation(mockSubmit);

    const req: any = { params: { id: 'veh1' }, user: { id: 'user1' }, headers: { 'idempotency-key': 'g-new' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await generateCredits(req, res);
    expect(mockVehicle.credit_request_keys.length).toBeLessThanOrEqual(50);
  });
});

describe('importTrips controller', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should prune old idempotency keys and enforce max keys', async () => {
    const mockVehicle: any = {
      _id: 'veh1',
      user_id: 'user1',
      trips: [],
      total_distance_km: 0,
      total_co2_saved_kg: 0,
      // 55 previous keys
      import_keys: Array.from({ length: 55 }).map((_, i) => ({ key: `k${i}`, created_at: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000) })),
      save: jest.fn(async function () { return this; }),
    };
    jest.spyOn(Vehicle, 'findOne' as any).mockResolvedValue(mockVehicle);

    const csv = `start_time,end_time,distance_km,start_lat,start_long,end_lat,end_long,notes\n${new Date().toISOString()},${new Date().toISOString()},5,10,10,11,11,trip1`;
    const file = { buffer: Buffer.from(csv, 'utf-8') } as any;
    const req: any = { params: { id: 'veh1' }, file, user: { id: 'user1' }, headers: { 'idempotency-key': 'new-key' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };
    await importTrips(req, res);
    expect(mockVehicle.import_keys.length).toBeLessThanOrEqual(50);
  });

  it('should prune keys via pruneVehicleIdempotencyKeys and return counts', async () => {
    const mockVehicle: any = {
      _id: 'veh1',
      user_id: 'user1',
      trips: [],
      total_distance_km: 0,
      total_co2_saved_kg: 0,
      import_keys: Array.from({ length: 55 }).map((_, i) => ({ key: `k${i}`, created_at: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000) })),
      credit_request_keys: Array.from({ length: 55 }).map((_, i) => ({ key: `g${i}`, created_at: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000) })),
      save: jest.fn(async function () { return this; }),
    };
    jest.spyOn(Vehicle, 'findOne' as any).mockResolvedValue(mockVehicle);

    const req: any = { params: { id: 'veh1' }, user: { id: 'user1' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await (require('../trip.controller') as any).pruneVehicleIdempotencyKeys(req, res);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalled();
    // ensure pruning applied
    expect(mockVehicle.import_keys.length).toBeLessThanOrEqual(50);
    expect(mockVehicle.credit_request_keys.length).toBeLessThanOrEqual(50);
  });

  it('should import trips and update totals', async () => {
    const mockVehicle: any = {
      _id: 'veh1',
      user_id: 'user1',
      trips: [],
      total_distance_km: 0,
      total_co2_saved_kg: 0,
      save: jest.fn(async function () { return this; }),
    };
    jest.spyOn(Vehicle, 'findOne' as any).mockResolvedValue(mockVehicle);

    const tripsToImport = [
      { start_time: new Date().toISOString(), end_time: new Date().toISOString(), distance_km: 10 },
      { start_time: new Date().toISOString(), end_time: new Date().toISOString(), distance_km: 20 },
    ];

    const req: any = { params: { id: 'veh1' }, body: { trips: tripsToImport }, user: { id: 'user1' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };

    await importTrips(req, res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalled();
    expect(mockVehicle.save).toHaveBeenCalled();
    expect(mockVehicle.total_distance_km).toBeGreaterThan(0);
  });

  it('should import trips from CSV file upload', async () => {
    const mockVehicle: any = {
      _id: 'veh1',
      user_id: 'user1',
      trips: [],
      total_distance_km: 0,
      total_co2_saved_kg: 0,
      save: jest.fn(async function () { return this; }),
    };
    jest.spyOn(Vehicle, 'findOne' as any).mockResolvedValue(mockVehicle);

    const csv = `start_time,end_time,distance_km,start_lat,start_long,end_lat,end_long,notes\n${new Date().toISOString()},${new Date().toISOString()},5,10,10,11,11,trip1\n${new Date().toISOString()},${new Date().toISOString()},10,10,10,11,11,trip2`;

    const file = { buffer: Buffer.from(csv, 'utf-8') } as any;
    const req: any = { params: { id: 'veh1' }, file, user: { id: 'user1' }, headers: { 'idempotency-key': 'csv1' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };
    await importTrips(req, res);
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalled();
    expect(mockVehicle.save).toHaveBeenCalled();
    expect(mockVehicle.total_distance_km).toBeGreaterThan(0);
  });

  it('should be idempotent when reusing the same idempotency key', async () => {
    const mockVehicle: any = {
      _id: 'veh1',
      user_id: 'user1',
      trips: [],
      total_distance_km: 0,
      total_co2_saved_kg: 0,
      import_keys: [{ key: 'csv1', created_at: new Date() }],
      save: jest.fn(async function () { return this; }),
    };
    jest.spyOn(Vehicle, 'findOne' as any).mockResolvedValue(mockVehicle);

    const csv = `start_time,end_time,distance_km,start_lat,start_long,end_lat,end_long,notes\n${new Date().toISOString()},${new Date().toISOString()},5,10,10,11,11,trip1`;
    const file = { buffer: Buffer.from(csv, 'utf-8') } as any;
    const req: any = { params: { id: 'veh1' }, file, user: { id: 'user1' }, headers: { 'idempotency-key': 'csv1' } };
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res: any = { status, json };
    await importTrips(req, res);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalled();
    const responseArg = json.mock.calls[0][0];
    expect(responseArg.message).toMatch(/previously processed/i);
  });
});
