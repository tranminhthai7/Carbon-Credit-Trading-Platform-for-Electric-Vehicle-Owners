"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserId = exports.validateReportQuery = exports.validateRejection = exports.validateApproval = exports.validateKYCSubmit = exports.validateVerificationSubmit = void 0;
const joi_1 = __importDefault(require("joi"));
const validateVerificationSubmit = (req, res, next) => {
    const schema = joi_1.default.object({
        user_id: joi_1.default.string().uuid().required(),
        vehicle_id: joi_1.default.string().uuid().required(),
        co2_amount: joi_1.default.number().positive().required(),
        trips_count: joi_1.default.number().integer().positive().required(),
        emission_data: joi_1.default.object().optional(),
        trip_details: joi_1.default.object().optional()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).json({
            success: false,
            message: 'Validation error',
            details: error.details[0].message
        });
        return;
    }
    next();
};
exports.validateVerificationSubmit = validateVerificationSubmit;
const validateKYCSubmit = (req, res, next) => {
    const schema = joi_1.default.object({
        user_id: joi_1.default.string().uuid().required(),
        full_name: joi_1.default.string().min(2).max(100).required(),
        date_of_birth: joi_1.default.date().required(),
        nationality: joi_1.default.string().min(2).max(100).required(),
        address: joi_1.default.string().min(10).required(),
        phone_number: joi_1.default.string().min(10).max(20).required(),
        documents: joi_1.default.array().items(joi_1.default.object({
            type: joi_1.default.string().valid('passport', 'drivers_license', 'national_id', 'utility_bill', 'bank_statement').required(),
            file_url: joi_1.default.string().uri().required(),
            uploaded_at: joi_1.default.date().required()
        })).min(1).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).json({
            success: false,
            message: 'Validation error',
            details: error.details[0].message
        });
        return;
    }
    next();
};
exports.validateKYCSubmit = validateKYCSubmit;
const validateApproval = (req, res, next) => {
    const schema = joi_1.default.object({
        verification_id: joi_1.default.string().uuid().required(),
        cva_id: joi_1.default.string().uuid().required(),
        notes: joi_1.default.string().max(1000).optional(),
        credits_amount: joi_1.default.number().positive().optional()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).json({
            success: false,
            message: 'Validation error',
            details: error.details[0].message
        });
        return;
    }
    next();
};
exports.validateApproval = validateApproval;
const validateRejection = (req, res, next) => {
    const schema = joi_1.default.object({
        verification_id: joi_1.default.string().uuid().required(),
        cva_id: joi_1.default.string().uuid().required(),
        notes: joi_1.default.string().min(10).max(1000).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).json({
            success: false,
            message: 'Validation error',
            details: error.details[0].message
        });
        return;
    }
    next();
};
exports.validateRejection = validateRejection;
const validateReportQuery = (req, res, next) => {
    const schema = joi_1.default.object({
        start_date: joi_1.default.date().optional(),
        end_date: joi_1.default.date().optional(),
        cva_id: joi_1.default.string().uuid().optional()
    });
    const { error } = schema.validate(req.query);
    if (error) {
        res.status(400).json({
            success: false,
            message: 'Validation error',
            details: error.details[0].message
        });
        return;
    }
    next();
};
exports.validateReportQuery = validateReportQuery;
const validateUserId = (req, res, next) => {
    const schema = joi_1.default.object({
        userId: joi_1.default.string().uuid().required()
    });
    const { error } = schema.validate(req.params);
    if (error) {
        res.status(400).json({
            success: false,
            message: 'Validation error',
            details: error.details[0].message
        });
        return;
    }
    next();
};
exports.validateUserId = validateUserId;
