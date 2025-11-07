import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Listing } from "./Listing";

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  buyerId!: string;

  @Column()
  sellerId!: string;

  @Column("double precision")
  amount!: number; // số credits mua

  @Column("double precision")
  totalPrice!: number; // amount * pricePerCredit

  @Column({ default: "PENDING" })
  status!: "PENDING" | "COMPLETED" | "CANCELLED";

  @ManyToOne(() => Listing)
  listing!: Listing;

  @CreateDateColumn()
  createdAt!: Date;
}
