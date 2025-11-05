import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum KYCStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REQUIRES_ADDITIONAL_INFO = 'requires_additional_info'
}

export enum DocumentType {
  PASSPORT = 'passport',
  DRIVERS_LICENSE = 'drivers_license',
  NATIONAL_ID = 'national_id',
  UTILITY_BILL = 'utility_bill',
  BANK_STATEMENT = 'bank_statement'
}

@Entity('kyc_verifications')
export class KYC {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('varchar', { length: 100 })
  full_name: string;

  @Column('date')
  date_of_birth: Date;

  @Column('varchar', { length: 100 })
  nationality: string;

  @Column('text')
  address: string;

  @Column('varchar', { length: 20 })
  phone_number: string;

  @Column('json')
  documents: {
    type: DocumentType;
    file_url: string;
    uploaded_at: Date;
  }[];

  @Column({
    type: 'enum',
    enum: KYCStatus,
    default: KYCStatus.PENDING
  })
  status: KYCStatus;

  @Column('uuid', { nullable: true })
  reviewer_id: string;

  @Column('text', { nullable: true })
  rejection_reason: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('timestamp', { nullable: true })
  reviewed_at: Date;
}