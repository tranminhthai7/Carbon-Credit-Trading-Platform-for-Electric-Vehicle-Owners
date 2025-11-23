"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Verification_1 = require("../entities/Verification");
const KYC_1 = require("../entities/KYC");
const Certificate_1 = require("../entities/Certificate");
const env_1 = require("./env");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: env_1.envConfig.DB_HOST,
    port: env_1.envConfig.DB_PORT,
    username: env_1.envConfig.DB_USERNAME,
    password: env_1.envConfig.DB_PASSWORD,
    database: env_1.envConfig.DB_NAME,
    synchronize: env_1.envConfig.NODE_ENV !== 'production',
    logging: env_1.envConfig.NODE_ENV === 'development',
    entities: [Verification_1.Verification, KYC_1.KYC, Certificate_1.Certificate],
});
const initializeDatabase = async () => {
    try {
        await exports.AppDataSource.initialize();
        console.log('✅ Database connected successfully');
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};
exports.initializeDatabase = initializeDatabase;
