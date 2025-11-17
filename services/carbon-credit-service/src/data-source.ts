//data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Wallet } from './entities/Wallet';
import { Transaction } from './entities/Transaction';
import dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || process.env.DB_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT || process.env.DB_PORT || 5432),
  username: process.env.POSTGRES_USER || process.env.DB_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD || 'secret123',
  database: process.env.POSTGRES_NAME || process.env.DB_NAME || 'carbon_credit_db',
  synchronize: true, 
  logging: false,
  entities: [Wallet, Transaction],
  subscribers: [],
  migrations: [],
});