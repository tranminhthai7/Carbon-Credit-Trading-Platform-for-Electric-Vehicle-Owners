import express from 'express';
import {
  registerVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicle.controller';
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

export default router;
