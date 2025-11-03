import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { 
  validatePaymentCreate, 
  validatePaymentConfirm,
  validateEscrowCreate,
  validateWithdrawalCreate
} from '../middleware/validation';

const router: Router = Router();
const paymentController = new PaymentController();

// Core Payment APIs
router.post('/create', validatePaymentCreate, paymentController.createPayment);
router.post('/confirm', validatePaymentConfirm, paymentController.confirmPayment);
router.get('/:userId/history', paymentController.getPaymentHistory);

// Escrow APIs (Ký quỹ)
router.post('/escrow/create', validateEscrowCreate, paymentController.createEscrow);
router.post('/escrow/release', paymentController.releaseEscrow);

// Withdrawal APIs (Rút tiền)
router.post('/withdrawal/create', validateWithdrawalCreate, paymentController.createWithdrawal);
router.post('/withdrawal/process', paymentController.processWithdrawal);

// Cash Flow Management (Quản lý dòng tiền)
router.get('/:user_id/dashboard', paymentController.getCashFlowDashboard);

export default router;