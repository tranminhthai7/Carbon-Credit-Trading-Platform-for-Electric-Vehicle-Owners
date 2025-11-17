"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trip_controller_1 = require("../controllers/trip.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
/**
 * All routes require JWT authentication
 */
router.use(auth_middleware_1.authMiddleware);
/**
 * @route   POST /api/vehicles/:id/trips
 * @desc    Add a new trip to a vehicle
 * @access  Private
 */
router.post('/:id/trips', trip_controller_1.addTrip);
/**
 * @route   GET /api/vehicles/:id/trips
 * @desc    Get all trips for a vehicle
 * @access  Private
 */
router.get('/:id/trips', trip_controller_1.getVehicleTrips);
/**
 * @route   GET /api/vehicles/:id/co2-savings
 * @desc    Get CO2 savings statistics (Issue #6 API endpoint)
 * @access  Private
 */
router.get('/:id/co2-savings', trip_controller_1.getCO2Savings);
exports.default = router;
