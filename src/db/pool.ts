import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // ✅ Loads .env file automatically

// Connection string: prefer NEON_DATABASE_URL, fallback to DATABASE_URL
const connectionString: string =
    process.env.NEON_DATABASE_URL ??
    process.env.DATABASE_URL ??
    '';

if (!connectionString) {
    throw new Error('❌ No database connection string found in environment variables.');
}

// Determine if SSL should be enabled (Render/Neon require it)
const needsSSL: boolean =
    !connectionString.includes('localhost') &&
    !connectionString.includes('127.0.0.1');

// Create the Pool instance
export const pool = new Pool({
    connectionString,
    ssl: needsSSL ? { rejectUnauthorized: false } : undefined,
    max: 10,                    // Max concurrent clients
    idleTimeoutMillis: 30_000,  // Close idle connections after 30s
    connectionTimeoutMillis: 10_000, // Timeout if DB unreachable
});

// Optional: simple connectivity check (runs once on startup)
pool
    .query('SELECT NOW()')
    .then((res) => {
        console.log('✅ PostgreSQL connected:', res.rows[0].now);
    })
    .catch((err) => {
        console.error('❌ PostgreSQL connection failed:', err.message);
    });

