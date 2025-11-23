import { Request, Response } from 'express';
import { Vehicle } from '../models/vehicle.model';
import { addTripSchema, getTripStatsSchema } from '../validators/trip.validator';
import { submitCreditRequest } from '../utils/creditClient';
import { parseTripsFromBuffer } from '../utils/csvParser';

/**
 * CO2 Calculation Constants
 * - EV: 0 kg CO2/km (electric, no direct emissions)
 * - Gasoline car baseline: 0.12 kg CO2/km
 * - CO2 saved = (0.12 - 0) × distance = 0.12 × distance
 * 
 * Note: Issue #6 specifies 0.10 kg/km, using that value
 */
const CO2_SAVED_PER_KM = 0.10; // kg CO2 saved per km (vs gasoline car)
const GASOLINE_BASELINE = 0.12; // kg CO2 per km for gasoline car

/**
 * @route   POST /api/vehicles/:id/trips
 * @desc    Add a new trip to a vehicle and calculate CO2 savings
 * @access  Private (JWT required)
 */
export const addTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: vehicleId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    // Normalize payload to accept either camelCase or snake_case from clients
    const normalized = {
      start_time: req.body.start_time ?? req.body.startTime,
      end_time: req.body.end_time ?? req.body.endTime,
      distance_km: req.body.distance_km ?? req.body.distance ?? req.body.distanceKm,
      start_location: req.body.start_location ?? req.body.startLocation,
      end_location: req.body.end_location ?? req.body.endLocation,
      notes: req.body.notes ?? req.body.note ?? undefined,
      // accept optional energyConsumed (camel) and map to energy_consumed (snake) for storage/use
      energy_consumed: req.body.energy_consumed ?? req.body.energyConsumed ?? undefined,
    };

    // Helper: convert incoming location values to { latitude:number, longitude:number, address?:string }
    const normalizeLocation = (value: any, prefix: string): any => {
      // If client provided explicit lat/long fields like start_lat/start_long or startLat/startLong
      const latCandidates = [`${prefix}_lat`, `${prefix}Lat`, 'lat', 'latitude'];
      const lonCandidates = [`${prefix}_long`, `${prefix}Long`, 'lon', 'lng', 'longitude'];
      for (const latKey of latCandidates) {
        for (const lonKey of lonCandidates) {
          if (latKey in req.body && lonKey in req.body) {
            return { latitude: Number(req.body[latKey]), longitude: Number(req.body[lonKey]) };
          }
        }
      }

      // If value is a string try parsing JSON or coordinate strings like `"10,20"` or "10 20"
      if (typeof value === 'string') {
        // try JSON
        try {
          const parsed = JSON.parse(value);
          if (parsed && typeof parsed === 'object') return parsed;
        } catch (e) {
          // not JSON, try simple coords
        }
        const coordMatch = value.trim().match(/^(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)$/);
        if (coordMatch) {
          return { latitude: Number(coordMatch[1]), longitude: Number(coordMatch[2]) };
        }
        return undefined;
      }

      // If object, coerce string numbers to actual numbers
      if (value && typeof value === 'object') {
        const out: any = { ...value };
        if (out.latitude && typeof out.latitude === 'string') out.latitude = Number(out.latitude);
        if (out.longitude && typeof out.longitude === 'string') out.longitude = Number(out.longitude);
        return out;
      }

      return undefined;
    };

    // Apply normalization (if provided as a string or separate lat/long fields)
    normalized.start_location = normalizeLocation(normalized.start_location, 'start');
    normalized.end_location = normalizeLocation(normalized.end_location, 'end');

    // Validate request body
    const { error, value } = addTripSchema.validate(normalized, {
      abortEarly: false,
    });

    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((detail: any) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
      return;
    }

    // Find vehicle by ID and user_id
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      user_id: userId,
    });

    if (!vehicle) {
      res.status(404).json({
        success: false,
        message: 'Vehicle not found or you do not have permission to access it',
      });
      return;
    }

    // Coerce and validate distance
    const distanceKm = Number(value.distance_km);
    if (isNaN(distanceKm) || distanceKm < 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'distance_km', message: 'distance_km must be a non-negative number' }],
      });
      return;
    }

    // Validate start/end times
    const startTime = new Date(value.start_time);
    const endTime = new Date(value.end_time);
    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'start_time|end_time', message: 'Invalid date format' }],
      });
      return;
    }
    if (startTime > endTime) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'start_time|end_time', message: 'start_time must be before end_time' }],
      });
      return;
    }

    // Calculate CO2 saved based on distance
    const co2_saved_kg = parseFloat((distanceKm * CO2_SAVED_PER_KM).toFixed(3));
    const gasoline_co2_kg = parseFloat((distanceKm * GASOLINE_BASELINE).toFixed(3));
    const co2_reduction_percentage =
      gasoline_co2_kg > 0 ? `${((co2_saved_kg / gasoline_co2_kg) * 100).toFixed(2)}%` : '0%';

    // Create trip object
    const newTrip = {
      start_time: startTime,
      end_time: endTime,
      distance_km: distanceKm,
      energy_consumed: value.energy_consumed ?? value.energyConsumed ?? null,
      co2_saved_kg: parseFloat(co2_saved_kg.toFixed(3)), // Round to 3 decimal places
      start_location: value.start_location,
      end_location: value.end_location,
      notes: value.notes,
      created_at: new Date(),
    };

    // Add trip to vehicle's trips array
    vehicle.trips.push(newTrip as any);

    // Ensure totals are numbers and update
    vehicle.total_distance_km = (vehicle.total_distance_km || 0) + distanceKm;
    vehicle.total_co2_saved_kg = (vehicle.total_co2_saved_kg || 0) + co2_saved_kg;

    // Save vehicle
    await vehicle.save();

    res.status(201).json({
      success: true,
      message: 'Trip added successfully',
      data: {
        trip: newTrip,
          calculation: {
          distance_km: distanceKm,
          co2_saved_kg,
          gasoline_equivalent_kg: gasoline_co2_kg,
          co2_reduction_percentage: co2_reduction_percentage,
          formula: `CO2_saved = ${CO2_SAVED_PER_KM} kg/km × ${distanceKm} km = ${co2_saved_kg.toFixed(3)} kg`,
        },
        vehicle_totals: {
          total_trips: vehicle.trips.length,
          total_distance_km: parseFloat(vehicle.total_distance_km.toFixed(3)),
          total_co2_saved_kg: parseFloat(vehicle.total_co2_saved_kg.toFixed(3)),
        },
      },
    });
  } catch (err: any) {
    console.error('❌ Error adding trip:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to add trip',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

export const pruneVehicleIdempotencyKeys = async (req: any, res: any): Promise<void> => {
  try {
    const { id: vehicleId } = req.params;
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    const vehicle = await Vehicle.findOne({ _id: vehicleId, user_id: userId });
    if (!vehicle) {
      res.status(404).json({ success: false, message: 'Vehicle not found' });
      return;
    }

    vehicle.import_keys = pruneKeys(vehicle.import_keys);
    vehicle.credit_request_keys = pruneKeys(vehicle.credit_request_keys);
    await vehicle.save();

    res.status(200).json({ success: true, data: { import_keys: vehicle.import_keys.length, credit_request_keys: vehicle.credit_request_keys.length } });
  } catch (err: any) {
    console.error('pruneVehicleIdempotencyKeys error:', err);
    res.status(500).json({ success: false, message: 'Failed to prune idempotency keys' });
  }
};

/**
 * @route   GET /api/vehicles/:id/trips
 * @desc    Get all trips for a specific vehicle
 * @access  Private (JWT required)
 */
export const getVehicleTrips = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id: vehicleId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    // Query parameters for pagination and filtering
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const sortBy = (req.query.sort as string) || '-start_time'; // Default: newest first

    // Find vehicle
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      user_id: userId,
    });

    if (!vehicle) {
      res.status(404).json({
        success: false,
        message: 'Vehicle not found or you do not have permission to access it',
      });
      return;
    }

    // Sort trips
    let trips = [...vehicle.trips];
    const sortField = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy;
    const sortOrder = sortBy.startsWith('-') ? -1 : 1;

    trips.sort((a: any, b: any) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return -1 * sortOrder;
      if (aVal > bVal) return 1 * sortOrder;
      return 0;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTrips = trips.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      message: 'Trips retrieved successfully',
      data: {
        trips: paginatedTrips,
        pagination: {
          current_page: page,
          per_page: limit,
          total_trips: trips.length,
          total_pages: Math.ceil(trips.length / limit),
        },
        vehicle_summary: {
          vehicle_id: vehicle._id,
          make: vehicle.make,
          model: vehicle.model,
          license_plate: vehicle.license_plate,
          total_distance_km: vehicle.total_distance_km,
          total_co2_saved_kg: parseFloat(vehicle.total_co2_saved_kg.toFixed(3)),
        },
      },
    });
  } catch (err: any) {
    console.error('❌ Error getting trips:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve trips',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

/**
 * @route   GET /api/vehicles/trips/user
 * @desc    Return all trips for the currently authenticated user (across all their vehicles)
 * @access  Private
 */
export const getMyTrips = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    // Find all vehicles belonging to this user
    const vehicles = await Vehicle.find({ user_id: userId }).lean();

    // Flatten trips and normalize to frontend shape
    const trips: any[] = [];
    for (const v of vehicles) {
      const vehicleId = (v as any)._id?.toString?.() || (v as any)._id;
      for (const t of v.trips || []) {
        trips.push({
          id: (t as any)._id?.toString?.() || undefined,
          vehicleId,
          userId,
          startTime: t.start_time,
          endTime: t.end_time,
          distance: t.distance_km,
          energyConsumed: (t as any).energy_consumed ?? (t as any).energyConsumed ?? null,
          carbonSaved: t.co2_saved_kg,
          verificationStatus: 'PENDING',
          createdAt: t.created_at,
        });
      }
    }

    // return as array
    res.json(trips);
  } catch (err: any) {
    console.error('getMyTrips error', err);
    res.status(500).json({ success: false, message: 'Failed to fetch trips', error: err?.message });
  }
};

/**
 * @route   POST /api/vehicles/trips
 * @desc    Create a trip for the current authenticated user.
 *          Accepts payload with or without vehicleId. If vehicleId is omitted
 *          the server will attach the trip to the first vehicle found for the user.
 */
export const addTripToDefaultVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    // accept payload { vehicleId?, distance, energyConsumed, startTime, endTime, startLocation?, endLocation?, notes? }
    const { vehicleId } = req.body as any;

    // determine target vehicle
    let vehicle = null as any;
    if (vehicleId) {
      vehicle = await Vehicle.findOne({ _id: vehicleId, user_id: userId });
      if (!vehicle) {
        res.status(404).json({ success: false, message: 'Vehicle not found or not owned by user' });
        return;
      }
    } else {
      vehicle = await Vehicle.findOne({ user_id: userId });
      if (!vehicle) {
        res.status(400).json({ success: false, message: 'No vehicles found for user - create a vehicle first' });
        return;
      }
    }

    // reuse validation and creation logic from addTrip - validate body
    const normalized = {
      start_time: req.body.start_time ?? req.body.startTime,
      end_time: req.body.end_time ?? req.body.endTime,
      distance_km: req.body.distance_km ?? req.body.distance ?? req.body.distanceKm,
      start_location: req.body.start_location ?? req.body.startLocation,
      end_location: req.body.end_location ?? req.body.endLocation,
      notes: req.body.notes ?? req.body.note ?? undefined,
      energy_consumed: req.body.energy_consumed ?? req.body.energyConsumed ?? undefined,
    };
    // Apply same normalization as addTrip
    const normalizeLocation = (value: any, prefix: string): any => {
      const latCandidates = [`${prefix}_lat`, `${prefix}Lat`, 'lat', 'latitude'];
      const lonCandidates = [`${prefix}_long`, `${prefix}Long`, 'lon', 'lng', 'longitude'];
      for (const latKey of latCandidates) {
        for (const lonKey of lonCandidates) {
          if (latKey in req.body && lonKey in req.body) {
            return { latitude: Number(req.body[latKey]), longitude: Number(req.body[lonKey]) };
          }
        }
      }
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (parsed && typeof parsed === 'object') return parsed;
        } catch (e) {}
        const coordMatch = value.trim().match(/^(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)$/);
        if (coordMatch) return { latitude: Number(coordMatch[1]), longitude: Number(coordMatch[2]) };
        return undefined;
      }
      if (value && typeof value === 'object') {
        const out: any = { ...value };
        if (out.latitude && typeof out.latitude === 'string') out.latitude = Number(out.latitude);
        if (out.longitude && typeof out.longitude === 'string') out.longitude = Number(out.longitude);
        return out;
      }
      return undefined;
    };

    normalized.start_location = normalizeLocation(normalized.start_location, 'start');
    normalized.end_location = normalizeLocation(normalized.end_location, 'end');
    const { error, value } = addTripSchema.validate(normalized, { abortEarly: false });
    if (error) {
      res.status(400).json({ success: false, message: 'Validation failed', errors: error.details.map((d:any) => ({ field: d.path.join('.'), message: d.message })) });
      return;
    }

    const distanceKm = Number(value.distance_km || value.distance || 0);
    const startTime = new Date(value.start_time || value.startTime);
    const endTime = new Date(value.end_time || value.endTime);

    const co2_saved_kg = parseFloat((distanceKm * CO2_SAVED_PER_KM).toFixed(3));

    const newTrip = {
      start_time: startTime,
      end_time: endTime,
      distance_km: distanceKm,
      energy_consumed: value.energy_consumed ?? value.energyConsumed ?? null,
      co2_saved_kg,
      start_location: value.start_location || value.startLocation || undefined,
      end_location: value.end_location || value.endLocation || undefined,
      notes: value.notes || undefined,
      created_at: new Date(),
    } as any;

    vehicle.trips.push(newTrip);
    vehicle.total_distance_km = (vehicle.total_distance_km || 0) + distanceKm;
    vehicle.total_co2_saved_kg = (vehicle.total_co2_saved_kg || 0) + co2_saved_kg;
    await vehicle.save();

    // return normalized shape used by frontend
    const tripOut = {
      id: newTrip._id?.toString?.() || undefined,
      vehicleId: vehicle._id?.toString?.() || vehicle._id,
      userId,
      startTime: newTrip.start_time,
      endTime: newTrip.end_time,
      distance: newTrip.distance_km,
      energyConsumed: value.energy_consumed ?? value.energyConsumed ?? null,
      carbonSaved: newTrip.co2_saved_kg,
      verificationStatus: 'PENDING',
      createdAt: newTrip.created_at,
    };

    res.status(201).json({ success: true, message: 'Trip created', data: tripOut });
  } catch (err: any) {
    console.error('addTripToDefaultVehicle error', err);
    res.status(500).json({ success: false, message: 'Failed to create trip', error: err?.message });
  }
};

/**
 * @route   GET /api/vehicles/:id/co2-savings
 * @desc    Get CO2 savings statistics for a vehicle (monthly/yearly aggregation)
 * @access  Private (JWT required)
 */
export const getCO2Savings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id: vehicleId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    // Validate query parameters
    const { error, value } = getTripStatsSchema.validate(req.query, {
      abortEarly: false,
    });

    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((detail: any) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
      return;
    }

    const { period, year, month } = value;

    // Find vehicle
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      user_id: userId,
    });

    if (!vehicle) {
      res.status(404).json({
        success: false,
        message: 'Vehicle not found or you do not have permission to access it',
      });
      return;
    }

    // Filter trips based on period
    let filteredTrips = vehicle.trips;
    let periodLabel = 'All Time';

    if (period === 'monthly' && year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      filteredTrips = vehicle.trips.filter(
        (trip: any) =>
          new Date(trip.start_time) >= startDate &&
          new Date(trip.start_time) <= endDate
      );
      periodLabel = `${year}-${String(month).padStart(2, '0')}`;
    } else if (period === 'yearly' && year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
      filteredTrips = vehicle.trips.filter(
        (trip: any) =>
          new Date(trip.start_time) >= startDate &&
          new Date(trip.start_time) <= endDate
      );
      periodLabel = `${year}`;
    }

    // Calculate statistics
    const totalTrips = filteredTrips.length;
    const totalDistance = filteredTrips.reduce(
      (sum: number, trip: any) => sum + trip.distance_km,
      0
    );
    const totalCO2Saved = filteredTrips.reduce(
      (sum: number, trip: any) => sum + trip.co2_saved_kg,
      0
    );
    const gasolineEquivalent = totalDistance * GASOLINE_BASELINE;
    const avgDistancePerTrip = totalTrips > 0 ? totalDistance / totalTrips : 0;
    const avgCO2PerTrip = totalTrips > 0 ? totalCO2Saved / totalTrips : 0;

    // Monthly breakdown (if yearly period)
    let monthlyBreakdown: any[] = [];
    if (period === 'yearly' && year) {
      for (let m = 1; m <= 12; m++) {
        const monthStart = new Date(year, m - 1, 1);
        const monthEnd = new Date(year, m, 0, 23, 59, 59, 999);
        // use filteredTrips (falls back to vehicle.trips for all-time)
        const monthTrips = filteredTrips.filter(
          (trip: any) =>
            new Date(trip.start_time) >= monthStart &&
            new Date(trip.start_time) <= monthEnd
        );
        const monthDistance = monthTrips.reduce(
          (sum: number, trip: any) => sum + trip.distance_km,
          0
        );
        const monthCO2 = monthTrips.reduce(
          (sum: number, trip: any) => sum + trip.co2_saved_kg,
          0
        );
        monthlyBreakdown.push({
          month: m,
          month_label: `${year}-${String(m).padStart(2, '0')}`,
          trips: monthTrips.length,
          distance_km: parseFloat(monthDistance.toFixed(2)),
          co2_saved_kg: parseFloat(monthCO2.toFixed(3)),
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'CO2 savings retrieved successfully',
      data: {
        period: periodLabel,
        period_type: period || 'all',
        vehicle: {
          id: vehicle._id,
          make: vehicle.make,
          model: vehicle.model,
          license_plate: vehicle.license_plate,
        },
        statistics: {
          total_trips: totalTrips,
          total_distance_km: parseFloat(totalDistance.toFixed(2)),
          total_co2_saved_kg: parseFloat(totalCO2Saved.toFixed(3)),
          gasoline_equivalent_kg: parseFloat(gasolineEquivalent.toFixed(3)),
          co2_reduction_percentage: gasolineEquivalent > 0 
            ? `${((totalCO2Saved / gasolineEquivalent) * 100).toFixed(2)}%` 
            : '0%',
          avg_distance_per_trip_km: parseFloat(avgDistancePerTrip.toFixed(2)),
          avg_co2_saved_per_trip_kg: parseFloat(avgCO2PerTrip.toFixed(3)),
        },
        comparison: {
          ev_emissions_kg: 0, // Electric vehicles have 0 direct emissions
          gasoline_emissions_kg: parseFloat(gasolineEquivalent.toFixed(3)),
          co2_saved_kg: parseFloat(totalCO2Saved.toFixed(3)),
          formula: `CO2_saved = ${CO2_SAVED_PER_KM} kg/km × ${totalDistance.toFixed(2)} km = ${totalCO2Saved.toFixed(3)} kg`,
          baseline_info: `Gasoline car: ${GASOLINE_BASELINE} kg CO2/km`,
        },
        ...(monthlyBreakdown.length > 0 && { monthly_breakdown: monthlyBreakdown }),
        lifetime_totals: {
          all_time_trips: vehicle.trips.length,
          all_time_distance_km: vehicle.total_distance_km,
          all_time_co2_saved_kg: parseFloat(vehicle.total_co2_saved_kg.toFixed(3)),
        },
      },
    });
  } catch (err: any) {
    console.error('❌ Error getting CO2 savings:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve CO2 savings',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

const IDEMPOTENCY_TTL_DAYS = 90; // keep idempotency keys for 90 days
const IDEMPOTENCY_MAX_KEYS = 50;

function hasProcessedKey(list: any[] | undefined, key: string | null) {
  if (!key) return false;
  if (!Array.isArray(list)) return false;
  return list.some((v: any) => (typeof v === 'string' ? v === key : v.key === key));
}

function addProcessedKey(list: any[] | undefined, key: string | null) {
  if (!key) return list || [];
  const now = new Date();
  let arr = (list || []).map((v: any) => (typeof v === 'string' ? { key: v, added_at: new Date() } : v));
  arr.push({ key, added_at: now });
  // prune older than TTL
  const cutoff = new Date(now.getTime() - IDEMPOTENCY_TTL_DAYS * 24 * 60 * 60 * 1000);
  arr = arr.filter((v: any) => new Date(v.added_at || v.created_at) >= cutoff);
  // trim to max keys
  if (arr.length > IDEMPOTENCY_MAX_KEYS) arr = arr.slice(-IDEMPOTENCY_MAX_KEYS);
  return arr;
}

function pruneKeys(list: any[] | undefined) {
  const now = new Date();
  if (!Array.isArray(list) || list.length === 0) return [];
  const cutoff = new Date(now.getTime() - IDEMPOTENCY_TTL_DAYS * 24 * 60 * 60 * 1000);
  let arr = (list || []).filter((v: any) => new Date(v.added_at || v.created_at) >= cutoff);
  if (arr.length > IDEMPOTENCY_MAX_KEYS) arr = arr.slice(-IDEMPOTENCY_MAX_KEYS);
  return arr;
}

export const generateCredits = async (req: any, res: any): Promise<void> => {
  try {
    const { id: vehicleId } = req.params;
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const vehicle = await Vehicle.findOne({ _id: vehicleId, user_id: userId });
    if (!vehicle) {
      res.status(404).json({ success: false, message: 'Vehicle not found' });
      return;
    }

    // compute total CO2 saved for all trips (kg) or optionally for a provided range
    let filteredTrips = vehicle.trips || [];
    const { start_time, end_time } = req.body || {};
    if (start_time || end_time) {
      const s = start_time ? new Date(start_time) : new Date(0);
      const e = end_time ? new Date(end_time) : new Date();
      filteredTrips = filteredTrips.filter((t: any) => {
        const st = new Date(t.start_time);
        return st >= s && st <= e;
      });
    }
    const totalCO2Kg = filteredTrips.reduce((sum: number, t: any) => sum + (t.co2_saved_kg || 0), 0);
    // convert to credits: 1 credit = 1000 kg CO2 (1 ton)
    const creditsAmount = Math.floor(totalCO2Kg / 1000);
    if (creditsAmount < 1) {
      res.status(400).json({ success: false, message: 'Not enough CO2 saved to generate credits' });
      return;
    }

    // Idempotency: check for header to prevent duplicate requests
    const idempotencyKey = (req.headers && (req.headers['idempotency-key'] || req.headers['Idempotency-Key'])) || req.body?.idempotency_key || null;
    if (idempotencyKey && hasProcessedKey(vehicle.credit_request_keys, idempotencyKey)) {
      res.status(200).json({ success: true, message: 'Credit generation already processed', data: { creditsAmount } });
      return;
    }

    // submit credit request to carbon credit service
    const response = await submitCreditRequest({ userId, co2Amount: totalCO2Kg, creditsAmount, vehicle_id: vehicleId, idempotency_key: idempotencyKey });
    if (idempotencyKey) {
      vehicle.credit_request_keys = addProcessedKey(vehicle.credit_request_keys, idempotencyKey as string);
      await vehicle.save();
    }
    res.status(201).json({ success: true, data: { creditsAmount, requestResponse: response.data } });
  } catch (err: any) {
    console.error('generateCredits error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to generate credits' });
  }
};

export const importTrips = async (req: any, res: any): Promise<void> => {
  try {
    const { id: vehicleId } = req.params;
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    const vehicle = await Vehicle.findOne({ _id: vehicleId, user_id: userId });
    if (!vehicle) {
      res.status(404).json({ success: false, message: 'Vehicle not found' });
      return;
    }

    let trips: any[] = [];
    const idempotencyKey = (req.headers && (req.headers['idempotency-key'] || req.headers['Idempotency-Key'])) || req.body?.idempotency_key || null;
    // Option A: JSON body
    if (Array.isArray(req.body?.trips) && req.body.trips.length > 0) {
      trips = req.body.trips;
    }
    // Option B: CSV upload (multer memory buffer) - field name `file`
    if (req.file && req.file.buffer) {
      try {
        console.debug('[IMPORT] Found multipart file upload:', {
          fieldname: req.file.fieldname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        });
        const parsed = await parseTripsFromBuffer(req.file.buffer);
        console.debug('[IMPORT] CSV parsed rows count:', parsed.length);
        trips = trips.concat(parsed);
      } catch (err: any) {
        console.error('CSV parse error:', err);
        res.status(400).json({ success: false, message: 'Failed to parse CSV: ' + (err.message || '') });
        return;
      }
    }
    if (!Array.isArray(trips) || trips.length === 0) {
      res.status(400).json({ success: false, message: 'Trips array or CSV file is required' });
      return;
    }

    // Idempotency: if idempotency key is present and previously processed, return cached response
    if (idempotencyKey && hasProcessedKey(vehicle.import_keys, idempotencyKey)) {
      res.status(200).json({ success: true, message: 'Import previously processed', data: { total_trips: vehicle.trips.length } });
      return;
    }

    console.debug('[IMPORT] Found trips count to process:', trips.length, 'for vehicle:', vehicleId, 'user:', userId, 'idempotencyKey:', idempotencyKey);

    for (const t of trips) {
      const { start_time, end_time, distance_km } = t;
      // dedupe: skip if a trip with same start_time, end_time, distance is present
      const startTime = new Date(start_time || t.start_time);
      const distance = Number(distance_km || t.distance_km || 0);
      const exists = (vehicle.trips || []).some((trip: any) => {
        const st = new Date(trip.start_time);
        const en = new Date(trip.end_time);
        const dist = Number(trip.distance_km || 0);
        return Math.abs(+st - +startTime) < 1000 && Math.abs(dist - distance) < 0.001;
      });
      if (exists) continue;

      vehicle.trips.push({
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        distance_km: Number(distance_km),
        co2_saved_kg: Number(distance_km) * CO2_SAVED_PER_KM,
        start_location: t.start_location,
        end_location: t.end_location,
        notes: t.notes,
        created_at: new Date(),
      } as any);
      vehicle.total_distance_km = (vehicle.total_distance_km || 0) + Number(distance_km);
      vehicle.total_co2_saved_kg = (vehicle.total_co2_saved_kg || 0) + (Number(distance_km) * CO2_SAVED_PER_KM);
    }
    // Record idempotency key if provided
    if (idempotencyKey) {
      vehicle.import_keys = addProcessedKey(vehicle.import_keys, idempotencyKey as string);
    }
    const saveResult = await vehicle.save();
    console.debug('[IMPORT] Vehicle after save has', saveResult.trips?.length, 'trips. vehicleId:', vehicleId);
    res.status(201).json({ success: true, data: { total_trips: vehicle.trips.length } });
  } catch (err: any) {
    console.error('importTrips error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to import trips' });
  }
};
