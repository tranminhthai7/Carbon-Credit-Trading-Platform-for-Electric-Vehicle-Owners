import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateVerificationSubmit = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    vehicle_id: Joi.string().required(),
    co2_amount: Joi.number().positive().required(),
    trips_count: Joi.number().integer().positive().required(),
    emission_data: Joi.object().optional(),
    trip_details: Joi.object().optional()
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

export const validateKYCSubmit = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    user_id: Joi.string().uuid().required(),
    full_name: Joi.string().min(2).max(100).required(),
    date_of_birth: Joi.date().required(),
    nationality: Joi.string().min(2).max(100).required(),
    address: Joi.string().min(10).required(),
    phone_number: Joi.string().min(10).max(20).required(),
    documents: Joi.array().items(
      Joi.object({
        type: Joi.string().valid('passport', 'drivers_license', 'national_id', 'utility_bill', 'bank_statement').required(),
        file_url: Joi.string().uri().required(),
        uploaded_at: Joi.date().required()
      })
    ).min(1).required()
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

export const validateApproval = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    verification_id: Joi.string().required(),
    cva_id: Joi.string().required(),
    notes: Joi.string().max(1000).optional(),
    credits_amount: Joi.number().positive().optional()
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

export const validateRejection = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    verification_id: Joi.string().required(),
    cva_id: Joi.string().required(),
    notes: Joi.string().min(10).max(1000).required()
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

export const validateReportQuery = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    start_date: Joi.date().optional(),
    end_date: Joi.date().optional(),
    cva_id: Joi.string().uuid().optional()
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

export const validateUserId = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    userId: Joi.string().required()
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