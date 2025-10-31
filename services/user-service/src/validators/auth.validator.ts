import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain uppercase, lowercase, number and special character',
      'any.required': 'Password is required'
    }),
  
  role: Joi.string()
    .valid('ev_owner', 'buyer', 'cva', 'admin')
    .required()
    .messages({
      'any.only': 'Role must be one of: ev_owner, buyer, cva, admin',
      'any.required': 'Role is required'
    }),
  
  full_name: Joi.string()
    .min(2)
    .max(255)
    .optional(),
  
  phone: Joi.string()
    .pattern(/^[0-9+\-\(\) ]{10,20}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid phone number format'
    })
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});
