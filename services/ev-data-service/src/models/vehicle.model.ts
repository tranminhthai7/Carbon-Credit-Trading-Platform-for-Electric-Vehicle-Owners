import mongoose, { Schema } from 'mongoose';
import { ITrip, tripSchema } from './trip.model';

// Interface định nghĩa structure của Vehicle
export interface IVehicle {
  user_id: string;
  make: string;
  model: string;
  year: number;
  battery_capacity: number;
  license_plate: string;
  vin?: string;
  color?: string;
  purchase_date?: Date;
  trips: ITrip[];
  total_distance_km: number;
  total_co2_saved_kg: number;
}

// Mongoose Schema
const vehicleSchema = new Schema<IVehicle>(
  {
    user_id: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    make: {
      type: String,
      required: [true, 'Vehicle make is required'],
      trim: true,
      maxlength: [50, 'Make cannot exceed 50 characters'],
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true,
      maxlength: [50, 'Model cannot exceed 50 characters'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [2000, 'Year must be 2000 or later'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    battery_capacity: {
      type: Number,
      required: [true, 'Battery capacity is required'],
      min: [10, 'Battery capacity must be at least 10 kWh'],
      max: [200, 'Battery capacity cannot exceed 200 kWh'],
    },
    license_plate: {
      type: String,
      required: [true, 'License plate is required'],
      trim: true,
      uppercase: true,
      unique: true,
      maxlength: [20, 'License plate cannot exceed 20 characters'],
    },
    vin: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [17, 'VIN must be 17 characters'],
      minlength: [17, 'VIN must be 17 characters'],
      sparse: true, // Allows multiple null values
    },
    color: {
      type: String,
      trim: true,
      maxlength: [30, 'Color cannot exceed 30 characters'],
    },
    purchase_date: {
      type: Date,
    },
    trips: {
      type: [tripSchema],
      default: [],
    },
    total_distance_km: {
      type: Number,
      default: 0,
      min: [0, 'Total distance cannot be negative'],
    },
    total_co2_saved_kg: {
      type: Number,
      default: 0,
      min: [0, 'Total CO2 saved cannot be negative'],
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Index for faster queries
vehicleSchema.index({ user_id: 1, created_at: -1 });

// Export model
export const Vehicle = mongoose.model<IVehicle>('Vehicle', vehicleSchema);
