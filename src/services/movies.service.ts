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
 * Build the base SELECT so we consistently map your schema:
 * - table: movie (singular)
 * - movie_id -> id
 * - runtime  -> runtime_min
 * - genres TEXT (comma-separated) -> string[] at query time
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

export async function listMovies({ page, pageSize, year, title, genre }: ListArgs) {
    const offset = (page - 1) * pageSize;

    const where: string[] = [];
    const params: unknown[] = [];

    if (year) {
        params.push(parseInt(year, 10));
        where.push(`EXTRACT(YEAR FROM release_date) = $${params.length}`);
    }

    if (title) {
        params.push(`%${title.toLowerCase()}%`);
        where.push(`LOWER(title) LIKE $${params.length}`);
    }

    if (genre) {
        // genres is TEXT in DB; we turned it into an array via string_to_array in SELECT,
        // so we need to test membership using the expression again here.
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

export async function stats(by: string) {
    // Only allow 'year' or 'genre'
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

    const sql = `
    SELECT EXTRACT(YEAR FROM release_date)::int AS year, COUNT(*)::int AS count
    FROM movie
    WHERE release_date IS NOT NULL
    GROUP BY year
    ORDER BY year DESC
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



