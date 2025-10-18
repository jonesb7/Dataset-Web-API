import { Pool } from 'pg';

const cs: string =
    process.env.NEON_DATABASE_URL ??
    process.env.DATABASE_URL ??
    '';

if (!cs) {
    throw new Error('No database connection string found');
}

const needsSSL: boolean =
    cs !== '' &&
    !cs.includes('localhost') &&
    !cs.includes('127.0.0.1');

export const pool = new Pool({
    connectionString: cs,
    ssl: needsSSL ? { rejectUnauthorized: false } : undefined,
});

