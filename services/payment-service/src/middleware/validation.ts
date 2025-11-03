import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validatePaymentCreate = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    buyer_id: Joi.string().uuid().required(),
    amount: Joi.number().positive().required(),
    payment_method: Joi.string().valid('stripe', 'paypal', 'bank_transfer').default('stripe'),
    credit_listing_id: Joi.string().uuid().optional(),
    description: Joi.string().max(500).optional()
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

export const validatePaymentConfirm = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    payment_id: Joi.string().uuid().required(),
    transaction_id: Joi.string().optional()
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

export const validateEscrowCreate = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    buyer_id: Joi.string().uuid().required(),
    seller_id: Joi.string().uuid().required(),
    credit_listing_id: Joi.string().uuid().required(),
    amount: Joi.number().positive().required(),
    payment_method: Joi.string().valid('stripe', 'paypal', 'bank_transfer').default('stripe')
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

export const validateWithdrawalCreate = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    user_id: Joi.string().uuid().required(),
    amount: Joi.number().positive().required(),
    method: Joi.string().valid('bank_transfer', 'paypal', 'stripe', 'wallet').required(),
    bank_details: Joi.object({
      account_number: Joi.string().when('method', { is: 'bank_transfer', then: Joi.required() }),
      account_holder_name: Joi.string().when('method', { is: 'bank_transfer', then: Joi.required() }),
      bank_name: Joi.string().when('method', { is: 'bank_transfer', then: Joi.required() }),
      paypal_email: Joi.string().email().when('method', { is: 'paypal', then: Joi.required() })
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