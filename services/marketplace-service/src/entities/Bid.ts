import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("bids")
export class Bid {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  bidderId!: string;

  @Column()
  listingId!: string;

  @Column("double precision")
  amount!: number; // số tiền đấu giá (USD/credit)

  @CreateDateColumn()
  createdAt!: Date;
}
