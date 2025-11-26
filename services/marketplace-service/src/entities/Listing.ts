//Listing.ts
console.log("Listing entity loaded", __filename);
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

/**
 * Listing: Một bài đăng bán tín chỉ carbon
 * - userId: người đăng bán
 * - amount: số credits (tons CO2)
 * - pricePerCredit: giá 1 credit (USD)
 * - status: OPEN | SOLD
 */
@Entity()
export class Listing {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;

  @Column("double precision")
  amount!: number;

  @Column("double precision")
  pricePerCredit!: number;

  @Column({ default: "OPEN" })
  status!: "OPEN" | "SOLD";

  @CreateDateColumn()
  created_at!: Date;

  @CreateDateColumn()
  updated_at!: Date;
}
