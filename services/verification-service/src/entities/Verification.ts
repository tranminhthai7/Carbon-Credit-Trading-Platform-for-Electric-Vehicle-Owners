import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  UNDER_REVIEW = 'under_review'
}

@Entity('verifications')
export class Verification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  user_id: string;

  @Column('varchar')
  vehicle_id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  co2_amount: number; // kg CO2 saved

  @Column('int')
  trips_count: number;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING
  })
  status: VerificationStatus;

  @Column('varchar', { nullable: true })
  cva_id: string; // CVA reviewer ID

  @Column('text', { nullable: true })
  notes: string;

  @Column('json', { nullable: true })
  emission_data: any; // Raw emission data

  @Column('json', { nullable: true })
  trip_details: any; // Trip details for verification

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  credits_issued: number; // Credits issued after approval

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('timestamp', { nullable: true })
  reviewed_at: Date;
}