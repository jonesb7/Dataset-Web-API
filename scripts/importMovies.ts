// scripts/importMovies.ts

import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { parse } from 'csv-parse';

function clean(v: string | undefined): string | null {
    if (!v) return null;
    const s = v.trim();
    return s === '' ? null : s;
}

function cleanInt(v: string | undefined): number | null {
    if (!v) return null;
    const n = parseInt(v.replace(/[^0-9]/g, ''), 10);
    return Number.isNaN(n) ? null : n;
}

function cleanBigInt(v: string | undefined): number | null {
    if (!v) return null;
    const n = parseInt(v.replace(/[^0-9]/g, ''), 10);
    return Number.isNaN(n) ? null : n;
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_vYmo4ROFMb9p@ep-orange-cherry-afv02hx1-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    // ⚠ replace with your actual Neon pooled connection string, same one you used in movies.service.ts
});

async function importCSV() {
    // point to your CSV in the root of the repo
    const filePath = path.resolve(process.cwd(), 'movies_last30years.csv');

    const fileStream = fs.createReadStream(filePath);

    const parser = parse({
        columns: true,
        skip_empty_lines: true,
    });

    const client = await pool.connect();
    console.log('Connected. Starting import...');

    let batch: any[] = [];
    let total = 0;

    parser.on('readable', async () => {
        let row;
        while ((row = parser.read()) !== null) {
            // Map CSV row -> DB columns 1:1 with your table
            const record = {
                movie_id: clean(row['Movie ID'] || row['movie_id']), // if you had an id column; otherwise drop this
                title: clean(row['Title']),
                original_title: clean(row['Original Title']),
                release_date: clean(row['Release Date']),
                runtime: cleanInt(row['Runtime (min)']),
                genres: clean(row['Genres']),
                overview: clean(row['Overview']),
                budget: cleanBigInt(row['Budget']),
                revenue: cleanBigInt(row['Revenue']),
                studios: clean(row['Studios']),
                producers: clean(row['Producers']),
                directors: clean(row['Directors']),
                mpa_rating: clean(row['MPA Rating']),
                collection: clean(row['Collection']),
                poster_url: clean(row['Poster URL']),
                backdrop_url: clean(row['Backdrop URL']),
                studio_logos: clean(row['Studio Logos']),
                studio_countries: clean(row['Studio Countries']),

                actor1_name: clean(row['Actor 1 Name']),
                actor1_character: clean(row['Actor 1 Character']),
                actor1_profile: clean(row['Actor 1 Profile']),
                actor2_name: clean(row['Actor 2 Name']),
                actor2_character: clean(row['Actor 2 Character']),
                actor2_profile: clean(row['Actor 2 Profile']),
                actor3_name: clean(row['Actor 3 Name']),
                actor3_character: clean(row['Actor 3 Character']),
                actor3_profile: clean(row['Actor 3 Profile']),
                actor4_name: clean(row['Actor 4 Name']),
                actor4_character: clean(row['Actor 4 Character']),
                actor4_profile: clean(row['Actor 4 Profile']),
                actor5_name: clean(row['Actor 5 Name']),
                actor5_character: clean(row['Actor 5 Character']),
                actor5_profile: clean(row['Actor 5 Profile']),
                actor6_name: clean(row['Actor 6 Name']),
                actor6_character: clean(row['Actor 6 Character']),
                actor6_profile: clean(row['Actor 6 Profile']),
                actor7_name: clean(row['Actor 7 Name']),
                actor7_character: clean(row['Actor 7 Character']),
                actor7_profile: clean(row['Actor 7 Profile']),
                actor8_name: clean(row['Actor 8 Name']),
                actor8_character: clean(row['Actor 8 Character']),
                actor8_profile: clean(row['Actor 8 Profile']),
                actor9_name: clean(row['Actor 9 Name']),
                actor9_character: clean(row['Actor 9 Character']),
                actor9_profile: clean(row['Actor 9 Profile']),
                actor10_name: clean(row['Actor 10 Name']),
                actor10_character: clean(row['Actor 10 Character']),
                actor10_profile: clean(row['Actor 10 Profile']),
            };

            batch.push(record);

            if (batch.length >= 500) {
                await insertBatch(client, batch);
                total += batch.length;
                console.log(`Inserted ${total} rows so far...`);
                batch = [];
            }
        }
    });

    parser.on('end', async () => {
        if (batch.length > 0) {
            await insertBatch(client, batch);
            total += batch.length;
        }
        console.log(`✅ Done. Inserted ${total} rows into movie_import_raw.`);
        client.release();
        await pool.end();
    });

    parser.on('error', (err: Error) => {
        console.error('CSV parse error:', err);
    });

    fileStream.pipe(parser);
}

async function insertBatch(client: any, rows: any[]) {
    const cols = [
        'title', 'original_title', 'release_date', 'runtime',
        'genres', 'overview', 'budget', 'revenue',
        'studios', 'producers', 'directors', 'mpa_rating',
        'collection', 'poster_url', 'backdrop_url',
        'studio_logos', 'studio_countries',
        'actor1_name', 'actor1_character', 'actor1_profile',
        'actor2_name', 'actor2_character', 'actor2_profile',
        'actor3_name', 'actor3_character', 'actor3_profile',
        'actor4_name', 'actor4_character', 'actor4_profile',
        'actor5_name', 'actor5_character', 'actor5_profile',
        'actor6_name', 'actor6_character', 'actor6_profile',
        'actor7_name', 'actor7_character', 'actor7_profile',
        'actor8_name', 'actor8_character', 'actor8_profile',
        'actor9_name', 'actor9_character', 'actor9_profile',
        'actor10_name', 'actor10_character', 'actor10_profile'
    ];

    const values: any[] = [];
    const placeholders: string[] = [];

    rows.forEach((row, i) => {
        const baseIndex = i * cols.length;
        placeholders.push(
            '(' +
            cols.map((_, j) => `$${baseIndex + j + 1}`).join(', ') +
            ')'
        );
        cols.forEach((c) => {
            values.push(row[c] ?? null);
        });
    });

    const sql = `
    INSERT INTO movie_import_raw (
      ${cols.join(', ')}
    )
    VALUES
      ${placeholders.join(', ')}
  `;

    await client.query(sql, values);
}

// run it
importCSV().catch(err => {
    console.error('Fatal import error:', err);
    process.exit(1);
});

