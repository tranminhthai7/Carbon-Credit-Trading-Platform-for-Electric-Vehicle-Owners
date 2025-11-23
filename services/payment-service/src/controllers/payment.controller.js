"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const database_1 = require("../config/database");
const Payment_1 = require("../entities/Payment");
const Escrow_1 = require("../entities/Escrow");
const Withdrawal_1 = require("../entities/Withdrawal");
const env_1 = require("../config/env");
const stripe_1 = __importDefault(require("stripe"));
const uuid_1 = require("uuid");
const stripe = new stripe_1.default(env_1.envConfig.STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-16',
});
class PaymentController {
    constructor() {
        this.paymentRepository = database_1.AppDataSource.getRepository(Payment_1.Payment);
        this.escrowRepository = database_1.AppDataSource.getRepository(Escrow_1.Escrow);
        this.withdrawalRepository = database_1.AppDataSource.getRepository(Withdrawal_1.Withdrawal);
        this.createPayment = async (req, res) => {
            try {
                const { buyer_id, amount, payment_method, credit_listing_id } = req.body;
                const payment = new Payment_1.Payment();
                payment.id = (0, uuid_1.v4)();
                payment.buyer_id = buyer_id;
                payment.amount = amount;
                payment.payment_method = payment_method || Payment_1.PaymentMethod.STRIPE;
                payment.status = Payment_1.PaymentStatus.PENDING;
                let paymentIntent;
                if (payment.payment_method === Payment_1.PaymentMethod.STRIPE) {
                    paymentIntent = await stripe.paymentIntents.create({
                        amount: Math.round(amount * 100),
                        currency: 'usd',
                        automatic_payment_methods: { enabled: true },
                        metadata: {
                            payment_id: payment.id,
                            buyer_id: buyer_id,
                            credit_listing_id: credit_listing_id || ''
                        }
                    });
                    payment.transaction_id = paymentIntent.id;
                }
                await this.paymentRepository.save(payment);
                res.status(201).json({
                    success: true,
                    data: {
                        payment_id: payment.id,
                        client_secret: paymentIntent?.client_secret,
                        amount: payment.amount,
                        status: payment.status
                    }
                });
            }
            catch (error) {
                console.error('Create payment error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to create payment'
                });
            }
        };
        this.confirmPayment = async (req, res) => {
            try {
                const { payment_id } = req.body;
                const payment = await this.paymentRepository.findOne({
                    where: { id: payment_id }
                });
                if (!payment) {
                    res.status(404).json({
                        success: false,
                        message: 'Payment not found'
                    });
                    return;
                }
                if (payment.payment_method === Payment_1.PaymentMethod.STRIPE && payment.transaction_id) {
                    const paymentIntent = await stripe.paymentIntents.retrieve(payment.transaction_id);
                    payment.status = paymentIntent.status === 'succeeded'
                        ? Payment_1.PaymentStatus.COMPLETED
                        : Payment_1.PaymentStatus.FAILED;
                }
                await this.paymentRepository.save(payment);
                res.json({
                    success: true,
                    data: {
                        payment_id: payment.id,
                        status: payment.status,
                        amount: payment.amount
                    }
                });
            }
            catch (error) {
                console.error('Confirm payment error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to confirm payment'
                });
            }
        };
        this.getPaymentHistory = async (req, res) => {
            try {
                const { userId } = req.params;
                const { page = '1', limit = '10' } = req.query;
                const pageNum = parseInt(page, 10);
                const limitNum = parseInt(limit, 10);
                const [payments, total] = await this.paymentRepository.findAndCount({
                    where: { buyer_id: userId },
                    order: { created_at: 'DESC' },
                    take: limitNum,
                    skip: (pageNum - 1) * limitNum
                });
                res.json({
                    success: true,
                    data: {
                        payments,
                        pagination: {
                            page: pageNum,
                            limit: limitNum,
                            total,
                            totalPages: Math.ceil(total / limitNum)
                        }
                    }
                });
            }
            catch (error) {
                console.error('Get payment history error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to get payment history'
                });
            }
        };
        this.createEscrow = async (req, res) => {
            try {
                const { buyer_id, seller_id, credit_listing_id, amount, payment_method } = req.body;
                const payment = new Payment_1.Payment();
                payment.id = (0, uuid_1.v4)();
                payment.buyer_id = buyer_id;
                payment.seller_id = seller_id;
                payment.credit_listing_id = credit_listing_id;
                payment.amount = amount;
                payment.payment_method = payment_method || Payment_1.PaymentMethod.STRIPE;
                payment.payment_type = Payment_1.PaymentType.ESCROW;
                payment.status = Payment_1.PaymentStatus.PENDING;
                const escrow = new Escrow_1.Escrow();
                escrow.id = (0, uuid_1.v4)();
                escrow.buyer_id = buyer_id;
                escrow.seller_id = seller_id;
                escrow.credit_listing_id = credit_listing_id;
                escrow.payment_id = payment.id;
                escrow.amount = amount;
                escrow.fee_percentage = 2.5; // Set default fee percentage
                escrow.fee_amount = (amount * escrow.fee_percentage) / 100;
                escrow.status = Escrow_1.EscrowStatus.CREATED;
                let paymentIntent;
                if (payment.payment_method === Payment_1.PaymentMethod.STRIPE) {
                    paymentIntent = await stripe.paymentIntents.create({
                        amount: Math.round(amount * 100),
                        currency: 'usd',
                        automatic_payment_methods: { enabled: true },
                        metadata: {
                            payment_id: payment.id,
                            escrow_id: escrow.id,
                            type: 'escrow'
                        }
                    });
                    payment.transaction_id = paymentIntent.id;
                }
                payment.escrow_id = escrow.id;
                await this.paymentRepository.save(payment);
                await this.escrowRepository.save(escrow);
                res.status(201).json({
                    success: true,
                    data: {
                        payment_id: payment.id,
                        escrow_id: escrow.id,
                        client_secret: paymentIntent?.client_secret,
                        amount: payment.amount,
                        fee_amount: escrow.fee_amount,
                        status: payment.status
                    }
                });
            }
            catch (error) {
                console.error('Create escrow error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to create escrow'
                });
            }
        };
        // Create a Stripe Connect account (Express). In mock mode, return a fake account ID
        this.createConnectedAccount = async (req, res) => {
            try {
                const { country = 'US' } = req.body;
                if (env_1.envConfig.STRIPE_CONNECT_MOCK) {
                    res.json({ success: true, data: { account_id: `acct_mock_${(0, uuid_1.v4)()}` } });
                    return;
                }
                const account = await stripe.accounts.create({ type: 'express', country });
                res.json({ success: true, data: { account_id: account.id } });
            }
            catch (error) {
                console.error('Create connected account error:', error);
                res.status(500).json({ success: false, message: 'Failed to create connected account' });
            }
        };
        // Create an onboarding link for a connected Stripe account
        this.createAccountLink = async (req, res) => {
            try {
                const { account_id } = req.body;
                if (!account_id) {
                    res.status(400).json({ success: false, message: 'account_id is required' });
                    return;
                }
                if (env_1.envConfig.STRIPE_CONNECT_MOCK) {
                    res.json({ success: true, data: { url: `https://stripe.mock/onboard/${account_id}` } });
                    return;
                }
                const link = await stripe.accountLinks.create({
                    account: account_id,
                    refresh_url: `${process.env.DASHBOARD_URL || 'http://localhost:5173'}/connected-accounts/refresh`,
                    return_url: `${process.env.DASHBOARD_URL || 'http://localhost:5173'}/connected-accounts/complete`,
                    type: 'account_onboarding'
                });
                res.json({ success: true, data: { url: link.url } });
            }
            catch (error) {
                console.error('Create account link error:', error);
                res.status(500).json({ success: false, message: 'Failed to create account link' });
            }
        };
        this.releaseEscrow = async (req, res) => {
            try {
                const { escrow_id } = req.body;
                const escrow = await this.escrowRepository.findOne({
                    where: { id: escrow_id }
                });
                if (!escrow) {
                    res.status(404).json({
                        success: false,
                        message: 'Escrow not found'
                    });
                    return;
                }
                if (escrow.status !== Escrow_1.EscrowStatus.FUNDED) {
                    res.status(400).json({
                        success: false,
                        message: 'Escrow must be funded before release'
                    });
                    return;
                }
                escrow.status = Escrow_1.EscrowStatus.RELEASED;
                escrow.released_at = new Date();
                const payment = await this.paymentRepository.findOne({
                    where: { id: escrow.payment_id }
                });
                if (payment) {
                    payment.status = Payment_1.PaymentStatus.RELEASED;
                    await this.paymentRepository.save(payment);
                }
                await this.escrowRepository.save(escrow);
                res.json({
                    success: true,
                    data: {
                        escrow_id: escrow.id,
                        status: escrow.status,
                        released_amount: escrow.amount - escrow.fee_amount,
                        released_at: escrow.released_at
                    }
                });
            }
            catch (error) {
                console.error('Release escrow error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to release escrow'
                });
            }
        };
        this.createWithdrawal = async (req, res) => {
            try {
                const { user_id, amount, method, bank_details } = req.body;
                const feeRate = method === Withdrawal_1.WithdrawalMethod.BANK_TRANSFER ? 0.02 : 0.03;
                const fee = amount * feeRate;
                const netAmount = amount - fee;
                const withdrawal = new Withdrawal_1.Withdrawal();
                withdrawal.id = (0, uuid_1.v4)();
                withdrawal.user_id = user_id;
                withdrawal.amount = amount;
                withdrawal.fee = fee;
                withdrawal.net_amount = netAmount;
                withdrawal.method = method;
                withdrawal.bank_details = bank_details;
                withdrawal.status = Withdrawal_1.WithdrawalStatus.PENDING;
                await this.withdrawalRepository.save(withdrawal);
                res.status(201).json({
                    success: true,
                    data: {
                        withdrawal_id: withdrawal.id,
                        amount: withdrawal.amount,
                        fee: withdrawal.fee,
                        net_amount: withdrawal.net_amount,
                        status: withdrawal.status
                    }
                });
            }
            catch (error) {
                console.error('Create withdrawal error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to create withdrawal'
                });
            }
        };
        this.processWithdrawal = async (req, res) => {
            try {
                const { withdrawal_id } = req.body;
                const withdrawal = await this.withdrawalRepository.findOne({
                    where: { id: withdrawal_id }
                });
                if (!withdrawal) {
                    res.status(404).json({
                        success: false,
                        message: 'Withdrawal not found'
                    });
                    return;
                }
                withdrawal.status = Withdrawal_1.WithdrawalStatus.PROCESSING;
                withdrawal.processed_at = new Date();
                if (withdrawal.method === Withdrawal_1.WithdrawalMethod.STRIPE) {
                    // Stripe Connect integration for payouts
                    const accountId = withdrawal.bank_details?.stripe_account_id || withdrawal.bank_details?.stripe_account;
                    if (accountId && env_1.envConfig.STRIPE_CONNECT_MOCK === false) {
                        try {
                            const transfer = await stripe.transfers.create({
                                amount: Math.round(withdrawal.net_amount * 100),
                                currency: 'usd',
                                destination: accountId,
                                metadata: { withdrawal_id: withdrawal.id }
                            });
                            withdrawal.transaction_id = transfer.id;
                        }
                        catch (err) {
                            console.error('Stripe transfer error:', err);
                            withdrawal.status = Withdrawal_1.WithdrawalStatus.FAILED;
                            await this.withdrawalRepository.save(withdrawal);
                            res.status(500).json({ success: false, message: 'Stripe transfer failed: ' + (err.message || '') });
                            return;
                        }
                    }
                    else {
                        // Mock payout (dev mode or missing accountId): simulate a transaction ID
                        withdrawal.transaction_id = `mock-stripe-tx-${(0, uuid_1.v4)()}`;
                    }
                }
                withdrawal.status = Withdrawal_1.WithdrawalStatus.COMPLETED;
                await this.withdrawalRepository.save(withdrawal);
                res.status(200).json({
                    success: true,
                    data: {
                        withdrawal_id: withdrawal.id,
                        status: withdrawal.status,
                        processed_at: withdrawal.processed_at
                    }
                });
            }
            catch (error) {
                console.error('Process withdrawal error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to process withdrawal'
                });
            }
        };
        this.getCashFlowDashboard = async (req, res) => {
            try {
                const { user_id } = req.params;
                const totalPaid = await this.paymentRepository
                    .createQueryBuilder('payment')
                    .select('SUM(payment.amount)', 'total')
                    .where('payment.buyer_id = :user_id', { user_id })
                    .andWhere('payment.status = :status', { status: Payment_1.PaymentStatus.COMPLETED })
                    .getRawOne();
                const totalReceived = await this.escrowRepository
                    .createQueryBuilder('escrow')
                    .select('SUM(escrow.amount - escrow.fee_amount)', 'total')
                    .where('escrow.seller_id = :user_id', { user_id })
                    .andWhere('escrow.status = :status', { status: Escrow_1.EscrowStatus.RELEASED })
                    .getRawOne();
                const totalWithdrawn = await this.withdrawalRepository
                    .createQueryBuilder('withdrawal')
                    .select('SUM(withdrawal.net_amount)', 'total')
                    .where('withdrawal.user_id = :user_id', { user_id })
                    .andWhere('withdrawal.status = :status', { status: Withdrawal_1.WithdrawalStatus.COMPLETED })
                    .getRawOne();
                const availableBalance = (totalReceived.total || 0) - (totalWithdrawn.total || 0);
                res.json({
                    success: true,
                    data: {
                        total_paid: totalPaid.total || 0,
                        total_received: totalReceived.total || 0,
                        total_withdrawn: totalWithdrawn.total || 0,
                        available_balance: availableBalance,
                        currency: 'USD'
                    }
                });
            }
            catch (error) {
                console.error('Get cash flow dashboard error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to get cash flow dashboard'
                });
            }
        };
    }
}
exports.PaymentController = PaymentController;
