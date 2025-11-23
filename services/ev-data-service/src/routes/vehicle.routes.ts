import express from 'express';
import multer from 'multer';
import {
  registerVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicle.controller';
import { generateCredits, importTrips } from '../controllers/trip.controller';
import { pruneVehicleIdempotencyKeys } from '../controllers/trip.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// POST /api/vehicles - Register new vehicle
router.post('/', registerVehicle);

// GET /api/vehicles - Get all vehicles of current user
router.get('/', getVehicles);

// GET /api/vehicles/:id - Get single vehicle by ID
router.get('/:id', getVehicleById);

// PUT /api/vehicles/:id - Update vehicle
router.put('/:id', updateVehicle);

// DELETE /api/vehicles/:id - Delete vehicle
router.delete('/:id', deleteVehicle);

// Generate credits from vehicle's CO2 savings
router.post('/:id/generate-credits', generateCredits);

// multer memory storage - parse CSV file in memory
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Import trips from JSON payload (array of trips) or upload CSV via multipart/form-data (field `file`)
router.post('/:id/trips/import', upload.single('file'), importTrips);

// Prune idempotency keys for a vehicle (admin/user endpoint)
router.post('/:id/prune-idempotency-keys', pruneVehicleIdempotencyKeys);

export default router;
