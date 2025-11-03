import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EscrowStatus {
  CREATED = 'created',
  FUNDED = 'funded',      // Đã nạp tiền
  RELEASED = 'released',  // Đã giải ngân cho seller
  REFUNDED = 'refunded',  // Đã hoàn tiền cho buyer
  DISPUTED = 'disputed'   // Tranh chấp
}

@Entity('escrows')
export class Escrow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  buyer_id: string;

  @Column('uuid')
  seller_id: string;

  @Column('uuid')
  credit_listing_id: string;

  @Column('uuid')
  payment_id: string; // Liên kết với Payment

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 5, scale: 2, default: 2.5 })
  fee_percentage: number; // Phí dịch vụ (%)

  @Column('decimal', { precision: 10, scale: 2 })
  fee_amount: number; // Số tiền phí

  @Column({
    type: 'enum',
    enum: EscrowStatus,
    default: EscrowStatus.CREATED
  })
  status: EscrowStatus;

  @Column('text', { nullable: true })
  release_conditions: string; // Điều kiện giải ngân

  @Column('timestamp', { nullable: true })
  released_at: Date;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}