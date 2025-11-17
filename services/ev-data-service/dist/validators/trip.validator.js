"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTripStatsSchema = exports.addTripSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Validation schema for adding a new trip
 */
exports.addTripSchema = joi_1.default.object({
    start_time: joi_1.default.date()
        .max('now')
        .required()
        .messages({
        'date.base': 'Start time must be a valid date',
        'date.max': 'Start time cannot be in the future',
        'any.required': 'Start time is required',
    }),
    end_time: joi_1.default.date()
        .greater(joi_1.default.ref('start_time'))
        .required()
        .messages({
        'date.base': 'End time must be a valid date',
        'date.greater': 'End time must be after start time',
        'any.required': 'End time is required',
    }),
    distance_km: joi_1.default.number()
        .min(0.1)
        .max(10000)
        .required()
        .messages({
        'number.base': 'Distance must be a number',
        'number.min': 'Distance must be at least 0.1 km',
        'number.max': 'Distance cannot exceed 10,000 km',
        'any.required': 'Distance is required',
    }),
    start_location: joi_1.default.object({
        latitude: joi_1.default.number().min(-90).max(90).messages({
            'number.min': 'Latitude must be between -90 and 90',
            'number.max': 'Latitude must be between -90 and 90',
        }),
        longitude: joi_1.default.number().min(-180).max(180).messages({
            'number.min': 'Longitude must be between -180 and 180',
            'number.max': 'Longitude must be between -180 and 180',
        }),
        address: joi_1.default.string().max(200).messages({
            'string.max': 'Address cannot exceed 200 characters',
        }),
    }).optional(),
    end_location: joi_1.default.object({
        latitude: joi_1.default.number().min(-90).max(90).messages({
            'number.min': 'Latitude must be between -90 and 90',
            'number.max': 'Latitude must be between -90 and 90',
        }),
        longitude: joi_1.default.number().min(-180).max(180).messages({
            'number.min': 'Longitude must be between -180 and 180',
            'number.max': 'Longitude must be between -180 and 180',
        }),
        address: joi_1.default.string().max(200).messages({
            'string.max': 'Address cannot exceed 200 characters',
        }),
    }).optional(),
    notes: joi_1.default.string().max(500).optional().messages({
        'string.max': 'Notes cannot exceed 500 characters',
    }),
});
/**
 * Validation schema for CO2 savings statistics query parameters
 */
exports.getTripStatsSchema = joi_1.default.object({
    period: joi_1.default.string()
        .valid('monthly', 'yearly', 'all')
        .default('all')
        .messages({
        'any.only': 'Period must be one of: monthly, yearly, all',
    }),
    year: joi_1.default.number()
        .integer()
        .min(2000)
        .max(new Date().getFullYear())
        .when('period', {
        is: joi_1.default.valid('monthly', 'yearly'),
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional(),
    })
        .messages({
        'number.base': 'Year must be a number',
        'number.min': 'Year must be 2000 or later',
        'number.max': `Year cannot exceed ${new Date().getFullYear()}`,
        'any.required': 'Year is required for monthly/yearly period',
    }),
    month: joi_1.default.number()
        .integer()
        .min(1)
        .max(12)
        .when('period', {
        is: 'monthly',
        then: joi_1.default.required(),
        otherwise: joi_1.default.forbidden(),
    })
        .messages({
        'number.base': 'Month must be a number',
        'number.min': 'Month must be between 1 and 12',
        'number.max': 'Month must be between 1 and 12',
        'any.required': 'Month is required for monthly period',
        'any.unknown': 'Month is only allowed for monthly period',
    }),
});
