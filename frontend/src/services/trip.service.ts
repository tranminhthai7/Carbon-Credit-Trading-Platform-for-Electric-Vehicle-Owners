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
    const response = await apiClient.post<Trip>('/api/vehicles/trips', tripData);
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
