"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Payment_1 = require("../entities/Payment");
const Escrow_1 = require("../entities/Escrow");
const Withdrawal_1 = require("../entities/Withdrawal");
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
    entities: [Payment_1.Payment, Escrow_1.Escrow, Withdrawal_1.Withdrawal],
    migrations: ['src/migrations/*.ts'],
    subscribers: ['src/subscribers/*.ts'],
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
