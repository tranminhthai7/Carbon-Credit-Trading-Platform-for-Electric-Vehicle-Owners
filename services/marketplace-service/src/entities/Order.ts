import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

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

  // store listing id rather than entity relation to avoid metadata bootstrap
  @Column()
  listingId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
