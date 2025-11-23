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
    
    // Create tables if not exists
    await createTables(client);
    
    client.release();
  } catch (error) {
    console.error('❌ Database connection error:', error);
    throw error;
  }
};

const createTables = async (client: any): Promise<void> => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL CHECK (role IN ('ev_owner', 'buyer', 'cva', 'admin')),
      full_name VARCHAR(255),
      phone VARCHAR(50),
      kyc_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    
    -- Table to store refresh tokens for session rotation
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash ON refresh_tokens(token_hash);
  `;
  
  await client.query(createUsersTable);
  console.log('✅ Users table created/verified');
};

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;
