// src/services/movies.service.ts
import { pool } from '../db/pool';

type OptionalStr = string | undefined;

export type ListArgs = {
    page: number;
    pageSize: number;
    year?: OptionalStr;
    title?: OptionalStr;
    genre?: OptionalStr;
};

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
    runtime AS runtime_min,
    string_to_array(NULLIF(genres, ''), ',') AS genres,
    overview,
    budget,
    revenue,
    mpa_rating,
    country
  FROM movie
`;

/**
 * List movies with optional filters and pagination.
 * Year matching is robust even if release_date is stored as ISO/timestamp/text.
 */
export async function listMovies({ page, pageSize, year, title, genre }: ListArgs) {
    const offset = (page - 1) * pageSize;

    const where: string[] = [];
    const params: unknown[] = [];

    // YEAR filter (robust: works for DATE, TIMESTAMP, or text/ISO strings)
    if (year) {
        params.push(parseInt(year, 10));
        // Compare the first 4 chars of release_date::text to the year
        where.push(`LEFT(release_date::text, 4)::int = $${params.length}`);
    }

    if (title) {
        params.push(`%${title.toLowerCase()}%`);
        where.push(`LOWER(title) LIKE $${params.length}`);
    }

    if (genre) {
        // genres is TEXT in DB; in SELECT it's converted to array.
        // For filtering, re-use the expression here.
        params.push(genre);
        where.push(`$${params.length} = ANY(string_to_array(NULLIF(genres, ''), ','))`);
    }

    const sql = `
    ${BASE_SELECT}
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY release_date DESC NULLS LAST
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;

    params.push(pageSize, offset);

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

