// src/services/movies.service.ts
import { pool } from '../db/pool';

// helpers for optional string filters
type OptStr = string | undefined;

export type BasicListArgs = {
    page: number;
    pageSize: number;
    year?: OptStr;
    title?: OptStr;
    genre?: OptStr;
};

export type AdvancedListArgs = {
    page: number;
    limit: number;

    // numeric ranges (all optional)
    yearStart?: number | undefined;
    yearEnd?: number | undefined;

    budgetLow?: number | undefined;
    budgetHigh?: number | undefined;

    revenueLow?: number | undefined;
    revenueHigh?: number | undefined;

    runtimeLow?: number | undefined;
    runtimeHigh?: number | undefined;

    // string-ish filters (all optional)
    genre?: string | undefined;
    mpaRating?: string | undefined;
    title?: string | undefined;

    // NEW filters we care about (all optional)
    studio?: string | undefined;
    producer?: string | undefined;
    director?: string | undefined;
    collection?: string | undefined;
};

/**
 * This is the core SELECT we reuse so that every endpoint
 * returns the same shaped movie row.
 *
 * Notes:
 * - runtime in DB is "runtime" (minutes). We alias as runtime_min.
 * - genres in DB is TEXT. We split into array on ',' or ';'.
 * - studio / collection will be joined in outer query if needed.
 */
const BASE_SELECT = `
  SELECT
    m.movie_id AS id,
    m.title,
    m.original_title,
    m.release_date,
    m.runtime      AS runtime_min,
    NULLIF(m.genres, '')                                       AS genres_raw,
    string_to_array(NULLIF(m.genres, ''), ';')                  AS genres_array_semicolon,
    string_to_array(NULLIF(m.genres, ''), ',')                  AS genres_array_comma,
    m.overview,
    m.budget,
    m.revenue,
    m.mpa_rating,
    m.country,
    m.studio_id,
    m.collection_id
  FROM movie m
`;


/**
 * listMovies:
 * - basic list with simple filters (year, title, genre)
 * - used by GET /api/movies (the "simple" search)
 */
export async function listMovies(args: BasicListArgs) {
    const { page, pageSize, year, title, genre } = args;

    const offset = (page - 1) * pageSize;

    const where: string[] = [];
    const params: unknown[] = [];

    // filter: year exact match (using generated column "year" if you added it)
    if (year) {
        params.push(parseInt(year, 10));
        where.push(`m.year = $${params.length}`);
    }

    // filter: title partial match
    if (title) {
        params.push(`%${title.toLowerCase()}%`);
        where.push(`LOWER(m.title) LIKE $${params.length}`);
    }

    // filter: genre included in genres text
    if (genre) {
        params.push(`%${genre.toLowerCase()}%`);
        where.push(`LOWER(m.genres) LIKE $${params.length}`);
    }

    const sql = `
    ${BASE_SELECT}
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY m.release_date DESC NULLS LAST
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;

    params.push(pageSize, offset);

    const { rows } = await pool.query(sql, params);
    return rows.map(normalizeGenresRow);
}


/**
 * listMoviesAdvanced:
 * - this powers GET /api/movies/page
 * - supports numeric ranges, studio, director, producer, collection, etc.
 */
export async function listMoviesAdvanced(filters: AdvancedListArgs) {
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
        mpaRating,
        title,

        studio,
        producer,
        director,
        collection,
    } = filters;

    const offset = (page - 1) * limit;

    const where: string[] = [];
    const params: unknown[] = [];

    // YEAR RANGE: compare left 4 chars of release_date text
    if (yearStart !== undefined) {
        params.push(yearStart);
        where.push(`CAST(LEFT(m.release_date::text, 4) AS INT) >= $${params.length}`);
    }
    if (yearEnd !== undefined) {
        params.push(yearEnd);
        where.push(`CAST(LEFT(m.release_date::text, 4) AS INT) <= $${params.length}`);
    }

    // BUDGET RANGE
    if (budgetLow !== undefined) {
        params.push(budgetLow);
        where.push(`m.budget >= $${params.length}`);
    }
    if (budgetHigh !== undefined) {
        params.push(budgetHigh);
        where.push(`m.budget <= $${params.length}`);
    }

    // REVENUE RANGE
    if (revenueLow !== undefined) {
        params.push(revenueLow);
        where.push(`m.revenue >= $${params.length}`);
    }
    if (revenueHigh !== undefined) {
        params.push(revenueHigh);
        where.push(`m.revenue <= $${params.length}`);
    }

    // RUNTIME RANGE
    if (runtimeLow !== undefined) {
        params.push(runtimeLow);
        where.push(`m.runtime >= $${params.length}`);
    }
    if (runtimeHigh !== undefined) {
        params.push(runtimeHigh);
        where.push(`m.runtime <= $${params.length}`);
    }

    // STRING FILTERS

    if (genre) {
        params.push(`%${genre.toLowerCase()}%`);
        where.push(`LOWER(m.genres) LIKE $${params.length}`);
    }

    if (mpaRating) {
        params.push(mpaRating.toUpperCase());
        where.push(`UPPER(m.mpa_rating) = $${params.length}`);
    }

    if (title) {
        params.push(`%${title.toLowerCase()}%`);
        where.push(`LOWER(m.title) LIKE $${params.length}`);
    }

    // STUDIO FILTER
    if (studio) {
        params.push(`%${studio.toLowerCase()}%`);
        where.push(`
      EXISTS (
        SELECT 1
        FROM studio s
        WHERE s.studio_id = m.studio_id
          AND LOWER(s.name) LIKE $${params.length}
      )
    `);
    }

    // COLLECTION FILTER
    if (collection) {
        params.push(`%${collection.toLowerCase()}%`);
        where.push(`
      EXISTS (
        SELECT 1
        FROM collection c
        WHERE c.collection_id = m.collection_id
          AND LOWER(c.name) LIKE $${params.length}
      )
    `);
    }

    // DIRECTOR FILTER
    if (director) {
        params.push(`%${director.toLowerCase()}%`);
        where.push(`
      EXISTS (
        SELECT 1
        FROM movie_crew mc
        JOIN person p ON p.person_id = mc.person_id
        JOIN role   r ON r.role_id   = mc.role_id
        WHERE mc.movie_id = m.movie_id
          AND LOWER(r.title) = 'director'
          AND LOWER(p.name) LIKE $${params.length}
      )
    `);
    }

    // PRODUCER FILTER
    if (producer) {
        params.push(`%${producer.toLowerCase()}%`);
        where.push(`
      EXISTS (
        SELECT 1
        FROM movie_crew mc
        JOIN person p ON p.person_id = mc.person_id
        JOIN role   r ON r.role_id   = mc.role_id
        WHERE mc.movie_id = m.movie_id
          AND LOWER(r.title) = 'producer'
          AND LOWER(p.name) LIKE $${params.length}
      )
    `);
    }

    const sql = `
    ${BASE_SELECT}
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY m.release_date DESC NULLS LAST
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;

    params.push(limit, offset);

    const { rows } = await pool.query(sql, params);
    return rows.map(normalizeGenresRow);
}


/**
 * getMovie:
 * Return details for one movie_id
 */
export async function getMovie(id: number) {
    const sql = `
    ${BASE_SELECT}
    WHERE m.movie_id = $1
  `;
    const { rows } = await pool.query(sql, [id]);
    return rows[0] ? normalizeGenresRow(rows[0]) : undefined;
}


/**
 * stats:
 * by=genre => count movies per genre tag
 * by=year  => count movies per year from release_date
 */
export async function stats(by: string) {
    if (by === 'genre') {
        const sql = `
      WITH exploded AS (
        SELECT
          TRIM(g) AS genre
        FROM movie m,
        LATERAL unnest(string_to_array(COALESCE(m.genres, ''), ';')) AS g
        WHERE COALESCE(m.genres, '') <> ''
      )
      SELECT genre, COUNT(*)::int AS count
      FROM exploded
      GROUP BY genre
      ORDER BY count DESC, genre ASC
    `;
        const { rows } = await pool.query(sql);
        return rows;
    }

    // default: by year
    const sql = `
    SELECT
      CAST(LEFT(m.release_date::text, 4) AS INT) AS year,
      COUNT(*)::int AS count
    FROM movie m
    WHERE m.release_date IS NOT NULL
    GROUP BY year
    ORDER BY year
  `;
    const { rows } = await pool.query(sql);
    return rows;
}


/**
 * listMoviesByOffset:
 * very simple paging w/ limit+offset, no filters.
 * this is used by /api/movies/page/simple just for smoke tests.
 */
export async function listMoviesByOffset(limit: number, offset: number) {
    const sql = `
    ${BASE_SELECT}
    ORDER BY m.release_date DESC NULLS LAST
    LIMIT $1 OFFSET $2
  `;
    const { rows } = await pool.query(sql, [limit, offset]);
    return rows.map(normalizeGenresRow);
}


// Small helper because genres can be split 2 ways.
// We'll expose genres as an array.
function normalizeGenresRow(row: any) {
    // prefer semicolon split if it produced anything,
    // else fall back to comma split.
    const genres =
        row.genres_array_semicolon && row.genres_array_semicolon.length > 1
            ? row.genres_array_semicolon
            : row.genres_array_comma;

    return {
        ...row,
        genres,
    };
}
