"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vehicle_controller_1 = require("../controllers/vehicle.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_middleware_1.authMiddleware);
// POST /api/vehicles - Register new vehicle
router.post('/', vehicle_controller_1.registerVehicle);
// GET /api/vehicles - Get all vehicles of current user
router.get('/', vehicle_controller_1.getVehicles);
// GET /api/vehicles/:id - Get single vehicle by ID
router.get('/:id', vehicle_controller_1.getVehicleById);
// PUT /api/vehicles/:id - Update vehicle
router.put('/:id', vehicle_controller_1.updateVehicle);
// DELETE /api/vehicles/:id - Delete vehicle
router.delete('/:id', vehicle_controller_1.deleteVehicle);
exports.default = router;
