import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "dotenv";
import { Listing } from "./entities/Listing";
import { Order } from "./entities/Order";
import { Bid } from "./entities/Bid";

config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || "admin",
  password: process.env.POSTGRES_PASSWORD || "secret123",
  database: process.env.POSTGRES_NAME || "marketplace_db",
  synchronize: true, // tự động sync DB khi chạy dev
  logging: false,
  entities: [Listing, Order, Bid],
});
