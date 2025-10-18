import { Pool } from 'pg';

const cs = process.env.DATABASE_URL ?? '';

const needsSSL =
    cs !== '' && !cs.includes('localhost') && !cs.includes('127.0.0.1');

export const pool = new Pool({
    connectionString: cs,
    ssl: needsSSL ? { rejectUnauthorized: false } : undefined,
});

