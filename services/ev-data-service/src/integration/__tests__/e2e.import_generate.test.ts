import { importTrips, generateCredits } from '../../controllers/trip.controller';
import { Vehicle } from '../../models/vehicle.model';
import * as creditClient from '../../utils/creditClient';

describe('E2E: import trips and generate credits', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should import trips from CSV and then generate credits via the credit client', async () => {
    const mockVehicle: any = {
      _id: 'veh1',
      user_id: 'user1',
      trips: [],
      total_distance_km: 0,
      total_co2_saved_kg: 0,
      save: jest.fn(async function () { return this; }),
    };

    jest.spyOn(Vehicle, 'findOne' as any).mockResolvedValue(mockVehicle);

    // Use a larger distance so that CO2 savings >= 1000 kg to produce at least 1 credit (0.1 kg/km)
    const csv = `start_time,end_time,distance_km,start_lat,start_long,end_lat,end_long,notes\n${new Date().toISOString()},${new Date().toISOString()},10000,10,10,11,11,trip1`;
    const file = { buffer: Buffer.from(csv, 'utf-8') } as any;
    const importReq: any = { params: { id: 'veh1' }, file, user: { id: 'user1' } };
    const status1 = jest.fn().mockReturnThis();
    const json1 = jest.fn();
    const res1: any = { status: status1, json: json1 };

    await importTrips(importReq, res1);

    // Ensure trips were added
    expect(mockVehicle.trips.length).toBeGreaterThan(0);
    expect(mockVehicle.total_distance_km).toBeGreaterThan(0);

    // Now mock the credit client to capture request
    const submitSpy = jest.fn().mockResolvedValue({ data: { id: 'req-e2e-1' } });
    jest.spyOn(creditClient, 'submitCreditRequest' as any).mockImplementation(submitSpy);

    const genReq: any = { params: { id: 'veh1' }, body: {}, user: { id: 'user1' } };
    const status2 = jest.fn().mockReturnThis();
    const json2 = jest.fn();
    const res2: any = { status: status2, json: json2 };

    await generateCredits(genReq, res2);

    expect(submitSpy).toHaveBeenCalled();
    expect(status2).toHaveBeenCalledWith(201);
    expect(json2).toHaveBeenCalled();
  });
});
