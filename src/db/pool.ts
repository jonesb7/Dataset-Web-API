import { Pool } from 'pg';

const cs = process.env.DATABASE_URL;

export const pool = new Pool({
    connectionString: cs,
    // allow SSL for common hosted Postgres (e.g., neon.tech)
    ssl: cs?.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
});

