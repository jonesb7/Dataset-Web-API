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
        : { rejectUnauthorized: false }
});

const CREATE_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS movie (
                                         movie_id SERIAL PRIMARY KEY,
                                         title TEXT NOT NULL,
                                         original_title TEXT,
                                         release_date DATE,
                                         runtime INT,
                                         genres TEXT,               -- semicolon separated
                                         overview TEXT,
                                         budget BIGINT,
                                         revenue BIGINT,
                                         studios TEXT,              -- semicolon separated
                                         producers TEXT,            -- semicolon separated
                                         directors TEXT,            -- semicolon separated
                                         mpa_rating TEXT,
                                         collection TEXT,
                                         poster_url TEXT,
                                         backdrop_url TEXT,
                                         studio_logos TEXT,         -- semicolon separated
                                         studio_countries TEXT,     -- semicolon separated
                                         actor1_name TEXT,
                                         actor1_character TEXT,
                                         actor1_profile TEXT,
                                         actor2_name TEXT,
                                         actor2_character TEXT,
                                         actor2_profile TEXT,
                                         actor3_name TEXT,
                                         actor3_character TEXT,
                                         actor3_profile TEXT,
                                         actor4_name TEXT,
                                         actor4_character TEXT,
                                         actor4_profile TEXT,
                                         actor5_name TEXT,
                                         actor5_character TEXT,
                                         actor5_profile TEXT,
                                         actor6_name TEXT,
                                         actor6_character TEXT,
                                         actor6_profile TEXT,
                                         actor7_name TEXT,
                                         actor7_character TEXT,
                                         actor7_profile TEXT,
                                         actor8_name TEXT,
                                         actor8_character TEXT,
                                         actor8_profile TEXT,
                                         actor9_name TEXT,
                                         actor9_character TEXT,
                                         actor9_profile TEXT,
                                         actor10_name TEXT,
                                         actor10_character TEXT,
                                         actor10_profile TEXT
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
    Studios?: string;
    Producers?: string;
    Directors?: string;
    'MPA Rating'?: string;
    Collection?: string;
    'Poster URL'?: string;
    'Backdrop URL'?: string;
    'Studio Logos'?: string;
    'Studio Countries'?: string;
    'Actor 1 Name'?: string;
    'Actor 1 Character'?: string;
    'Actor 1 Profile'?: string;
    'Actor 2 Name'?: string;
    'Actor 2 Character'?: string;
    'Actor 2 Profile'?: string;
    'Actor 3 Name'?: string;
    'Actor 3 Character'?: string;
    'Actor 3 Profile'?: string;
    'Actor 4 Name'?: string;
    'Actor 4 Character'?: string;
    'Actor 4 Profile'?: string;
    'Actor 5 Name'?: string;
    'Actor 5 Character'?: string;
    'Actor 5 Profile'?: string;
    'Actor 6 Name'?: string;
    'Actor 6 Character'?: string;
    'Actor 6 Profile'?: string;
    'Actor 7 Name'?: string;
    'Actor 7 Character'?: string;
    'Actor 7 Profile'?: string;
    'Actor 8 Name'?: string;
    'Actor 8 Character'?: string;
    'Actor 8 Profile'?: string;
    'Actor 9 Name'?: string;
    'Actor 9 Character'?: string;
    'Actor 9 Profile'?: string;
    'Actor 10 Name'?: string;
    'Actor 10 Character'?: string;
    'Actor 10 Profile'?: string;
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
        const base = i * 54;
        placeholders.push(
            `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9}, $${base + 10}, $${base + 11}, $${base + 12}, $${base + 13}, $${base + 14}, $${base + 15}, $${base + 16}, $${base + 17}, $${base + 18}, $${base + 19}, $${base + 20}, $${base + 21}, $${base + 22}, $${base + 23}, $${base + 24}, $${base + 25}, $${base + 26}, $${base + 27}, $${base + 28}, $${base + 29}, $${base + 30}, $${base + 31}, $${base + 32}, $${base + 33}, $${base + 34}, $${base + 35}, $${base + 36}, $${base + 37}, $${base + 38}, $${base + 39}, $${base + 40}, $${base + 41}, $${base + 42}, $${base + 43}, $${base + 44}, $${base + 45}, $${base + 46}, $${base + 47}, $${base + 48}, $${base + 49}, $${base + 50}, $${base + 51}, $${base + 52}, $${base + 53}, $${base + 54})`
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
            r.studios,
            r.producers,
            r.directors,
            r.mpa_rating,
            r.collection,
            r.poster_url,
            r.backdrop_url,
            r.studio_logos,
            r.studio_countries,
            r.actor1_name,
            r.actor1_character,
            r.actor1_profile,
            r.actor2_name,
            r.actor2_character,
            r.actor2_profile,
            r.actor3_name,
            r.actor3_character,
            r.actor3_profile,
            r.actor4_name,
            r.actor4_character,
            r.actor4_profile,
            r.actor5_name,
            r.actor5_character,
            r.actor5_profile,
            r.actor6_name,
            r.actor6_character,
            r.actor6_profile,
            r.actor7_name,
            r.actor7_character,
            r.actor7_profile,
            r.actor8_name,
            r.actor8_character,
            r.actor8_profile,
            r.actor9_name,
            r.actor9_character,
            r.actor9_profile,
            r.actor10_name,
            r.actor10_character,
            r.actor10_profile
        );
    });

    const sql = `
        INSERT INTO movie (
            title, original_title, release_date, runtime, genres, overview, budget, revenue,
            studios, producers, directors, mpa_rating, collection, poster_url, backdrop_url,
            studio_logos, studio_countries,
            actor1_name, actor1_character, actor1_profile,
            actor2_name, actor2_character, actor2_profile,
            actor3_name, actor3_character, actor3_profile,
            actor4_name, actor4_character, actor4_profile,
            actor5_name, actor5_character, actor5_profile,
            actor6_name, actor6_character, actor6_profile,
            actor7_name, actor7_character, actor7_profile,
            actor8_name, actor8_character, actor8_profile,
            actor9_name, actor9_character, actor9_profile,
            actor10_name, actor10_character, actor10_profile
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
                    mapHeaders: ({ header }) => header.replace(/^\uFEFF/, '').trim()
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
                    studios: parseText(row.Studios),
                    producers: parseText(row.Producers),
                    directors: parseText(row.Directors),
                    mpa_rating: parseText(row['MPA Rating']),
                    collection: parseText(row.Collection),
                    poster_url: parseText(row['Poster URL']),
                    backdrop_url: parseText(row['Backdrop URL']),
                    studio_logos: parseText(row['Studio Logos']),
                    studio_countries: parseText(row['Studio Countries']),
                    actor1_name: parseText(row['Actor 1 Name']),
                    actor1_character: parseText(row['Actor 1 Character']),
                    actor1_profile: parseText(row['Actor 1 Profile']),
                    actor2_name: parseText(row['Actor 2 Name']),
                    actor2_character: parseText(row['Actor 2 Character']),
                    actor2_profile: parseText(row['Actor 2 Profile']),
                    actor3_name: parseText(row['Actor 3 Name']),
                    actor3_character: parseText(row['Actor 3 Character']),
                    actor3_profile: parseText(row['Actor 3 Profile']),
                    actor4_name: parseText(row['Actor 4 Name']),
                    actor4_character: parseText(row['Actor 4 Character']),
                    actor4_profile: parseText(row['Actor 4 Profile']),
                    actor5_name: parseText(row['Actor 5 Name']),
                    actor5_character: parseText(row['Actor 5 Character']),
                    actor5_profile: parseText(row['Actor 5 Profile']),
                    actor6_name: parseText(row['Actor 6 Name']),
                    actor6_character: parseText(row['Actor 6 Character']),
                    actor6_profile: parseText(row['Actor 6 Profile']),
                    actor7_name: parseText(row['Actor 7 Name']),
                    actor7_character: parseText(row['Actor 7 Character']),
                    actor7_profile: parseText(row['Actor 7 Profile']),
                    actor8_name: parseText(row['Actor 8 Name']),
                    actor8_character: parseText(row['Actor 8 Character']),
                    actor8_profile: parseText(row['Actor 8 Profile']),
                    actor9_name: parseText(row['Actor 9 Name']),
                    actor9_character: parseText(row['Actor 9 Character']),
                    actor9_profile: parseText(row['Actor 9 Profile']),
                    actor10_name: parseText(row['Actor 10 Name']),
                    actor10_character: parseText(row['Actor 10 Character']),
                    actor10_profile: parseText(row['Actor 10 Profile'])
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
