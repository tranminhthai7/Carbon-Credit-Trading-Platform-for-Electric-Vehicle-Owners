//Wallet.ts
// test
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Transaction } from './Transaction';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  userId!: string;

  // balance in carbon credits (1 credit = 1 ton CO2)
  @Column('double precision', { default: 0 })
  balance!: number;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @OneToMany(() => Transaction, (tx) => tx.fromWallet)
  outgoing!: Transaction[];

  @OneToMany(() => Transaction, (tx) => tx.toWallet)
  incoming!: Transaction[];
}