"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getEnvConfig = () => {
    const requiredEnvVars = [
        'DB_HOST',
        'DB_USER',
        'DB_PASSWORD',
        'DB_NAME',
        'WALLET_SERVICE_URL',
        'API_SECRET_KEY'
    ];
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar}`);
        }
    }
    return {
        PORT: parseInt(process.env.PORT || '3006', 10),
        NODE_ENV: process.env.NODE_ENV || 'development',
        DB_HOST: process.env.DB_HOST,
        DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
        DB_USERNAME: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_NAME: process.env.DB_NAME,
        WALLET_SERVICE_URL: process.env.WALLET_SERVICE_URL,
        API_SECRET_KEY: process.env.API_SECRET_KEY
    };
};
exports.envConfig = getEnvConfig();
