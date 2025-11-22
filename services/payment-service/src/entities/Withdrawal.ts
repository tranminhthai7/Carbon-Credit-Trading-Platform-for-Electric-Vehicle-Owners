import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum WithdrawalStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum WithdrawalMethod {
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  WALLET = 'wallet'
}

@Entity('withdrawals')
export class Withdrawal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string; // Người rút tiền

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  fee: number; // Phí rút tiền

  @Column('decimal', { precision: 10, scale: 2 })
  net_amount: number; // Số tiền thực nhận

  @Column({
    type: 'enum',
    enum: WithdrawalMethod,
    default: WithdrawalMethod.BANK_TRANSFER
  })
  method: WithdrawalMethod;

  @Column({
    type: 'enum',
    enum: WithdrawalStatus,
    default: WithdrawalStatus.PENDING
  })
  status: WithdrawalStatus;

  @Column('json')
  bank_details: {
    account_number?: string;
    routing_number?: string;
    account_holder_name?: string;
    bank_name?: string;
    paypal_email?: string;
    // Stripe Connect fields (optional)
    stripe_account_id?: string;
    stripe_account?: string;
  };

  @Column({ nullable: true })
  transaction_id: string; // ID từ payment gateway

  @Column('text', { nullable: true })
  failure_reason: string;

  @Column('timestamp', { nullable: true })
  processed_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}