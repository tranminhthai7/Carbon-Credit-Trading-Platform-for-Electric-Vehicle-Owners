import { Request, Response } from 'express';
import { Vehicle } from '../models/vehicle.model';
import { addTripSchema, getTripStatsSchema } from '../validators/trip.validator';

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

    // Validate request body
    const { error, value } = addTripSchema.validate(req.body, {
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

    // Calculate CO2 saved based on distance
    const co2_saved_kg = value.distance_km * CO2_SAVED_PER_KM;
    const gasoline_co2_kg = value.distance_km * GASOLINE_BASELINE;
    const co2_reduction_percentage = ((co2_saved_kg / gasoline_co2_kg) * 100).toFixed(2);

    // Create trip object
    const newTrip = {
      start_time: new Date(value.start_time),
      end_time: new Date(value.end_time),
      distance_km: value.distance_km,
      co2_saved_kg: parseFloat(co2_saved_kg.toFixed(3)), // Round to 3 decimal places
      start_location: value.start_location,
      end_location: value.end_location,
      notes: value.notes,
      created_at: new Date(),
    };

    // Add trip to vehicle's trips array
    vehicle.trips.push(newTrip as any);

    // Update totals
    vehicle.total_distance_km += value.distance_km;
    vehicle.total_co2_saved_kg += co2_saved_kg;

    // Save vehicle
    await vehicle.save();

    res.status(201).json({
      success: true,
      message: 'Trip added successfully',
      data: {
        trip: newTrip,
        calculation: {
          distance_km: value.distance_km,
          co2_saved_kg: parseFloat(co2_saved_kg.toFixed(3)),
          gasoline_equivalent_kg: parseFloat(gasoline_co2_kg.toFixed(3)),
          co2_reduction_percentage: `${co2_reduction_percentage}%`,
          formula: `CO2_saved = ${CO2_SAVED_PER_KM} kg/km × ${value.distance_km} km = ${co2_saved_kg.toFixed(3)} kg`,
        },
        vehicle_totals: {
          total_trips: vehicle.trips.length,
          total_distance_km: vehicle.total_distance_km,
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
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
        const monthTrips = vehicle.trips.filter(
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
