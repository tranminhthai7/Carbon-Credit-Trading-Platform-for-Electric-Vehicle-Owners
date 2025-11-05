//Transaction.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Wallet } from './Wallet';

export type TxType = 'MINT' | 'TRANSFER' | 'BURN';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Wallet, (w) => w.outgoing, { nullable: true })
  fromWallet!: Wallet | null;

  @ManyToOne(() => Wallet, (w) => w.incoming, { nullable: true })
  toWallet!: Wallet | null;

  @Column('double precision')
  amount!: number; // credits (tons)

  @Column()
  type!: TxType;

  @CreateDateColumn()
  createdAt!: Date;
}