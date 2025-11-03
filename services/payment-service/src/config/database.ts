import { DataSource } from 'typeorm';
import { Payment } from '../entities/Payment';
import { Escrow } from '../entities/Escrow';
import { Withdrawal } from '../entities/Withdrawal';
import { envConfig } from './env';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: envConfig.DB_HOST,
    port: envConfig.DB_PORT,
    username: envConfig.DB_USERNAME,
    password: envConfig.DB_PASSWORD,
    database: envConfig.DB_NAME,
    synchronize: envConfig.NODE_ENV !== 'production',
    logging: envConfig.NODE_ENV === 'development',
    entities: [Payment, Escrow, Withdrawal],
    migrations: ['src/migrations/*.ts'],
    subscribers: ['src/subscribers/*.ts'],
});

export const initializeDatabase = async (): Promise<void> => {
    try {
        await AppDataSource.initialize();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};