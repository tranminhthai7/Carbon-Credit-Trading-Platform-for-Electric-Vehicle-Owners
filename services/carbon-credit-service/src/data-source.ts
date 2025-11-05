//data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Wallet } from './entities/Wallet';
import { Transaction } from './entities/Transaction';
import dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD || 'secret123',
  database: process.env.POSTGRES_NAME || 'carbon_credit_db',
  synchronize: true, 
  logging: false,
  entities: [Wallet, Transaction],
  subscribers: [],
  migrations: [],
});