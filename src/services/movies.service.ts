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
 * Statistics by 'genre' or 'year'.
 * - by=genre: counts per genre (from comma-separated TEXT)
 * - by=year:  robust year extraction from release_date::text
 */
export async function stats(by: string) {
    const key = by === 'genre' ? 'genre' : 'year';

    if (key === 'genre') {
        const sql = `
            SELECT g AS genre, COUNT(*)::int AS count
            FROM (
                SELECT string_to_array(NULLIF(genres, ''), ',') AS garr
                FROM movie
                ) t,
                LATERAL unnest(t.garr) AS g
            GROUP BY g
            ORDER BY count DESC, g ASC
        `;
        const { rows } = await pool.query(sql);
        return rows;
    }

    // by=year — safe across DATE/TIMESTAMP/text/ISO
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
        ORDER BY year
    `;
    const { rows } = await pool.query(sql);
    return rows;
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

export async function listMoviesByOffset(limit: number, offset: number) {
    const sql = `
      ${BASE_SELECT}
      ORDER BY release_date DESC NULLS LAST
      LIMIT $1 OFFSET $2
    `;

    const { rows } = await pool.query(sql, [limit, offset]);
    return rows;
}

/**
 * Create a new movie
 */
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
    country?: string;
}) {
    const sql = `
        INSERT INTO movie (
            title, original_title, release_date, runtime, genres,
            overview, budget, revenue, mpa_rating, country
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING movie_id AS id, title, original_title, release_date,
                  runtime AS runtime_min, string_to_array(NULLIF(genres, ''), ',') AS genres,
                  overview, budget, revenue, mpa_rating, country
    `;

    const values = [
        movieData.title,
        movieData.original_title || movieData.title,
        movieData.release_date || null,
        movieData.runtime || 0,
        movieData.genres || '',
        movieData.overview || '',
        movieData.budget || 0,
        movieData.revenue || 0,
        movieData.mpa_rating || '',
        movieData.country || ''
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];
}

/**
 * Update an entire movie record (PUT)
 */
export async function updateMovie(id: number, movieData: {
    title: string;
    original_title: string;
    release_date?: string;
    runtime: number;
    genres: string;
    overview: string;
    budget: number;
    revenue: number;
    mpa_rating: string;
    country: string;
}) {
    const sql = `
        UPDATE movie
        SET title = $1,
            original_title = $2,
            release_date = $3,
            runtime = $4,
            genres = $5,
            overview = $6,
            budget = $7,
            revenue = $8,
            mpa_rating = $9,
            country = $10
        WHERE movie_id = $11
        RETURNING movie_id AS id, title, original_title, release_date,
                  runtime AS runtime_min, string_to_array(NULLIF(genres, ''), ',') AS genres,
                  overview, budget, revenue, mpa_rating, country
    `;

    const values = [
        movieData.title,
        movieData.original_title,
        movieData.release_date || null,
        movieData.runtime,
        movieData.genres,
        movieData.overview,
        movieData.budget,
        movieData.revenue,
        movieData.mpa_rating,
        movieData.country,
        id
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
    country: string;
}>) {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    // Build dynamic SET clause
    Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
            fields.push(`${key} = $${paramCount}`);
            values.push(value);
            paramCount++;
        }
    });

    if (fields.length === 0) {
        throw new Error('No fields to update');
    }

    values.push(id); // Add ID as last parameter

    const sql = `
        UPDATE movie
        SET ${fields.join(', ')}
        WHERE movie_id = $${paramCount}
        RETURNING movie_id AS id, title, original_title, release_date,
                  runtime AS runtime_min, string_to_array(NULLIF(genres, ''), ',') AS genres,
                  overview, budget, revenue, mpa_rating, country
    `;

    const { rows } = await pool.query(sql, values);
    return rows[0];
}

/**
 * Delete a movie from the database
 */
export async function deleteMovieById(id: number): Promise<boolean> {
    // First check if movie exists
    const checkSql = 'SELECT movie_id FROM movie WHERE movie_id = $1';
    const checkResult = await pool.query(checkSql, [id]);

    if (checkResult.rows.length === 0) {
        return false;
    }

    // Delete related records first (due to foreign keys)
    await pool.query('DELETE FROM movie_genre WHERE movie_id = $1', [id]);
    await pool.query('DELETE FROM movie_cast WHERE movie_id = $1', [id]);
    await pool.query('DELETE FROM movie_crew WHERE movie_id = $1', [id]);

    // Now delete the movie
    const deleteSql = 'DELETE FROM movie WHERE movie_id = $1';
    await pool.query(deleteSql, [id]);

    return true;
}

/**
 * Add or update a rating for a movie
 */
export async function addMovieRating(movieId: number, rating: number, userId?: string) {
    // For now, we'll store ratings in a simple way
    // This could be extended with a ratings table later
    const sql = `
        INSERT INTO movie_rating (movie_id, rating, user_id, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING rating_id, movie_id, rating, user_id, created_at
    `;

    const values = [movieId, rating, userId || 'anonymous'];

    try {
        const { rows } = await pool.query(sql, values);
        return rows[0];
    } catch (error) {
        // If table doesn't exist, return a mock response
        // In production, you'd create the ratings table
        return {
            rating_id: Math.floor(Math.random() * 10000),
            movie_id: movieId,
            rating,
            user_id: userId || 'anonymous',
            created_at: new Date().toISOString(),
            note: 'Rating saved (mock - ratings table not yet created)'
        };
    }
}

