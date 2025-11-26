import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum CertificateType {
  CARBON_CREDIT = 'carbon_credit',
  KYC_VERIFICATION = 'kyc_verification',
  EMISSION_REDUCTION = 'emission_reduction'
}

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  user_id: string;

  @Column('varchar', { nullable: true })
  verification_id: string;

  @Column({
    type: 'enum',
    enum: CertificateType
  })
  type: CertificateType;

  @Column('varchar', { length: 100, unique: true })
  certificate_number: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  co2_amount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  credits_amount: number;

  @Column('text', { nullable: true })
  description: string;

  @Column('json', { nullable: true })
  metadata: any;

  @Column('varchar', { length: 500, nullable: true })
  certificate_url: string; // URL to PDF certificate

  @Column('varchar')
  issued_by: string; // CVA ID

  @Column('timestamp', { nullable: true })
  issued_at: Date;

  @Column('date', { nullable: true })
  expires_at: Date;
}