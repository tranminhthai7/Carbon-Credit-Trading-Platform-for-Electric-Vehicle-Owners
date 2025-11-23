import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { DataSource } from "typeorm";
import { setAppDataSource } from "./db";
import { Listing } from "./entities/Listing";
import { Order } from "./entities/Order";
import { Bid } from "./entities/Bid";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3004;

const app = express();
app.use(bodyParser.json());

app.get("/health", (_, res) => res.json({ status: "ok" }));

// Initialize DataSource dynamically
async function initializeApp() {
  try {
    // Use glob patterns for entities so TypeORM discovers metadata whether
    // running from TS (dev) or JS (production/build). This avoids duplicate
    // class definitions when .js artifacts are present.
    const entityPattern = process.env.NODE_ENV === 'production'
      ? __dirname + '/entities/*.js'
      : __dirname + '/entities/*.ts';

    const AppDataSource = new DataSource({
      type: "postgres",
      host: process.env.DB_HOST || process.env.POSTGRES_HOST || "localhost",
      port: Number(process.env.DB_PORT || process.env.POSTGRES_PORT) || 5432,
      username: process.env.DB_USER || process.env.POSTGRES_USER || "admin",
      password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || "secret123",
      database: process.env.DB_NAME || process.env.POSTGRES_NAME || "marketplace_db",
      synchronize: true,
      logging: true,
      entities: [entityPattern],
    });

    await AppDataSource.initialize();
    setAppDataSource(AppDataSource);
    console.log("Marketplace DB connected!");

    // Register routes after DataSource is initialized so controllers/services
    // which depend on AppDataSource can import safely. Import routes dynamically
    // to avoid loading controllers before AppDataSource is set.
    const routesModule = await import("./routes");
    app.use("/", routesModule.default || routesModule);

    app.listen(PORT, () => console.log(`Marketplace Service running on port ${PORT}`));
  } catch (err) {
    console.error("DB init error", err);
  }
}

initializeApp();
