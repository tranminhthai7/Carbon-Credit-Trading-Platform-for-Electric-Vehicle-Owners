import express from 'express';
import multer from 'multer';
import { addTrip, getVehicleTrips, getCO2Savings, getMyTrips, addTripToDefaultVehicle, importTrips, deleteTrip, updateTrip } from '../controllers/trip.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Configure multer for file uploads (memory storage for CSV)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

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
 * @route   GET /api/vehicles/trips/user
 * @desc    Get all trips for the current authenticated user (across vehicles)
 * @access  Private
 */
router.get('/trips/user', getMyTrips);

/**
 * @route   POST /api/vehicles/trips
 * @desc    Create a trip for current user. If payload contains vehicleId, use it
 *          otherwise use the user's first vehicle.
 * @access  Private
 */
router.post('/trips', addTripToDefaultVehicle);

/**
 * @route   POST /api/vehicles/:id/trips/import
 * @desc    Import trips from CSV file or JSON array
 * @access  Private
 */
router.post('/:id/trips/import', upload.single('file'), importTrips);

/**
 * @route   GET /api/vehicles/:id/co2-savings
 * @desc    Get CO2 savings statistics (Issue #6 API endpoint)
 * @access  Private
 */
router.get('/:id/co2-savings', getCO2Savings);

/**
 * @route   DELETE /api/vehicles/:vehicleId/trips/:tripIndex
 * @desc    Delete a trip from a vehicle
 * @access  Private
 */
router.delete('/:vehicleId/trips/:tripIndex', deleteTrip);

/**
 * @route   PUT /api/vehicles/:vehicleId/trips/:tripIndex
 * @desc    Update a trip in a vehicle
 * @access  Private
 */
router.put('/:vehicleId/trips/:tripIndex', updateTrip);

export default router;
