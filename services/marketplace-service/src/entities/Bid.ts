import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Listing } from "./Listing";

@Entity()
export class Bid {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  bidderId!: string;

  @Column("double precision")
  amount!: number; // số tiền đấu giá (USD/credit)

  @ManyToOne(() => Listing, (listing) => listing.bids)
  listing!: Listing;

  @CreateDateColumn()
  createdAt!: Date;
}
