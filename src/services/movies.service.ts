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

export async function listMovies({ page, pageSize, year, title, genre }: ListArgs) {
    const offset: number = (page - 1) * pageSize;
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
        params.push(genre);
        where.push(`$${params.length} = ANY(genres)`);
    }

    const sql = `
    SELECT id, title, original_title, release_date, runtime_min, genres
    FROM movies
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY release_date DESC NULLS LAST
    LIMIT $${params.length + 1} OFFSET $${params.length + 2};
  `;

    params.push(pageSize, offset);

    const { rows } = await pool.query(sql, params);
    return rows;
}

export async function getMovie(id: number) {
    const sql = 'SELECT * FROM movies WHERE id = $1';
    const { rows } = await pool.query(sql, [id]);
    return rows[0];
}

export async function stats(by: string) {
    // safe guard: only allow year or genre
    const key = by === 'genre' ? 'genre' : 'year';
    const sql =
        key === 'genre'
            ? `
        SELECT g AS genre, COUNT(*)::int AS count
        FROM movies, unnest(genres) AS g
        GROUP BY g
        ORDER BY count DESC, g ASC
      `
            : `
        SELECT EXTRACT(YEAR FROM release_date)::int AS year, COUNT(*)::int AS count
        FROM movies
        WHERE release_date IS NOT NULL
        GROUP BY year
        ORDER BY year DESC
      `;
    const { rows } = await pool.query(sql);
    return rows;
}

export async function getRandomMovies(limit = 10) {
    const sql = `
        SELECT id, title, original_title, release_date, runtime_min, genres
        FROM movies
        WHERE release_date IS NOT NULL
        ORDER BY RANDOM()
        LIMIT $1;
    `;
    const { rows } = await pool.query(sql, [limit]);
    return rows;
}


