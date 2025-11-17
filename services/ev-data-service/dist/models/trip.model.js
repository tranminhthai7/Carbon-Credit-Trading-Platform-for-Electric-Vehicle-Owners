"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripSchema = void 0;
const mongoose_1 = require("mongoose");
/**
 * Trip Schema (embedded in Vehicle)
 */
exports.tripSchema = new mongoose_1.Schema({
    start_time: {
        type: Date,
        required: [true, 'Start time is required'],
        validate: {
            validator: function (value) {
                return value <= new Date();
            },
            message: 'Start time cannot be in the future',
        },
    },
    end_time: {
        type: Date,
        required: [true, 'End time is required'],
        validate: {
            validator: function (value) {
                return value >= this.start_time;
            },
            message: 'End time must be after start time',
        },
    },
    distance_km: {
        type: Number,
        required: [true, 'Distance is required'],
        min: [0.1, 'Distance must be at least 0.1 km'],
        max: [10000, 'Distance cannot exceed 10,000 km'],
    },
    co2_saved_kg: {
        type: Number,
        required: [true, 'CO2 saved is required'],
        min: [0, 'CO2 saved cannot be negative'],
    },
    start_location: {
        latitude: {
            type: Number,
            min: [-90, 'Latitude must be between -90 and 90'],
            max: [90, 'Latitude must be between -90 and 90'],
        },
        longitude: {
            type: Number,
            min: [-180, 'Longitude must be between -180 and 180'],
            max: [180, 'Longitude must be between -180 and 180'],
        },
        address: {
            type: String,
            maxlength: [200, 'Address cannot exceed 200 characters'],
        },
    },
    end_location: {
        latitude: {
            type: Number,
            min: [-90, 'Latitude must be between -90 and 90'],
            max: [90, 'Latitude must be between -90 and 90'],
        },
        longitude: {
            type: Number,
            min: [-180, 'Longitude must be between -180 and 180'],
            max: [180, 'Longitude must be between -180 and 180'],
        },
        address: {
            type: String,
            maxlength: [200, 'Address cannot exceed 200 characters'],
        },
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    _id: true, // Each trip gets its own _id
});
// Index for querying trips by date
exports.tripSchema.index({ start_time: -1 });
exports.tripSchema.index({ created_at: -1 });
