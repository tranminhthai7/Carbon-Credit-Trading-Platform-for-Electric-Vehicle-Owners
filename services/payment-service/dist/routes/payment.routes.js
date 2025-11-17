"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
const paymentController = new payment_controller_1.PaymentController();
// Core Payment APIs
router.post('/create', validation_1.validatePaymentCreate, paymentController.createPayment);
router.post('/confirm', validation_1.validatePaymentConfirm, paymentController.confirmPayment);
router.get('/:userId/history', paymentController.getPaymentHistory);
// Escrow APIs (Ký quỹ)
router.post('/escrow/create', validation_1.validateEscrowCreate, paymentController.createEscrow);
router.post('/escrow/release', paymentController.releaseEscrow);
// Withdrawal APIs (Rút tiền)
router.post('/withdrawal/create', validation_1.validateWithdrawalCreate, paymentController.createWithdrawal);
router.post('/withdrawal/process', paymentController.processWithdrawal);
// Cash Flow Management (Quản lý dòng tiền)
router.get('/:user_id/dashboard', paymentController.getCashFlowDashboard);
exports.default = router;
