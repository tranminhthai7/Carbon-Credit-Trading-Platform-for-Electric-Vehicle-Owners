import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  ESCROWED = 'escrowed', // Ký quỹ
  RELEASED = 'released'  // Đã giải ngân
}

export enum PaymentMethod {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  WALLET = 'wallet'
}

export enum PaymentType {
  PURCHASE = 'purchase',    // Mua tín chỉ
  ESCROW = 'escrow',       // Ký quỹ
  WITHDRAWAL = 'withdrawal', // Rút tiền
  REFUND = 'refund'        // Hoàn tiền
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  buyer_id: string;

  @Column('uuid', { nullable: true })
  seller_id: string; // Người bán tín chỉ

  @Column('uuid', { nullable: true })
  credit_listing_id: string; // ID của listing tín chỉ

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.STRIPE
  })
  payment_method: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentType,
    default: PaymentType.PURCHASE
  })
  payment_type: PaymentType;

  @Column({ nullable: true })
  transaction_id: string;

  @Column({ nullable: true })
  escrow_id: string; // ID của giao dịch ký quỹ

  @Column('text', { nullable: true })
  description: string;

  @Column('json', { nullable: true })
  metadata: any; // Thông tin bổ sung

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}