//routes/index.ts
import { Router } from 'express';
import { calculateCO2 } from '../controllers/calcController';
import {
  createWalletHandler,
  getWalletHandler,
  mintHandler,
  transferHandler,
} from '../controllers/walletController';

const router = Router();

router.post('/calculate/co2', calculateCO2);
router.post('/wallet/create', createWalletHandler);
router.get('/wallet/:userId', getWalletHandler);
router.post('/wallet/mint', mintHandler);
router.post('/wallet/transfer', transferHandler);

export default router;