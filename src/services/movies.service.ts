// src/services/movies.service.ts
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
        runtime AS runtime_min,
        genres,
        overview,
        budget,
        revenue,
        studios,
        producers,
        directors,
        mpa_rating,
        collection,
        poster_url,
        backdrop_url,
        studio_logos,
        studio_countries,
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
    FROM movie
`;


/**
 * List movies with optional filters and pagination.
 * Year matching is robust even if release_date is stored as ISO/timestamp/text.
 */
export type ListArgs = {
    page: number;
    pageSize: number;
    yearStart?: number | undefined;
    yearEnd?: number | undefined;
    year?: string | undefined;
    title?: string | undefined;
    genre?: string | undefined;
    mpaRating?: string | undefined;
    studios?: string | undefined;
    producers?: string | undefined;
    directors?: string | undefined;
    collection?: string | undefined;
    posterUrl?: string | undefined;
    backdropUrl?: string | undefined;
    studioLogos?: string | undefined;
    studioCountries?: string | undefined;
    actorNames?: string[] | undefined;       // for partial match on any actor names (optional)
    actorCharacters?: string[] | undefined;  // similarly for characters if needed
};

export async function listMovies({
                                     page = 1,
                                     pageSize = 25,
                                     yearStart,
                                     yearEnd,
                                     year,
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

    if (yearStart !== undefined && yearEnd !== undefined) {
        params.push(yearStart, yearEnd);
        where.push(`LEFT(release_date::text, 4)::int BETWEEN $${params.length - 1} AND $${params.length}`);
    } else if (yearStart !== undefined) {
        params.push(yearStart);
        where.push(`LEFT(release_date::text, 4)::int >= $${params.length}`);
    } else if (yearEnd !== undefined) {
        params.push(yearEnd);
        where.push(`LEFT(release_date::text, 4)::int <= $${params.length}`);
    }

    if (year) {
        const y = parseInt(year, 10);
        params.push(y);
        where.push(`LEFT(release_date::text, 4)::int = $${params.length}`);
    }

    if (title) {
        params.push(`%${title.toLowerCase()}%`);
        where.push(`LOWER(title) LIKE $${params.length}`);
    }

    if (genre) {
        params.push(genre);
        where.push(`$${params.length} = ANY(string_to_array(NULLIF(genres, ''), ','))`);
    }

    if (mpaRating) {
        params.push(mpaRating);
        where.push(`mpa_rating = $${params.length}`);
    }

    // For all semicolon-separated string fields we do a case-insensitive LIKE match of the whole text
    if (studios) {
        params.push(`%${studios.toLowerCase()}%`);
        where.push(`LOWER(studios) LIKE $${params.length}`);
    }

    if (producers) {
        params.push(`%${producers.toLowerCase()}%`);
        where.push(`LOWER(producers) LIKE $${params.length}`);
    }

    if (directors) {
        params.push(`%${directors.toLowerCase()}%`);
        where.push(`LOWER(directors) LIKE $${params.length}`);
    }

    if (collection) {
        params.push(`%${collection.toLowerCase()}%`);
        where.push(`LOWER(collection) LIKE $${params.length}`);
    }

    if (posterUrl) {
        params.push(`%${posterUrl.toLowerCase()}%`);
        where.push(`LOWER(poster_url) LIKE $${params.length}`);
    }

    if (backdropUrl) {
        params.push(`%${backdropUrl.toLowerCase()}%`);
        where.push(`LOWER(backdrop_url) LIKE $${params.length}`);
    }

    if (studioLogos) {
        params.push(`%${studioLogos.toLowerCase()}%`);
        where.push(`LOWER(studio_logos) LIKE $${params.length}`);
    }

    if (studioCountries) {
        params.push(`%${studioCountries.toLowerCase()}%`);
        where.push(`LOWER(studio_countries) LIKE $${params.length}`);
    }

    // Optional partial filtering on actor names (matches any of the actors)
    if (actorNames && actorNames.length > 0) {
        actorNames.forEach((name) => {
            params.push(`%${name.toLowerCase()}%`);
            where.push(`(
        LOWER(actor1_name) LIKE $${params.length}
        OR LOWER(actor2_name) LIKE $${params.length}
        OR LOWER(actor3_name) LIKE $${params.length}
        OR LOWER(actor4_name) LIKE $${params.length}
        OR LOWER(actor5_name) LIKE $${params.length}
        OR LOWER(actor6_name) LIKE $${params.length}
        OR LOWER(actor7_name) LIKE $${params.length}
        OR LOWER(actor8_name) LIKE $${params.length}
        OR LOWER(actor9_name) LIKE $${params.length}
        OR LOWER(actor10_name) LIKE $${params.length}
      )`);
        });
    }

    // Similarly, you could add filtering on actorCharacters if needed

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

