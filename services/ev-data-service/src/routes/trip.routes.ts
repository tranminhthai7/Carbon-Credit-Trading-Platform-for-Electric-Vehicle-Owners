import express from 'express';
import { addTrip, getVehicleTrips, getCO2Savings } from '../controllers/trip.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * All routes require JWT authentication
 */
router.use(authMiddleware);

/**
 * @route   POST /api/vehicles/:id/trips
 * @desc    Add a new trip to a vehicle
 * @access  Private
 */
router.post('/:id/trips', addTrip);

/**
 * @route   GET /api/vehicles/:id/trips
 * @desc    Get all trips for a vehicle
 * @access  Private
 */
router.get('/:id/trips', getVehicleTrips);

/**
 * @route   GET /api/vehicles/:id/co2-savings
 * @desc    Get CO2 savings statistics (Issue #6 API endpoint)
 * @access  Private
 */
router.get('/:id/co2-savings', getCO2Savings);

export default router;
