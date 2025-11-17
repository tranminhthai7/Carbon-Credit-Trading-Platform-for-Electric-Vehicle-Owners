"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWithdrawalCreate = exports.validateEscrowCreate = exports.validatePaymentConfirm = exports.validatePaymentCreate = void 0;
const joi_1 = __importDefault(require("joi"));
const validatePaymentCreate = (req, res, next) => {
    const schema = joi_1.default.object({
        buyer_id: joi_1.default.string().uuid().required(),
        amount: joi_1.default.number().positive().required(),
        payment_method: joi_1.default.string().valid('stripe', 'paypal', 'bank_transfer').default('stripe'),
        credit_listing_id: joi_1.default.string().uuid().optional(),
        description: joi_1.default.string().max(500).optional()
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
exports.validatePaymentCreate = validatePaymentCreate;
const validatePaymentConfirm = (req, res, next) => {
    const schema = joi_1.default.object({
        payment_id: joi_1.default.string().uuid().required(),
        transaction_id: joi_1.default.string().optional()
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
exports.validatePaymentConfirm = validatePaymentConfirm;
const validateEscrowCreate = (req, res, next) => {
    const schema = joi_1.default.object({
        buyer_id: joi_1.default.string().uuid().required(),
        seller_id: joi_1.default.string().uuid().required(),
        credit_listing_id: joi_1.default.string().uuid().required(),
        amount: joi_1.default.number().positive().required(),
        payment_method: joi_1.default.string().valid('stripe', 'paypal', 'bank_transfer').default('stripe')
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
exports.validateEscrowCreate = validateEscrowCreate;
const validateWithdrawalCreate = (req, res, next) => {
    const schema = joi_1.default.object({
        user_id: joi_1.default.string().uuid().required(),
        amount: joi_1.default.number().positive().required(),
        method: joi_1.default.string().valid('bank_transfer', 'paypal', 'stripe', 'wallet').required(),
        bank_details: joi_1.default.object({
            account_number: joi_1.default.string().when('method', { is: 'bank_transfer', then: joi_1.default.required() }),
            account_holder_name: joi_1.default.string().when('method', { is: 'bank_transfer', then: joi_1.default.required() }),
            bank_name: joi_1.default.string().when('method', { is: 'bank_transfer', then: joi_1.default.required() }),
            paypal_email: joi_1.default.string().email().when('method', { is: 'paypal', then: joi_1.default.required() })
        }).required()
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
exports.validateWithdrawalCreate = validateWithdrawalCreate;
