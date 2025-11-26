import { DataSource } from "typeorm";
import { config } from "dotenv";

config();

let entities: any[] = [];

export const AppDataSource = new DataSource({
  type: "postgres",
  // support both POSTGRES_* and DB_* env var names (compose uses DB_* while some tests use POSTGRES_*)
  host: process.env.DB_HOST || process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.DB_PORT || process.env.POSTGRES_PORT) || 5432,
  username: process.env.DB_USER || process.env.POSTGRES_USER || "admin",
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || "secret123",
  database: process.env.DB_NAME || process.env.POSTGRES_NAME || "marketplace_db",
  synchronize: false, // tự động sync DB khi chạy dev
  logging: true,
  entities: entities,
});

// Initialize entities dynamically
export async function initializeDataSource() {
  try {
    const { Listing } = await import("./entities/Listing");
    const { Order } = await import("./entities/Order");
    const { Bid } = await import("./entities/Bid");

    entities = [Listing, Order, Bid];
    AppDataSource.setOptions({
      ...AppDataSource.options,
      entities: entities,
    });

    await AppDataSource.initialize();
  } catch (error) {
    console.error("Error initializing data source:", error);
    throw error;
  }
}
