//routes/index.ts
import { Router } from 'express';
import { calculateCO2 } from '../controllers/calcController';
import { createCreditRequest } from '../controllers/credit.controller';
import {
  createWalletHandler,
  getWalletHandler,
  mintHandler,
  transferHandler,
  issueCreditsHandler,
} from '../controllers/walletController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/calculate/co2', calculateCO2);
router.post('/wallet/create', authMiddleware, createWalletHandler);
router.get('/wallet/:userId', authMiddleware, getWalletHandler);
router.post('/wallet/mint', authMiddleware, mintHandler);
router.post('/wallet/transfer', authMiddleware, transferHandler);
router.post('/wallet/credits/issue', authMiddleware, issueCreditsHandler);

// Credit requests
router.post('/credits/request', authMiddleware, createCreditRequest);

// Debugging route: return raw request body as string to inspect incoming payloads
// Debug route is removed. If you need to debug raw request bodies, set NODE_ENV != 'production' and use local logging.

export default router;