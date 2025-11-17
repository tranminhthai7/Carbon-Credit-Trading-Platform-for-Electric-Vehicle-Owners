"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.connectDatabase = void 0;
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'user_service_db',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'secret123',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
const connectDatabase = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Connected to PostgreSQL database');
        // Create tables if not exists
        await createTables(client);
        client.release();
    }
    catch (error) {
        console.error('❌ Database connection error:', error);
        throw error;
    }
};
exports.connectDatabase = connectDatabase;
const createTables = async (client) => {
    const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL CHECK (role IN ('ev_owner', 'buyer', 'cva', 'admin')),
      full_name VARCHAR(255),
      email_verified BOOLEAN DEFAULT FALSE,
      phone VARCHAR(50),
      kyc_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  `;
    await client.query(createUsersTable);
    console.log('✅ Users table created/verified');
    // Add email_verified column if missing (migration) - using Postgres 'IF NOT EXISTS'
    const addEmailVerifiedColumn = `
    ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
  `;
    await client.query(addEmailVerifiedColumn);
    console.log('✅ email_verified column ensured');
    const createVerificationTable = `
    CREATE TABLE IF NOT EXISTS email_verifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      token VARCHAR(128) NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      token_hash VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
    await client.query(createVerificationTable);
    console.log('✅ email_verifications & refresh_tokens tables created/verified');
};
const query = (text, params) => {
    return pool.query(text, params);
};
exports.query = query;
exports.default = pool;
//# sourceMappingURL=database.js.map