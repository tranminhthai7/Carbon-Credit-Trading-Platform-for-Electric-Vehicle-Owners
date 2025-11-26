import { DataSource } from 'typeorm';
import { Verification } from '../entities/Verification';
import { KYC } from '../entities/KYC';
import { Certificate } from '../entities/Certificate';
import { envConfig } from './env';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: envConfig.DB_HOST,
    port: envConfig.DB_PORT,
    username: envConfig.DB_USERNAME,
    password: envConfig.DB_PASSWORD,
    database: envConfig.DB_NAME,
    synchronize: false, // Temporarily disabled to prevent schema sync issues
    logging: envConfig.NODE_ENV === 'development',
    entities: [Verification, KYC, Certificate],
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