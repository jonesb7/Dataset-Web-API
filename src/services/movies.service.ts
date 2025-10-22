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

export type AdvancedListArgs = {
    page: number;
    limit: number;
    yearStart: number | undefined;
    yearEnd: number | undefined;
    budgetLow: number | undefined;
    budgetHigh: number | undefined;
    revenueLow: number | undefined;
    revenueHigh: number | undefined;
    runtimeLow: number | undefined;
    runtimeHigh: number | undefined;
    genre: string | undefined;
    studio: string | undefined;
    producer: string | undefined;
    director: string | undefined;
    mpaRating: string | undefined;
    collection: string | undefined;
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

export async function listMoviesAdvanced(args: AdvancedListArgs) {
    const {
        page,
        limit,
        yearStart,
        yearEnd,
        budgetLow,
        budgetHigh,
        revenueLow,
        revenueHigh,
        runtimeLow,
        runtimeHigh,
        genre,
        studio,
        producer,
        director,
        mpaRating,
        collection
    } = args;

    const offset = (page - 1) * limit;
    const where: string[] = [];
    const params: any[] = [];

    if (yearStart !== undefined) {
        params.push(yearStart);
        where.push(`LEFT(release_date::text, 4)::int >= $${params.length}`);
    }

    if (yearEnd !== undefined) {
        params.push(yearEnd);
        where.push(`LEFT(release_date::text, 4)::int <= $${params.length}`);
    }

    if (budgetLow !== undefined) {
        params.push(budgetLow);
        where.push(`budget >= $${params.length}`);
    }

    if (budgetHigh !== undefined) {
        params.push(budgetHigh);
        where.push(`budget <= $${params.length}`);
    }

    if (revenueLow !== undefined) {
        params.push(revenueLow);
        where.push(`revenue >= $${params.length}`);
    }

    if (revenueHigh !== undefined) {
        params.push(revenueHigh);
        where.push(`revenue <= $${params.length}`);
    }

    if (runtimeLow !== undefined) {
        params.push(runtimeLow);
        where.push(`runtime >= $${params.length}`);
    }

    if (runtimeHigh !== undefined) {
        params.push(runtimeHigh);
        where.push(`runtime <= $${params.length}`);
    }

    if (genre) {
        params.push(genre);
        where.push(`$${params.length} = ANY(string_to_array(NULLIF(genres, ''), ','))`);
    }

    if (mpaRating) {
        params.push(mpaRating);
        where.push(`mpa_rating = $${params.length}`);
    }

    if (studio) {
        params.push(`%${studio}%`);
        where.push(`EXISTS (
      SELECT 1 FROM movie_studio ms
      JOIN studio s ON s.studio_id = ms.studio_id
      WHERE ms.movie_id = movie.movie_id AND s.name ILIKE $${params.length}
    )`);
    }


    if (producer) {
        params.push(`%${producer}%`);
        where.push(`EXISTS (
      SELECT 1 FROM crew
      WHERE crew.movie_id = movie.movie_id
        AND LOWER(role) = 'producer'
        AND name ILIKE $${params.length}
    )`);
    }

    if (director) {
        params.push(`%${director}%`);
        where.push(`EXISTS (
      SELECT 1 FROM crew
      WHERE crew.movie_id = movie.movie_id
        AND LOWER(role) = 'director'
        AND name ILIKE $${params.length}
    )`);
    }


    if (collection) {
        params.push(`%${collection}%`);
        where.push(`EXISTS (
      SELECT 1 FROM movie_collection mc
      JOIN collection c ON c.collection_id = mc.collection_id
      WHERE mc.movie_id = movie.movie_id AND c.name ILIKE $${params.length}
    )`);
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


