import { pool } from '../db/pool';

/**
 * Base projection to normalize the movie row shape for the API.
 * - movie (singular) table
 * - movie_id -> id
 * - runtime  -> runtime_min
 * - genres TEXT (comma separated) -> string[]
 */
const BASE_SELECT = `
    SELECT
        movie_id AS id,
        title,
        original_title,
        release_date,
        runtime,
        string_to_array(NULLIF(genres, ''), '; ') AS genres,
        overview,
        mpa_rating,
        collection,
        budget,
        revenue,
        poster_url,
        backdrop_url,
        string_to_array(NULLIF(producers, ''), '; ') AS producers,
        string_to_array(NULLIF(directors, ''), '; ') AS directors,
        string_to_array(NULLIF(studios, ''), '; ') AS studios,
        string_to_array(NULLIF(studio_logos, ''), '; ') AS studio_logos,
        string_to_array(NULLIF(studio_countries, ''), '; ') AS studio_countries,
        -- create structured actor arrays
        ARRAY[
            json_build_object('name', actor1_name, 'character', actor1_character, 'profile', actor1_profile),
        json_build_object('name', actor2_name, 'character', actor2_character, 'profile', actor2_profile),
        json_build_object('name', actor3_name, 'character', actor3_character, 'profile', actor3_profile),
        json_build_object('name', actor4_name, 'character', actor4_character, 'profile', actor4_profile),
        json_build_object('name', actor5_name, 'character', actor5_character, 'profile', actor5_profile),
        json_build_object('name', actor6_name, 'character', actor6_character, 'profile', actor6_profile),
        json_build_object('name', actor7_name, 'character', actor7_character, 'profile', actor7_profile),
        json_build_object('name', actor8_name, 'character', actor8_character, 'profile', actor8_profile),
        json_build_object('name', actor9_name, 'character', actor9_character, 'profile', actor9_profile),
        json_build_object('name', actor10_name, 'character', actor10_character, 'profile', actor10_profile)
        ] AS actors
    FROM movie_import_raw
`;

/**
 * List movies with optional filters and pagination.
 * Year matching is robust even if release_date is stored as ISO/timestamp/text.
 */
export type ListArgs = {
    page: number;
    pageSize: number;
    yearStart?: number;
    yearEnd?: number;
    year?: string;
    runtimeMin?: number;
    runtimeMax?: number;
    budgetMin?: number;
    budgetMax?: number;
    revenueMin?: number;
    revenueMax?: number;
    // other filters...
    genre?: string;
    mpaRating?: string;
    title?: string;
    studios?: string;
    producers?: string;
    directors?: string;
    collection?: string;
    posterUrl?: string;
    backdropUrl?: string;
    studioLogos?: string;
    studioCountries?: string;
    actorNames?: string[];
    actorCharacters?: string[];
};

export async function listMovies({
                                     page = 1,
                                     pageSize = 25,
                                     yearStart,
                                     yearEnd,
                                     year,
                                     runtimeMin,
                                     runtimeMax,
                                     budgetMin,
                                     budgetMax,
                                     revenueMin,
                                     revenueMax,
                                     title,
                                     genre,
                                     mpaRating,
                                     studios,
                                     producers,
                                     directors,
                                     collection,
                                     posterUrl,
                                     backdropUrl,
                                     studioLogos,
                                     studioCountries,
                                     actorNames
                                 }: ListArgs) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    const where: string[] = [];
    const params: any[] = [];

    // Year filters
    if (yearStart !== undefined && yearEnd !== undefined) {
        params.push(yearStart, yearEnd);
        where.push('release_date IS NOT NULL');
        where.push(`LEFT(release_date::text, 4)::int BETWEEN $${params.length - 1} AND $${params.length}`);
    } else if (yearStart !== undefined) {
        params.push(yearStart);
        where.push('release_date IS NOT NULL');
        where.push(`LEFT(release_date::text, 4)::int >= $${params.length}`);
    } else if (yearEnd !== undefined) {
        params.push(yearEnd);
        where.push('release_date IS NOT NULL');
        where.push(`LEFT(release_date::text, 4)::int <= $${params.length}`);
    }

    // Runtime filters
    if (runtimeMin !== undefined && runtimeMax !== undefined) {
        params.push(runtimeMin, runtimeMax);
        where.push('runtime IS NOT NULL');
        where.push(`runtime BETWEEN $${params.length - 1} AND $${params.length}`);
    } else if (runtimeMin !== undefined) {
        params.push(runtimeMin);
        where.push('runtime IS NOT NULL');
        where.push(`runtime >= $${params.length}`);
    } else if (runtimeMax !== undefined) {
        params.push(runtimeMax);
        where.push('runtime IS NOT NULL');
        where.push(`runtime <= $${params.length}`);
    }

    // Budget filters
    if (budgetMin !== undefined && budgetMax !== undefined) {
        params.push(budgetMin, budgetMax);
        where.push('budget IS NOT NULL AND budget <> 0');
        where.push(`budget BETWEEN $${params.length - 1} AND $${params.length}`);
    } else if (budgetMin !== undefined) {
        params.push(budgetMin);
        where.push('budget IS NOT NULL AND budget <> 0');
        where.push(`budget >= $${params.length}`);
    } else if (budgetMax !== undefined) {
        params.push(budgetMax);
        where.push('budget IS NOT NULL AND budget <> 0');
        where.push(`budget <= $${params.length}`);
    }

    // Revenue filters
    if (revenueMin !== undefined && revenueMax !== undefined) {
        params.push(revenueMin, revenueMax);
        where.push('revenue IS NOT NULL AND revenue <> 0');
        where.push(`revenue BETWEEN $${params.length - 1} AND $${params.length}`);
    } else if (revenueMin !== undefined) {
        params.push(revenueMin);
        where.push('revenue IS NOT NULL AND revenue <> 0');
        where.push(`revenue >= $${params.length}`);
    } else if (revenueMax !== undefined) {
        params.push(revenueMax);
        where.push('revenue IS NOT NULL AND revenue <> 0');
        where.push(`revenue <= $${params.length}`);
    }

    // Other filters (existing in your code)
    if (year) {
        const y = parseInt(year, 10);
        params.push(y);
        where.push('release_date IS NOT NULL');
        where.push(`LEFT(release_date::text, 4)::int = $${params.length}`);
    }

    if (title) {
        params.push(`%${title.toLowerCase()}%`);
        where.push('title IS NOT NULL');
        where.push(`LOWER(title) LIKE $${params.length}`);
    }

    if (genre) {
        params.push(genre);
        where.push('genres IS NOT NULL');
        where.push(`$${params.length} = ANY(string_to_array(NULLIF(genres, ''), '; '))`);
    }

    if (mpaRating) {
        params.push(mpaRating);
        where.push('mpa_rating IS NOT NULL');
        where.push(`mpa_rating = $${params.length}`);
    }

    if (studios) {
        params.push(`%${studios.toLowerCase()}%`);
        where.push('studios IS NOT NULL');
        where.push(`LOWER(studios) LIKE $${params.length}`);
    }

    if (producers) {
        params.push(`%${producers.toLowerCase()}%`);
        where.push('producers IS NOT NULL');
        where.push(`LOWER(producers) LIKE $${params.length}`);
    }

    if (directors) {
        params.push(`%${directors.toLowerCase()}%`);
        where.push('directors IS NOT NULL');
        where.push(`LOWER(directors) LIKE $${params.length}`);
    }

    if (collection) {
        params.push(`%${collection.toLowerCase()}%`);
        where.push('collection IS NOT NULL');
        where.push(`LOWER(collection) LIKE $${params.length}`);
    }

    if (posterUrl) {
        params.push(`%${posterUrl.toLowerCase()}%`);
        where.push('poster_url IS NOT NULL');
        where.push(`LOWER(poster_url) LIKE $${params.length}`);
    }

    if (backdropUrl) {
        params.push(`%${backdropUrl.toLowerCase()}%`);
        where.push('backdrop_url IS NOT NULL');
        where.push(`LOWER(backdrop_url) LIKE $${params.length}`);
    }

    if (studioLogos) {
        params.push(`%${studioLogos.toLowerCase()}%`);
        where.push('studio_logos IS NOT NULL');
        where.push(`LOWER(studio_logos) LIKE $${params.length}`);
    }

    if (studioCountries) {
        params.push(`%${studioCountries.toLowerCase()}%`);
        where.push('studio_countries IS NOT NULL');
        where.push(`LOWER(studio_countries) LIKE $${params.length}`);
    }

    if (actorNames && actorNames.length > 0) {
        actorNames.forEach(name => {
            params.push(`%${name.toLowerCase()}%`);
            where.push(`(
                (actor1_name IS NOT NULL AND LOWER(actor1_name) LIKE $${params.length})
                OR (actor2_name IS NOT NULL AND LOWER(actor2_name) LIKE $${params.length})
                OR (actor3_name IS NOT NULL AND LOWER(actor3_name) LIKE $${params.length})
                OR (actor4_name IS NOT NULL AND LOWER(actor4_name) LIKE $${params.length})
                OR (actor5_name IS NOT NULL AND LOWER(actor5_name) LIKE $${params.length})
                OR (actor6_name IS NOT NULL AND LOWER(actor6_name) LIKE $${params.length})
                OR (actor7_name IS NOT NULL AND LOWER(actor7_name) LIKE $${params.length})
                OR (actor8_name IS NOT NULL AND LOWER(actor8_name) LIKE $${params.length})
                OR (actor9_name IS NOT NULL AND LOWER(actor9_name) LIKE $${params.length})
                OR (actor10_name IS NOT NULL AND LOWER(actor10_name) LIKE $${params.length})
            )`);
        });
    }

    const sql = `
        ${BASE_SELECT}
        ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
        ORDER BY release_date DESC NULLS LAST
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    params.push(limit, offset);

    const { rows } = await pool.query(sql, params);
    return rows;
}

export async function getMovie(id: number) {
    const sql = `
    ${BASE_SELECT}
    WHERE movie_id = $1
  `;
    const { rows } = await pool.query(sql, [id]);
    return rows[0];
}

/**
 Generates summary statistics for movies data grouped by various fields.
 Supports grouping by:
 'genre': Counts number of movies per genre (splitting multi-valued genre strings).
 'year': Counts movies by release year extracted robustly from release_date.
 'mpa_rating': Counts movies by MPA rating category.
 'producers', 'directors', 'studios', 'collection': Counts movies by these multi-valued string fields.
 'runtime', 'budget', 'revenue': Provides numeric aggregate statistics (count, avg, min, max, sum).
 Uses efficient SQL queries with string splitting, unnesting, and aggregation directly in PostgreSQL.
 Throws an error if an unsupported grouping key is requested.
 @param by The variable to group statistics by (e.g., 'genre', 'year', 'mpa_rating', 'directors', etc.).
 @returns An array of grouped statistics (counts or aggregates), or a single aggregate object for numeric fields.
 @throws Error if the provided 'by' parameter is not supported.
  This function enables flexible statistical analysis of the movie dataset for reporting,
  filtering, and analytics in a backend API context.
 */

export async function stats(by: string) {
    const key = by?.toLowerCase();

    if (key === 'genre') {
        // Count movies per genre (multi-value array)
        const sql = `
            SELECT genre, COUNT(*)::int AS count
            FROM (
                SELECT unnest(string_to_array(NULLIF(genres, ''), '; ')) AS genre
                FROM movie
                ) sub
            GROUP BY genre
            ORDER BY count DESC, genre ASC;
        `;
        const { rows } = await pool.query(sql);
        return rows;
    }

    if (key === 'year') {
        // Count movies per release year, extracting year robustly
        const sql = `
            WITH years AS (
                SELECT
                    CASE
                        WHEN LEFT(release_date::text, 4) ~ '^[0-9]{4}$'
                        THEN LEFT(release_date::text, 4)::int
                        ELSE NULL
                    END AS year
                FROM movie
                WHERE release_date IS NOT NULL
            )
            SELECT year, COUNT(*)::int AS count
            FROM years
            WHERE year IS NOT NULL
            GROUP BY year
            ORDER BY year;
        `;
        const { rows } = await pool.query(sql);
        return rows;
    }

    if (key === 'mpa_rating') {
        // Count movies by MPA rating
        const sql = `
            SELECT mpa_rating, COUNT(*)::int AS count
            FROM movie
            WHERE mpa_rating IS NOT NULL AND mpa_rating <> ''
            GROUP BY mpa_rating
            ORDER BY count DESC, mpa_rating ASC;
        `;
        const { rows } = await pool.query(sql);
        return rows;
    }

    // Multi-value string fields: producers, directors, studios, collection
    if (['producers', 'directors', 'studios', 'collection'].includes(key)) {
        const column = key === 'collection' ? 'collection' : key;
        const sql = `
            SELECT value, COUNT(*)::int AS count
            FROM (
                SELECT ${key} 
                FROM movie
                WHERE ${key} IS NOT NULL AND ${key} <> ''
            ) base,
            LATERAL unnest(string_to_array(NULLIF(${key}, ''), '; ')) AS value
            GROUP BY value
            ORDER BY count DESC, value ASC;
        `;
        const { rows } = await pool.query(sql);
        return rows;
    }

    // Numeric statistics for runtime, budget, revenue
    if (['runtime', 'budget', 'revenue'].includes(key)) {
        const column = key;
        const sql = `
            SELECT
                COUNT(*) AS count,
                AVG(${column})::numeric(10,2) AS avg,
                MIN(${column}) AS min,
                MAX(${column}) AS max,
                SUM(${column}) AS sum
            FROM movie
            WHERE ${column} IS NOT NULL AND ${column} > 0;
        `;
        const { rows } = await pool.query(sql);
        return rows[0]; // returns summary stats single object
    }

    // Default fallback - unknown key
    throw new Error(`Unsupported stats key: ${by}. Supported keys: genre, year, mpa_rating, producers, directors, studios, collection, runtime, budget, revenue.`);
}


export async function getRandomMovies(limit = 10) {
    const sql = `
    ${BASE_SELECT}
    WHERE release_date IS NOT NULL
    ORDER BY RANDOM()
    LIMIT $1
  `;
    const { rows } = await pool.query(sql, [limit]);
    return rows;
}

export async function createMovie(movieData: {
    title: string;
    original_title?: string;
    release_date?: string;
    runtime?: number;
    genres?: string;
    overview?: string;
    budget?: number;
    revenue?: number;
    mpa_rating?: string;
    collection?: string;
    poster_url?: string;
    backdrop_url?: string;
    producers?: string;
    directors?: string;
    studios?: string;
    studio_logos?: string;
    studio_countries?: string;

    actor1_name?: string;
    actor1_character?: string;
    actor1_profile?: string;
    actor2_name?: string;
    actor2_character?: string;
    actor2_profile?: string;
    actor3_name?: string;
    actor3_character?: string;
    actor3_profile?: string;
    actor4_name?: string;
    actor4_character?: string;
    actor4_profile?: string;
    actor5_name?: string;
    actor5_character?: string;
    actor5_profile?: string;
    actor6_name?: string;
    actor6_character?: string;
    actor6_profile?: string;
    actor7_name?: string;
    actor7_character?: string;
    actor7_profile?: string;
    actor8_name?: string;
    actor8_character?: string;
    actor8_profile?: string;
    actor9_name?: string;
    actor9_character?: string;
    actor9_profile?: string;
    actor10_name?: string;
    actor10_character?: string;
    actor10_profile?: string;
}) {
    if (!movieData.title || movieData.title.trim() === '') {
        throw new Error('Title is required to create a movie');
    }

    // Normalize genre separators to semicolon
    const normalizedGenres = movieData.genres ? movieData.genres.replace(/,/g, ';') : '';

    // List columns to insert (must match values length)
    const columns = [
        'title', 'original_title', 'release_date', 'runtime', 'genres',
        'overview', 'budget', 'revenue', 'mpa_rating', 'collection',
        'poster_url', 'backdrop_url', 'producers', 'directors', 'studios',
        'studio_logos', 'studio_countries'
    ];

    // Add actor columns dynamically for 10 actors × 3 fields each
    for (let i = 1; i <= 10; i++) {
        columns.push(`actor${i}_name`, `actor${i}_character`, `actor${i}_profile`);
    }

    // Create placeholders like $1, $2, ..., matching columns count
    const placeholders = columns.map((_, idx) => `$${idx + 1}`).join(', ');

    // SQL insert statement ensuring the number of columns equals number of placeholders
    const sql = `
    INSERT INTO movie_import_raw (${columns.join(', ')})
    VALUES (${placeholders})
    RETURNING
      movie_id AS id,
      title,
      original_title,
      release_date,
      runtime,
      string_to_array(NULLIF(genres, ''), '; ') AS genres,
      overview,
      budget,
      revenue,
      mpa_rating,
      collection,
      poster_url,
      backdrop_url,
      string_to_array(NULLIF(producers, ''), '; ') AS producers,
      string_to_array(NULLIF(directors, ''), '; ') AS directors,
      string_to_array(NULLIF(studios, ''), '; ') AS studios,
      string_to_array(NULLIF(studio_logos, ''), '; ') AS studio_logos,
      string_to_array(NULLIF(studio_countries, ''), '; ') AS studio_countries,
      actor1_name,
      actor1_character,
      actor1_profile,
      actor2_name,
      actor2_character,
      actor2_profile,
      actor3_name,
      actor3_character,
      actor3_profile,
      actor4_name,
      actor4_character,
      actor4_profile,
      actor5_name,
      actor5_character,
      actor5_profile,
      actor6_name,
      actor6_character,
      actor6_profile,
      actor7_name,
      actor7_character,
      actor7_profile,
      actor8_name,
      actor8_character,
      actor8_profile,
      actor9_name,
      actor9_character,
      actor9_profile,
      actor10_name,
      actor10_character,
      actor10_profile
  `;

    // Build values array in exact column order
    const values = [
        movieData.title,
        movieData.original_title || movieData.title,
        movieData.release_date || null,
        movieData.runtime ?? null,
        normalizedGenres,
        movieData.overview || '',
        movieData.budget ?? null,
        movieData.revenue ?? null,
        movieData.mpa_rating || '',
        movieData.collection || '',
        movieData.poster_url || '',
        movieData.backdrop_url || '',
        movieData.producers || '',
        movieData.directors || '',
        movieData.studios || '',
        movieData.studio_logos || '',
        movieData.studio_countries || '',
        // Actor fields flattened
        movieData.actor1_name || null,
        movieData.actor1_character || null,
        movieData.actor1_profile || null,
        movieData.actor2_name || null,
        movieData.actor2_character || null,
        movieData.actor2_profile || null,
        movieData.actor3_name || null,
        movieData.actor3_character || null,
        movieData.actor3_profile || null,
        movieData.actor4_name || null,
        movieData.actor4_character || null,
        movieData.actor4_profile || null,
        movieData.actor5_name || null,
        movieData.actor5_character || null,
        movieData.actor5_profile || null,
        movieData.actor6_name || null,
        movieData.actor6_character || null,
        movieData.actor6_profile || null,
        movieData.actor7_name || null,
        movieData.actor7_character || null,
        movieData.actor7_profile || null,
        movieData.actor8_name || null,
        movieData.actor8_character || null,
        movieData.actor8_profile || null,
        movieData.actor9_name || null,
        movieData.actor9_character || null,
        movieData.actor9_profile || null,
        movieData.actor10_name || null,
        movieData.actor10_character || null,
        movieData.actor10_profile || null
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];
}


/**
 * Partially update a movie record (PATCH)
 */
export async function patchMovie(id: number, updates: Partial<{
    title: string;
    original_title: string;
    release_date: string;
    runtime: number;
    genres: string;
    overview: string;
    budget: number;
    revenue: number;
    mpa_rating: string;
    collection: string;
    poster_url: string;
    backdrop_url: string;
    producers: string;
    directors: string;
    studios: string;
    studio_logos: string;
    studio_countries: string;

    actor1_name: string;
    actor1_character: string;
    actor1_profile: string;
    actor2_name: string;
    actor2_character: string;
    actor2_profile: string;
    actor3_name: string;
    actor3_character: string;
    actor3_profile: string;
    actor4_name: string;
    actor4_character: string;
    actor4_profile: string;
    actor5_name: string;
    actor5_character: string;
    actor5_profile: string;
    actor6_name: string;
    actor6_character: string;
    actor6_profile: string;
    actor7_name: string;
    actor7_character: string;
    actor7_profile: string;
    actor8_name: string;
    actor8_character: string;
    actor8_profile: string;
    actor9_name: string;
    actor9_character: string;
    actor9_profile: string;
    actor10_name: string;
    actor10_character: string;
    actor10_profile: string;
}>) {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
            fields.push(`${key} = $${paramIndex}`);
            values.push(value);
            paramIndex++;
        }
    }

    if (fields.length === 0) {
        throw new Error('No fields to update');
    }

    values.push(id);

    const sql = `
        UPDATE movie_import_raw
        SET ${fields.join(', ')}
        WHERE movie_id = $${paramIndex}
            RETURNING
      movie_id AS id,
      title,
      original_title,
      release_date,
      runtime,
      string_to_array(NULLIF(genres, ''), '; ') AS genres,
      overview,
      budget,
      revenue,
      mpa_rating,
      collection,
      poster_url,
      backdrop_url,
      string_to_array(NULLIF(producers, ''), '; ') AS producers,
      string_to_array(NULLIF(directors, ''), '; ') AS directors,
      string_to_array(NULLIF(studios, ''), '; ') AS studios,
      string_to_array(NULLIF(studio_logos, ''), '; ') AS studio_logos,
      string_to_array(NULLIF(studio_countries, ''), '; ') AS studio_countries,
      actor1_name,
      actor1_character,
      actor1_profile,
      actor2_name,
      actor2_character,
      actor2_profile,
      actor3_name,
      actor3_character,
      actor3_profile,
      actor4_name,
      actor4_character,
      actor4_profile,
      actor5_name,
      actor5_character,
      actor5_profile,
      actor6_name,
      actor6_character,
      actor6_profile,
      actor7_name,
      actor7_character,
      actor7_profile,
      actor8_name,
      actor8_character,
      actor8_profile,
      actor9_name,
      actor9_character,
      actor9_profile,
      actor10_name,
      actor10_character,
      actor10_profile
    `;

    const { rows } = await pool.query(sql, values);
    return rows[0];
}



/**
 * Delete a movie from the database
 */
export async function deleteMovieById(id: number): Promise<boolean> {
    // Step 1: Verify the movie exists in the main table
    const checkSql = 'SELECT movie_id FROM movie_import_raw WHERE movie_id = $1';
    const checkResult = await pool.query(checkSql, [id]);

    if (checkResult.rows.length === 0) {
        // No movie with this ID — return false instead of error
        return false;
    }

    // Now delete the movie
    const deleteSql = 'DELETE FROM movie_import_raw WHERE movie_id = $1';
    await pool.query(deleteSql, [id]);

    // Step 4: Confirm success
    return true;
}
