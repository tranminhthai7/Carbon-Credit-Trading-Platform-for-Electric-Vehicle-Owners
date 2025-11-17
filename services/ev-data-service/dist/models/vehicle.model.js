"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const trip_model_1 = require("./trip.model");
// Mongoose Schema
const vehicleSchema = new mongoose_1.Schema({
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
        type: [trip_model_1.tripSchema],
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
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
// Index for faster queries
vehicleSchema.index({ user_id: 1, created_at: -1 });
// Export model
exports.Vehicle = mongoose_1.default.model('Vehicle', vehicleSchema);
