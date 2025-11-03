import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Payment, PaymentStatus, PaymentMethod, PaymentType } from '../entities/Payment';
import { Escrow, EscrowStatus } from '../entities/Escrow';
import { Withdrawal, WithdrawalStatus, WithdrawalMethod } from '../entities/Withdrawal';
import { envConfig } from '../config/env';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

const stripe = new Stripe(envConfig.STRIPE_SECRET_KEY, {
    apiVersion: '2025-10-29.clover',
});

export class PaymentController {
    private paymentRepository = AppDataSource.getRepository(Payment);
    private escrowRepository = AppDataSource.getRepository(Escrow);
    private withdrawalRepository = AppDataSource.getRepository(Withdrawal);

    createPayment = async (req: Request, res: Response): Promise<void> => {
        try {
            const { buyer_id, amount, payment_method, credit_listing_id } = req.body;

            const payment = new Payment();
            payment.id = uuidv4();
            payment.buyer_id = buyer_id;
            payment.amount = amount;
            payment.payment_method = payment_method || PaymentMethod.STRIPE;
            payment.status = PaymentStatus.PENDING;

            let paymentIntent: Stripe.PaymentIntent | undefined;
            if (payment.payment_method === PaymentMethod.STRIPE) {
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
        } catch (error) {
            console.error('Create payment error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create payment'
            });
        }
    };

    confirmPayment = async (req: Request, res: Response): Promise<void> => {
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

            if (payment.payment_method === PaymentMethod.STRIPE && payment.transaction_id) {
                const paymentIntent = await stripe.paymentIntents.retrieve(payment.transaction_id);
                payment.status = paymentIntent.status === 'succeeded'
                    ? PaymentStatus.COMPLETED
                    : PaymentStatus.FAILED;
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
        } catch (error) {
            console.error('Confirm payment error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to confirm payment'
            });
        }
    };

    getPaymentHistory = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            const { page = '1', limit = '10' } = req.query;

            const pageNum = parseInt(page as string, 10);
            const limitNum = parseInt(limit as string, 10);

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
        } catch (error) {
            console.error('Get payment history error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get payment history'
            });
        }
    };

    createEscrow = async (req: Request, res: Response): Promise<void> => {
        try {
            const { buyer_id, seller_id, credit_listing_id, amount, payment_method } = req.body;

            const payment = new Payment();
            payment.id = uuidv4();
            payment.buyer_id = buyer_id;
            payment.seller_id = seller_id;
            payment.credit_listing_id = credit_listing_id;
            payment.amount = amount;
            payment.payment_method = payment_method || PaymentMethod.STRIPE;
            payment.payment_type = PaymentType.ESCROW;
            payment.status = PaymentStatus.PENDING;

            const escrow = new Escrow();
            escrow.id = uuidv4();
            escrow.buyer_id = buyer_id;
            escrow.seller_id = seller_id;
            escrow.credit_listing_id = credit_listing_id;
            escrow.payment_id = payment.id;
            escrow.amount = amount;
            escrow.fee_percentage = 2.5; // Set default fee percentage
            escrow.fee_amount = (amount * escrow.fee_percentage) / 100;
            escrow.status = EscrowStatus.CREATED;
            let paymentIntent: Stripe.PaymentIntent | undefined;
            if (payment.payment_method === PaymentMethod.STRIPE) {
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
        } catch (error) {
            console.error('Create escrow error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create escrow'
            });
        }
    };

    releaseEscrow = async (req: Request, res: Response): Promise<void> => {
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

            if (escrow.status !== EscrowStatus.FUNDED) {
                res.status(400).json({
                    success: false,
                    message: 'Escrow must be funded before release'
                });
                return;
            }

            escrow.status = EscrowStatus.RELEASED;
            escrow.released_at = new Date();

            const payment = await this.paymentRepository.findOne({
                where: { id: escrow.payment_id }
            });

            if (payment) {
                payment.status = PaymentStatus.RELEASED;
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
        } catch (error) {
            console.error('Release escrow error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to release escrow'
            });
        }
    };

    createWithdrawal = async (req: Request, res: Response): Promise<void> => {
        try {
            const { user_id, amount, method, bank_details } = req.body;

            const feeRate = method === WithdrawalMethod.BANK_TRANSFER ? 0.02 : 0.03;
            const fee = amount * feeRate;
            const netAmount = amount - fee;

            const withdrawal = new Withdrawal();
            withdrawal.id = uuidv4();
            withdrawal.user_id = user_id;
            withdrawal.amount = amount;
            withdrawal.fee = fee;
            withdrawal.net_amount = netAmount;
            withdrawal.method = method;
            withdrawal.bank_details = bank_details;
            withdrawal.status = WithdrawalStatus.PENDING;

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
        } catch (error) {
            console.error('Create withdrawal error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create withdrawal'
            });
        }
    };

    processWithdrawal = async (req: Request, res: Response): Promise<void> => {
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

            withdrawal.status = WithdrawalStatus.PROCESSING;
            withdrawal.processed_at = new Date();

            if (withdrawal.method === WithdrawalMethod.STRIPE) {
                // Stripe Connect integration for payouts
                // Implementation depends on Stripe Connect setup
            }

            withdrawal.status = WithdrawalStatus.COMPLETED;
            await this.withdrawalRepository.save(withdrawal);

            res.json({
                success: true,
                data: {
                    withdrawal_id: withdrawal.id,
                    status: withdrawal.status,
                    processed_at: withdrawal.processed_at
                }
            });
        } catch (error) {
            console.error('Process withdrawal error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to process withdrawal'
            });
        }
    };

    getCashFlowDashboard = async (req: Request, res: Response): Promise<void> => {
        try {
            const { user_id } = req.params;

            const totalPaid = await this.paymentRepository
                .createQueryBuilder('payment')
                .select('SUM(payment.amount)', 'total')
                .where('payment.buyer_id = :user_id', { user_id })
                .andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED })
                .getRawOne();

            const totalReceived = await this.escrowRepository
                .createQueryBuilder('escrow')
                .select('SUM(escrow.amount - escrow.fee_amount)', 'total')
                .where('escrow.seller_id = :user_id', { user_id })
                .andWhere('escrow.status = :status', { status: EscrowStatus.RELEASED })
                .getRawOne();

            const totalWithdrawn = await this.withdrawalRepository
                .createQueryBuilder('withdrawal')
                .select('SUM(withdrawal.net_amount)', 'total')
                .where('withdrawal.user_id = :user_id', { user_id })
                .andWhere('withdrawal.status = :status', { status: WithdrawalStatus.COMPLETED })
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
        } catch (error) {
            console.error('Get cash flow dashboard error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get cash flow dashboard'
            });
        }
    };
}