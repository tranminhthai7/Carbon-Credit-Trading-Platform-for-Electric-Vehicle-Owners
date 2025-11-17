"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.pattern.base': 'Password must contain uppercase, lowercase, number and special character',
        'any.required': 'Password is required'
    }),
    role: joi_1.default.string()
        .valid('ev_owner', 'buyer', 'cva', 'admin')
        .required()
        .messages({
        'any.only': 'Role must be one of: ev_owner, buyer, cva, admin',
        'any.required': 'Role is required'
    }),
    full_name: joi_1.default.string()
        .min(2)
        .max(255)
        .optional(),
    phone: joi_1.default.string()
        .pattern(/^[0-9+\-\(\) ]{10,20}$/)
        .optional()
        .messages({
        'string.pattern.base': 'Invalid phone number format'
    })
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string()
        .required()
        .messages({
        'any.required': 'Password is required'
    })
});
//# sourceMappingURL=auth.validator.js.map