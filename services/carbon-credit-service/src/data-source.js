"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
//data-source.ts
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Wallet_1 = require("./entities/Wallet");
const Transaction_1 = require("./entities/Transaction");
const CreditRequest_1 = require("./entities/CreditRequest");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || process.env.DB_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT || process.env.DB_PORT || 5432),
    username: process.env.POSTGRES_USER || process.env.DB_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD || 'secret123',
    database: process.env.POSTGRES_NAME || process.env.DB_NAME || 'carbon_credit_db',
    synchronize: true,
    logging: false,
    entities: [Wallet_1.Wallet, Transaction_1.Transaction, CreditRequest_1.CreditRequest],
    subscribers: [],
    migrations: [],
});
