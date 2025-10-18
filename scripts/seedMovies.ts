// scripts/seedMovies.ts
import 'dotenv/config';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const connectionString =
    process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL ?? '';

if (!connectionString) {
    console.error('❌ No NEON_DATABASE_URL / DATABASE_URL found.');
    process.exit(1);
}

const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('localhost')
        ? undefined
        : { rejectUnauthorized: false },
});

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS movie (
    movie_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    original_title TEXT,
    release_date DATE,
    runtime INT,
    genres TEXT,
    overview TEXT,
    budget BIGINT,
    revenue BIGINT,
    mpa_rating TEXT,
    country TEXT
  );
`;

type MovieRow = {
    Title?: string;
    'Original Title'?: string;
    'Release Date'?: string;
    Runtime?: string;
    Genres?: string;
    Overview?: string;
    Budget?: string;
    Revenue?: string;
    'MPA Rating'?: string;
    Country?: string;
};

const parseIntSafe = (v?: string) =>
    v && !isNaN(Number(v)) ? parseInt(v, 10) : null;
const parseFloatSafe = (v?: string) =>
    v && !isNaN(Number(v)) ? Number(v) : null;
const parseText = (v?: string) => (v ? v.trim() : null);
const parseDate = (v?: string) =>
    v && v.trim() ? v.replace(/#/g, '') : null;

async function insertBatch(rows: any[]) {
    if (!rows.length) return;

    const placeholders: string[] = [];
    const values: any[] = [];

    rows.forEach((r, i) => {
        const base = i * 10;
        placeholders.push(
            `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9}, $${base + 10})`
        );
        values.push(
            r.title,
            r.original_title,
            r.release_date,
            r.runtime,
            r.genres,
            r.overview,
            r.budget,
            r.revenue,
            r.mpa_rating,
            r.country
        );
    });

    const sql = `
    INSERT INTO movie (
      title, original_title, release_date, runtime, genres, overview, budget, revenue, mpa_rating, country
    )
    VALUES ${placeholders.join(', ')}
  `;

    await pool.query(sql, values);
}

async function main() {
    console.log('🔌 Connecting & ensuring table exists…');
    await pool.query(CREATE_TABLE_SQL);

    const csvPath = path.resolve(process.cwd(), 'data/movies_last30years.csv');
    if (!fs.existsSync(csvPath)) {
        throw new Error(`CSV not found at ${csvPath}`);
    }

    console.log(`📥 Seeding from ${csvPath}`);
    let batch: any[] = [];
    let inserted = 0;
    const BATCH_SIZE = 500;

    await new Promise<void>((resolve, reject) => {
        const rs = fs
            .createReadStream(csvPath)
            .pipe(
                csv({
                    mapHeaders: ({ header }) => header.replace(/^\uFEFF/, '').trim(),
                })
            )
            .on('data', (row: MovieRow) => {
                const movie = {
                    title: parseText(row.Title),
                    original_title: parseText(row['Original Title']),
                    release_date: parseDate(row['Release Date']),
                    runtime: parseIntSafe(row.Runtime),
                    genres: parseText(row.Genres),
                    overview: parseText(row.Overview),
                    budget: parseFloatSafe(row.Budget),
                    revenue: parseFloatSafe(row.Revenue),
                    mpa_rating: parseText(row['MPA Rating']),
                    country: parseText(row.Country),
                };

                if (!movie.title) return; // skip rows with no title
                batch.push(movie);

                if (batch.length >= BATCH_SIZE) {
                    rs.pause();
                    insertBatch(batch)
                        .then(() => {
                            inserted += batch.length;
                            batch = [];
                            rs.resume();
                        })
                        .catch(reject);
                }
            })
            .on('end', async () => {
                if (batch.length) {
                    await insertBatch(batch);
                    inserted += batch.length;
                }
                console.log(`✅ Done. Inserted ${inserted} rows.`);
                resolve();
            })
            .on('error', reject);
    });
}

main()
    .catch((err) => {
        console.error('❌ Seed failed:', err);
        process.exit(1);
    })
    .finally(async () => {
        await pool.end();
    });
