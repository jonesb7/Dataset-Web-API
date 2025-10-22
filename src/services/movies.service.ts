// src/services/movies.service.ts
import { pool } from '@/db/pool';

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

/* -------------------------------------------------------------------------- */
/*                  Helper: detect available column identifiers               */
/* -------------------------------------------------------------------------- */

let cachedMovieColumns: Set<string> | null = null;

/** Load column names for table public.movie once and cache them. */
async function ensureMovieColumns(): Promise<Set<string>> {
    if (cachedMovieColumns) return cachedMovieColumns;

    const sql = `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'movie'
  `;
    const { rows } = await pool.query(sql);
    cachedMovieColumns = new Set(rows.map(r => String(r.column_name)));

    return cachedMovieColumns!;
}

/**
 * Pick the first existing column from the candidates. Returns
 *   - unquoted identifier (e.g., studios) if snake_case exists
 *   - or a properly quoted identifier (e.g., "Studios") if Title Case exists
 * If none exist, returns undefined (caller must skip the filter).
 */
function pickColumnIdentifier(existing: Set<string>, candidates: string[]): string | undefined {
    for (const c of candidates) {
        // prefer snake_case exact match
        if (existing.has(c)) return c;
    }
    // check Title Case variants (need quoting)
    for (const c of candidates) {
        // If the DB column actually is Title Case, it appears as-is in information_schema
        if (existing.has(c)) return `"${c}"`;
    }
    return undefined;
}

/** Build an EXISTS clause that matches a comma-separated TEXT column by ILIKE. */
function buildCsvMatchClause(
    columnIdent: string,
    paramIndex: number
): string {
    // btrim() trims spaces around each split value before comparing
    return `
    EXISTS (
      SELECT 1
      FROM unnest(string_to_array(NULLIF(${columnIdent}, ''), ',')) AS v(val)
      WHERE btrim(val) ILIKE $${paramIndex}
    )
  `;
}

/* -------------------------------------------------------------------------- */
/*                            Core list / read APIs                           */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                         Advanced, denormalized filters                      */
/* -------------------------------------------------------------------------- */

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

    // Numeric & year filters
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

    // Genre (comma-separated TEXT on movie)
    if (genre) {
        params.push(genre);
        where.push(`$${params.length} = ANY(string_to_array(NULLIF(genres, ''), ','))`);
    }

    // MPA rating
    if (mpaRating) {
        params.push(mpaRating);
        where.push(`mpa_rating = $${params.length}`);
    }

    // --- Dynamic denormalized filters (Studios / Producers / Directors / Collection)
    // Detect available columns once (snake_case or Title Case quoted).
    const cols = await ensureMovieColumns();

    // Studios
    if (studio) {
        // Prefer snake_case 'studios', otherwise Title Case "Studios"
        const colIdent = pickColumnIdentifier(cols, ['studios', 'Studios']);
        if (colIdent) {
            params.push(`%${studio}%`);
            where.push(buildCsvMatchClause(colIdent, params.length));
        }
    }

    // Producers
    if (producer) {
        const colIdent = pickColumnIdentifier(cols, ['producers', 'Producers']);
        if (colIdent) {
            params.push(`%${producer}%`);
            where.push(buildCsvMatchClause(colIdent, params.length));
        }
    }

    // Directors
    if (director) {
        const colIdent = pickColumnIdentifier(cols, ['directors', 'Directors']);
        if (colIdent) {
            params.push(`%${director}%`);
            where.push(buildCsvMatchClause(colIdent, params.length));
        }
    }

    // Collection (single text field, not CSV)
    if (collection) {
        // Prefer snake_case 'collection', otherwise Title Case "Collection"
        const colIdent =
            pickColumnIdentifier(cols, ['collection', 'Collection']);
        if (colIdent) {
            params.push(`%${collection}%`);
            where.push(`${colIdent} ILIKE $${params.length}`);
        }
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

