import dotenv from 'dotenv';

dotenv.config();

export interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  WALLET_SERVICE_URL: string;
  API_SECRET_KEY: string;
}

const getEnvConfig = (): EnvConfig => {
  const requiredEnvVars: string[] = [
    'DB_HOST',
    'DB_USERNAME', 
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
    DB_HOST: process.env.DB_HOST!,
    DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
    DB_USERNAME: process.env.DB_USERNAME!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    DB_NAME: process.env.DB_NAME!,
    WALLET_SERVICE_URL: process.env.WALLET_SERVICE_URL!,
    API_SECRET_KEY: process.env.API_SECRET_KEY!
  };
};

export const envConfig = getEnvConfig();