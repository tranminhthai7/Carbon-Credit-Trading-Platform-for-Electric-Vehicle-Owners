import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "notifications_db",
  password: process.env.DB_PASS || "123456",
  port: Number(process.env.DB_PORT) || 5432,
});
