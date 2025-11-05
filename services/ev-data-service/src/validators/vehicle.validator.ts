import Joi from 'joi';

// Schema validation cho việc tạo vehicle mới
export const createVehicleSchema = Joi.object({
  make: Joi.string()
    .trim()
    .max(50)
    .required()
    .messages({
      'string.empty': 'Vehicle make is required',
      'string.max': 'Make cannot exceed 50 characters',
    }),
  
  model: Joi.string()
    .trim()
    .max(50)
    .required()
    .messages({
      'string.empty': 'Vehicle model is required',
      'string.max': 'Model cannot exceed 50 characters',
    }),
  
  year: Joi.number()
    .integer()
    .min(2000)
    .max(new Date().getFullYear() + 1)
    .required()
    .messages({
      'number.base': 'Year must be a number',
      'number.min': 'Year must be 2000 or later',
      'number.max': 'Year cannot be in the future',
    }),
  
  battery_capacity: Joi.number()
    .min(10)
    .max(200)
    .required()
    .messages({
      'number.base': 'Battery capacity must be a number',
      'number.min': 'Battery capacity must be at least 10 kWh',
      'number.max': 'Battery capacity cannot exceed 200 kWh',
    }),
  
  license_plate: Joi.string()
    .trim()
    .max(20)
    .required()
    .messages({
      'string.empty': 'License plate is required',
      'string.max': 'License plate cannot exceed 20 characters',
    }),
  
  vin: Joi.string()
    .trim()
    .length(17)
    .optional()
    .messages({
      'string.length': 'VIN must be exactly 17 characters',
    }),
  
  color: Joi.string()
    .trim()
    .max(30)
    .optional(),
  
  purchase_date: Joi.date()
    .optional(),
});

// Schema validation cho việc update vehicle
export const updateVehicleSchema = Joi.object({
  make: Joi.string().trim().max(50).optional(),
  model: Joi.string().trim().max(50).optional(),
  year: Joi.number().integer().min(2000).max(new Date().getFullYear() + 1).optional(),
  battery_capacity: Joi.number().min(10).max(200).optional(),
  license_plate: Joi.string().trim().max(20).optional(),
  vin: Joi.string().trim().length(17).optional(),
  color: Joi.string().trim().max(30).optional(),
  purchase_date: Joi.date().optional(),
}).min(1); // At least one field must be present
