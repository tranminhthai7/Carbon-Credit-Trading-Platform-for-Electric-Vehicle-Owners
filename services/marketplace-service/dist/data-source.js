"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const Listing_1 = require("./entities/Listing");
const Order_1 = require("./entities/Order");
const Bid_1 = require("./entities/Bid");
(0, dotenv_1.config)();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST || process.env.DB_HOST || "localhost",
    port: Number(process.env.POSTGRES_PORT || process.env.DB_PORT) || 5432,
    username: process.env.POSTGRES_USER || process.env.DB_USER || "admin",
    password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD || "secret123",
    database: process.env.POSTGRES_NAME || process.env.DB_NAME || "marketplace_db",
    synchronize: true, // tự động sync DB khi chạy dev
    logging: false,
    entities: [Listing_1.Listing, Order_1.Order, Bid_1.Bid],
});
