import mongoose from "mongoose";
import { Pool } from 'pg';
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/carbon_marketplace";

// PostgreSQL connections for cross-service queries
const userDbPool = new Pool({
  host: process.env.USER_DB_HOST || 'user-db',
  port: parseInt(process.env.USER_DB_PORT || '5432'),
  database: process.env.USER_DB_NAME || 'user_service_db',
  user: process.env.USER_DB_USER || 'admin',
  password: process.env.USER_DB_PASSWORD || 'secret123',
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

const carbonDbPool = new Pool({
  host: process.env.CARBON_DB_HOST || 'carbon-db',
  port: parseInt(process.env.CARBON_DB_PORT || '5432'),
  database: process.env.CARBON_DB_NAME || 'carbon_credit_db',
  user: process.env.CARBON_DB_USER || 'admin',
  password: process.env.CARBON_DB_PASSWORD || 'secret123',
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

const marketplaceDbPool = new Pool({
  host: process.env.MARKETPLACE_DB_HOST || 'marketplace-db',
  port: parseInt(process.env.MARKETPLACE_DB_PORT || '5432'),
  database: process.env.MARKETPLACE_DB_NAME || 'marketplace_db',
  user: process.env.MARKETPLACE_DB_USER || 'admin',
  password: process.env.MARKETPLACE_DB_PASSWORD || 'secret123',
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

const paymentDbPool = new Pool({
  host: process.env.PAYMENT_DB_HOST || 'payment-db',
  port: parseInt(process.env.PAYMENT_DB_PORT || '5432'),
  database: process.env.PAYMENT_DB_NAME || 'payment_db',
  user: process.env.PAYMENT_DB_USER || 'admin',
  password: process.env.PAYMENT_DB_PASSWORD || 'secret123',
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Reporting service connected to MongoDB");

    // Test PostgreSQL connections
    await Promise.all([
      userDbPool.query('SELECT 1'),
      carbonDbPool.query('SELECT 1'),
      marketplaceDbPool.query('SELECT 1'),
      paymentDbPool.query('SELECT 1')
    ]);
    console.log("Reporting service connected to PostgreSQL databases");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};

export { userDbPool, carbonDbPool, marketplaceDbPool, paymentDbPool };
