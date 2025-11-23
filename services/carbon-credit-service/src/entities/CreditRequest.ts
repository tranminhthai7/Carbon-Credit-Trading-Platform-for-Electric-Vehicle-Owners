import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type CreditRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

@Entity('credit_requests')
export class CreditRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column('double precision')
  co2Amount!: number; // kg CO2 saved

  @Column('double precision')
  creditsAmount!: number; // credits requested

  @Column({ nullable: true, unique: true })
  idempotency_key?: string;

  @Column({ default: 'PENDING' })
  status!: CreditRequestStatus;

  @CreateDateColumn()
  created_at!: Date;
}
