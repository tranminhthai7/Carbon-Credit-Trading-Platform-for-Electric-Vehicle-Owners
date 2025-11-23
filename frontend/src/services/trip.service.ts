import { apiClient } from './api';
import { Trip, Vehicle } from '../types';

export const tripService = {
  // Get all trips for current user
  getMyTrips: async (): Promise<Trip[]> => {
    const response = await apiClient.get<Trip[]>('/api/vehicles/trips/user');
    return response.data;
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
      start_location: (tripData as any).start_location ?? tripData.startLocation ?? undefined,
      end_location: (tripData as any).end_location ?? tripData.endLocation ?? undefined,
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

    const response = await apiClient.post<Trip>('/api/vehicles/trips', payload);
    return response.data;
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
    const response = await apiClient.get<Vehicle[]>('/api/vehicles/user');
    return response.data;
  },

  // Register a new vehicle
  registerVehicle: async (vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await apiClient.post<Vehicle>('/api/vehicles', vehicleData);
    return response.data;
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
