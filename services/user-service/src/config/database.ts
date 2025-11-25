import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'user_service_db',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'secret123',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const connectDatabase = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    
    // Skip table creation for now
    // await createTables(client);
    
    client.release();
  } catch (error) {
    console.error('❌ Database connection error:', error);
    throw error;
  }
};

const createTables = async (client: any): Promise<void> => {
  // Skip table creation for now - assume tables exist
  console.log('✅ Skipping table creation - assuming tables exist');
};

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;
