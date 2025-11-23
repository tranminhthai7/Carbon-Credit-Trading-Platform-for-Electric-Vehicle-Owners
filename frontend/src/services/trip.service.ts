import { apiClient } from './api';
import axios from 'axios';
import { Trip, Vehicle } from '../types';

export const tripService = {
  // Get all trips for current user
  getMyTrips: async (): Promise<Trip[]> => {
    const response = await apiClient.get<Trip[]>('/api/vehicles/trips/user');
    return response.data;
  },

  // Backwards-compatible helper: some pages call tripService.getMyVehicles
  // Keep this here as a convenience wrapper to the vehicle endpoint.
  getMyVehicles: async (): Promise<Vehicle[]> => {
    const response = await apiClient.get<any>('/api/vehicles');
    const payload = response.data;
    const items = Array.isArray(payload) ? payload : (payload?.data ?? []);
    return items.map((v: any) => ({
      id: v.id ?? v._id,
      userId: v.userId ?? v.user_id,
      make: v.make,
      model: v.model,
      year: v.year,
      batteryCapacity: v.battery_capacity ?? v.batteryCapacity,
      registrationNumber: v.license_plate ?? v.registrationNumber,
      createdAt: v.created_at ?? v.createdAt,
    }));
  },

  // Get trip by ID
  getTripById: async (tripId: string): Promise<Trip> => {
    const response = await apiClient.get<Trip>(`/api/vehicles/trips/${tripId}`);
    return response.data;
  },

  // Create a new trip
  createTrip: async (tripData: Partial<Trip>): Promise<Trip> => {
    // Normalize different shapes (camelCase / snake_case / mixed) to a
    // consistent JSON object the server expects. This prevents malformed
    // request bodies from being sent (eg. URL form encoded or improperly
    // stringified objects from UI layers).
    const normalizeDate = (v: any) => {
      if (!v) return undefined;
      // Try to coerce any value into an ISO timestamp where possible.
      // Strings like "YYYY-MM-DDTHH:mm" (datetime-local) will be parsed
      // as local time and converted to an ISO timestamp with timezone.
      try {
        const d = (v instanceof Date) ? v : new Date(v);
        if (Number.isNaN(d.getTime())) return undefined;
        return d.toISOString();
      } catch {
        return undefined;
      }
    };

    const payload: any = {
      // allow both startTime or start_time
      start_time: normalizeDate((tripData as any).start_time ?? tripData.startTime),
      end_time: normalizeDate((tripData as any).end_time ?? tripData.endTime),
      // distance can be passed under distance, distance_km, distanceKm
      distance_km: Number((tripData as any).distance_km ?? tripData.distance ?? (tripData as any).distanceKm ?? 0),
      // Only include energy_consumed when the value is supplied by the user.
      energy_consumed: (() => {
        const raw = (tripData as any).energy_consumed ?? tripData.energyConsumed ?? null;
        return raw == null || raw === '' ? undefined : Number(raw);
      })(),
      start_location: (tripData as any).start_location ?? (tripData as any).startLocation ?? undefined,
      end_location: (tripData as any).end_location ?? (tripData as any).endLocation ?? undefined,
      notes: (tripData as any).notes ?? (tripData as any).note ?? undefined,
      vehicleId: (tripData as any).vehicleId ?? undefined,
    };

    // Basic client-side sanity checks - if the request shape is clearly wrong
    // reject early to avoid hitting the server with invalid payloads.
    if (!payload.start_time || !payload.end_time) {
      throw new Error('start_time and end_time are required');
    }
    // Server requires minimum 0.1km (Joi schema) — reflect that in client validation
    if (Number.isNaN(payload.distance_km) || payload.distance_km < 0.1) {
      throw new Error('distance must be at least 0.1 km');
    }

    const response = await apiClient.post('/api/vehicles/trips', payload);

    // Normalize common server response shapes into a stable frontend Trip object.
    // Server may return:
    //  - direct trip object (tests/mocks)
    //  - { success, message, data: tripOut } (addTripToDefaultVehicle)
    //  - { success, message, data: { trip: newTrip, ... } } (addTrip)
    const raw = response.data;

    // helper to convert server trip-subdocument -> frontend trip
    const mapServerTrip = (t: any) => {
      if (!t) return t;
      return {
        id: t.id ?? t._id ?? (t.trip?._id || undefined),
        vehicleId: t.vehicleId ?? t.vehicle_id ?? payload.vehicleId ?? undefined,
        userId: t.userId ?? t.user_id ?? undefined,
        startTime: t.start_time ?? t.startTime,
        endTime: t.end_time ?? t.endTime,
        distance: t.distance_km ?? t.distance ?? undefined,
        energyConsumed: t.energy_consumed ?? t.energyConsumed ?? null,
        carbonSaved: t.co2_saved_kg ?? t.co2_saved ?? t.carbonSaved ?? undefined,
        verificationStatus: t.verificationStatus ?? 'PENDING',
        createdAt: t.created_at ?? t.createdAt ?? undefined,
        // include raw server object so callers can inspect any other fields
        _raw: t,
      } as Trip;
    };

    // If server returned a wrapper with a data field
    if (raw && typeof raw === 'object') {
      // If server uses data.trip (vehicle-specific response)
      if (raw.data && raw.data.trip) {
        return mapServerTrip(raw.data.trip);
      }

      // If server returned data that already matches frontend shape
      if (raw.data && typeof raw.data === 'object' && raw.data.id) {
        return mapServerTrip(raw.data);
      }

      // If server returned the trip directly
      if (raw.id || raw._id) {
        return mapServerTrip(raw);
      }
    }

    // Fallback: return raw as-is (maintain previous behavior for tests/mocks)
    return raw as Trip;
  },

  // Calculate CO2 savings for a trip
  calculateCO2: async (distance: number, energyConsumed: number): Promise<{ carbonSaved: number }> => {
    const response = await apiClient.post<{ carbonSaved: number }>('/api/vehicles/calculate-co2', {
      distance,
      energyConsumed,
    });
    return response.data;
  },
};

export const vehicleService = {
  // Get all vehicles for current user
  getMyVehicles: async (): Promise<Vehicle[]> => {
    // matches backend route GET /api/vehicles which returns { success, count, data }
    const response = await apiClient.get<any>('/api/vehicles');
    const payload = response.data;
    const items = Array.isArray(payload) ? payload : (payload?.data ?? []);
    return items.map((v: any) => ({
      id: v.id ?? v._id,
      userId: v.userId ?? v.user_id,
      make: v.make,
      model: v.model,
      year: v.year,
      batteryCapacity: v.battery_capacity ?? v.batteryCapacity,
      registrationNumber: v.license_plate ?? v.registrationNumber,
      createdAt: v.created_at ?? v.createdAt,
    }));
  },

  // Register a new vehicle
  registerVehicle: async (vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
    // Normalize to server expected keys (snake_case) to match validators
    const payload: any = {
      make: vehicleData.make,
      model: vehicleData.model,
      year: vehicleData.year,
      battery_capacity: (vehicleData as any).batteryCapacity ?? vehicleData.batteryCapacity,
      license_plate: (vehicleData as any).registrationNumber ?? (vehicleData as any).license_plate ?? '',
      // allow optional fields if present
      vin: (vehicleData as any).vin,
      color: (vehicleData as any).color,
      purchase_date: (vehicleData as any).purchase_date ?? (vehicleData as any).purchaseDate,
    };

    try {
      const response = await apiClient.post<any>('/api/vehicles', payload);

      // Backend sometimes wraps the created vehicle in { success, message, data }
      // while tests / mocks may return the object directly. Normalize both shapes
      // and map snake_case -> camelCase so callers always receive a Vehicle
      // object with an `id` (MUI DataGrid requires unique id for rows).
      const raw = response.data;
      const serverObj = raw && raw.data ? raw.data : raw;

      return {
        id: serverObj.id ?? serverObj._id,
        userId: serverObj.userId ?? serverObj.user_id,
        make: serverObj.make,
        model: serverObj.model,
        year: serverObj.year,
        batteryCapacity: serverObj.battery_capacity ?? serverObj.batteryCapacity,
        registrationNumber: serverObj.license_plate ?? serverObj.registrationNumber,
        createdAt: serverObj.created_at ?? serverObj.createdAt,
        ...(serverObj || {}),
      } as unknown as Vehicle;
    } catch (err: any) {
      // Normalize axios errors into a throw that includes status and response
      // Some tests provide a plain Error object with a `response` property, so
      // treat that as an error coming from axios as well.
      if (axios.isAxiosError(err) || err?.response) {
        const status = err.response?.status;
        const message = err.response?.data?.message || err.message || 'Failed to register vehicle';
        const e: any = new Error(message);
        e.status = status;
        e.response = err.response?.data;
        throw e;
      }
      throw err;
    }
  },

  // Update vehicle
  updateVehicle: async (vehicleId: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await apiClient.put<Vehicle>(`/api/vehicles/${vehicleId}`, vehicleData);
    return response.data;
  },

  // Delete vehicle
  deleteVehicle: async (vehicleId: string): Promise<void> => {
    await apiClient.delete(`/api/vehicles/${vehicleId}`);
  },
};
