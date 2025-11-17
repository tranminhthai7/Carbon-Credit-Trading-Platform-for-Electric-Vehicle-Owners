"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicle = exports.updateVehicle = exports.getVehicleById = exports.getVehicles = exports.registerVehicle = void 0;
const vehicle_model_1 = require("../models/vehicle.model");
const vehicle_validator_1 = require("../validators/vehicle.validator");
// POST /api/vehicles - Register new vehicle
const registerVehicle = async (req, res) => {
    try {
        // Validate input
        const { error, value } = vehicle_validator_1.createVehicleSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map((detail) => detail.message),
            });
            return;
        }
        // Get user_id from JWT token (set by authMiddleware)
        const user_id = req.user?.id;
        if (!user_id) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
            return;
        }
        // Check if license plate already exists
        const existingVehicle = await vehicle_model_1.Vehicle.findOne({ license_plate: value.license_plate.toUpperCase() });
        if (existingVehicle) {
            res.status(409).json({
                success: false,
                message: 'License plate already registered',
            });
            return;
        }
        // Create vehicle
        const vehicle = await vehicle_model_1.Vehicle.create({
            ...value,
            user_id,
            license_plate: value.license_plate.toUpperCase(),
            vin: value.vin?.toUpperCase(),
        });
        res.status(201).json({
            success: true,
            message: 'Vehicle registered successfully',
            data: vehicle,
        });
    }
    catch (error) {
        console.error('Register vehicle error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to register vehicle',
            error: error.message,
        });
    }
};
exports.registerVehicle = registerVehicle;
// GET /api/vehicles - Get all vehicles of current user
const getVehicles = async (req, res) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
            return;
        }
        const vehicles = await vehicle_model_1.Vehicle.find({ user_id }).sort({ created_at: -1 });
        res.status(200).json({
            success: true,
            count: vehicles.length,
            data: vehicles,
        });
    }
    catch (error) {
        console.error('Get vehicles error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve vehicles',
            error: error.message,
        });
    }
};
exports.getVehicles = getVehicles;
// GET /api/vehicles/:id - Get single vehicle by ID
const getVehicleById = async (req, res) => {
    try {
        const user_id = req.user?.id;
        const vehicle_id = req.params.id;
        const vehicle = await vehicle_model_1.Vehicle.findOne({ _id: vehicle_id, user_id });
        if (!vehicle) {
            res.status(404).json({
                success: false,
                message: 'Vehicle not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: vehicle,
        });
    }
    catch (error) {
        console.error('Get vehicle by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve vehicle',
            error: error.message,
        });
    }
};
exports.getVehicleById = getVehicleById;
// PUT /api/vehicles/:id - Update vehicle
const updateVehicle = async (req, res) => {
    try {
        // Validate input
        const { error, value } = vehicle_validator_1.updateVehicleSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map((detail) => detail.message),
            });
            return;
        }
        const user_id = req.user?.id;
        const vehicle_id = req.params.id;
        // Check if license plate is being updated and already exists
        if (value.license_plate) {
            const existingVehicle = await vehicle_model_1.Vehicle.findOne({
                license_plate: value.license_plate.toUpperCase(),
                _id: { $ne: vehicle_id },
            });
            if (existingVehicle) {
                res.status(409).json({
                    success: false,
                    message: 'License plate already registered',
                });
                return;
            }
            value.license_plate = value.license_plate.toUpperCase();
        }
        if (value.vin) {
            value.vin = value.vin.toUpperCase();
        }
        const vehicle = await vehicle_model_1.Vehicle.findOneAndUpdate({ _id: vehicle_id, user_id }, value, { new: true, runValidators: true });
        if (!vehicle) {
            res.status(404).json({
                success: false,
                message: 'Vehicle not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Vehicle updated successfully',
            data: vehicle,
        });
    }
    catch (error) {
        console.error('Update vehicle error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update vehicle',
            error: error.message,
        });
    }
};
exports.updateVehicle = updateVehicle;
// DELETE /api/vehicles/:id - Delete vehicle
const deleteVehicle = async (req, res) => {
    try {
        const user_id = req.user?.id;
        const vehicle_id = req.params.id;
        const vehicle = await vehicle_model_1.Vehicle.findOneAndDelete({ _id: vehicle_id, user_id });
        if (!vehicle) {
            res.status(404).json({
                success: false,
                message: 'Vehicle not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Vehicle deleted successfully',
            data: vehicle,
        });
    }
    catch (error) {
        console.error('Delete vehicle error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete vehicle',
            error: error.message,
        });
    }
};
exports.deleteVehicle = deleteVehicle;
