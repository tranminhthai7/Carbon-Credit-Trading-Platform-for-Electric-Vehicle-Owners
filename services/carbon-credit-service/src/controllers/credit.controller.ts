import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { CreditRequest } from '../entities/CreditRequest';
import { submitVerification } from '../utils/verificationClient';

const repo = () => AppDataSource.getRepository(CreditRequest);

export const createCreditRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, co2Amount, creditsAmount, idempotency_key } = req.body;
    if (!userId || !co2Amount || !creditsAmount) {
      res.status(400).json({ success: false, message: 'userId, co2Amount, creditsAmount required' });
      return;
    }
    const cr = new CreditRequest();
    cr.userId = userId;
    cr.co2Amount = co2Amount;
    cr.creditsAmount = creditsAmount;
    // Check for idempotency: if the key exists, return the previous request
    if (idempotency_key) {
      const existing = await repo().findOne({ where: { idempotency_key } });
      if (existing) {
        res.status(200).json({ success: true, data: existing });
        return;
      }
    }

    cr.idempotency_key = idempotency_key;
    const saved = await repo().save(cr);
    try {
      // Forward the request to verification service for CVA review
      await submitVerification({
        user_id: saved.userId,
        vehicle_id: req.body.vehicle_id || null,
        co2_amount: saved.co2Amount,
        credits_amount: saved.creditsAmount,
        trips_count: req.body.trips_count || 0,
        emission_data: req.body.emission_data || null,
        trip_details: req.body.trip_details || null,
      });
    } catch (err: any) {
      // Log but do not fail the request creation; verifier may be down
      console.error('Failed to forward to verification-service', err?.message || err);
    }
    res.status(201).json({ success: true, data: saved });
  } catch (err: any) {
    console.error('Create credit request error:', err);
    res.status(500).json({ success: false, message: 'Failed to create credit request' });
  }
};

export default { createCreditRequest };
