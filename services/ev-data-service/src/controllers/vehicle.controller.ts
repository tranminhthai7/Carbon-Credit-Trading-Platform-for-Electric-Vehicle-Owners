import { Request, Response } from 'express';
import { Vehicle } from '../models/vehicle.model';
import { createVehicleSchema, updateVehicleSchema } from '../validators/vehicle.validator';

// POST /api/vehicles - Register new vehicle
export const registerVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const { error, value } = createVehicleSchema.validate(req.body);
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
    const existingVehicle = await Vehicle.findOne({ license_plate: value.license_plate.toUpperCase() });
    if (existingVehicle) {
      res.status(409).json({
        success: false,
        message: 'License plate already registered',
      });
      return;
    }

    // Create vehicle
    const vehicle = await Vehicle.create({
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
  } catch (error: any) {
    console.error('Register vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register vehicle',
      error: error.message,
    });
  }
};

// GET /api/vehicles - Get all vehicles of current user
export const getVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    const vehicles = await Vehicle.find({ user_id }).sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (error: any) {
    console.error('Get vehicles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve vehicles',
      error: error.message,
    });
  }
};

// GET /api/vehicles/:id - Get single vehicle by ID
export const getVehicleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = req.user?.id;
    const vehicle_id = req.params.id;

    const vehicle = await Vehicle.findOne({ _id: vehicle_id, user_id });

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
  } catch (error: any) {
    console.error('Get vehicle by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve vehicle',
      error: error.message,
    });
  }
};

// PUT /api/vehicles/:id - Update vehicle
export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const { error, value } = updateVehicleSchema.validate(req.body);
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
      const existingVehicle = await Vehicle.findOne({
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

    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: vehicle_id, user_id },
      value,
      { new: true, runValidators: true }
    );

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
  } catch (error: any) {
    console.error('Update vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vehicle',
      error: error.message,
    });
  }
};

// DELETE /api/vehicles/:id - Delete vehicle
export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = req.user?.id;
    const vehicle_id = req.params.id;

    const vehicle = await Vehicle.findOneAndDelete({ _id: vehicle_id, user_id });

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
  } catch (error: any) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete vehicle',
      error: error.message,
    });
  }
};
