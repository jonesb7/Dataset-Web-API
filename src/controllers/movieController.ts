import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

interface Movie {
    title: string;
    original_title: string;
    release_date: string;
    runtime: number;
    genres: string;
    overview: string;
    budget: number;
    revenue: number;
    studios: string;
    producers: string;
    directors: string;
    mpa_rating: string;
    collection: string;
    poster_url: string;
    backdrop_url: string;
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
}

const csvPath = path.resolve(__dirname, '../../data/movies_last30years.csv');

const csvHeader =
    'title,original_title,release_date,runtime,genres,overview,budget,revenue,studios,producers,directors,mpa_rating,collection,poster_url,backdrop_url,studio_logos,studio_countries,actor1_name,actor1_character,actor1_profile,actor2_name,actor2_character,actor2_profile,actor3_name,actor3_character,actor3_profile,actor4_name,actor4_character,actor4_profile,actor5_name,actor5_character,actor5_profile,actor6_name,actor6_character,actor6_profile,actor7_name,actor7_character,actor7_profile,actor8_name,actor8_character,actor8_profile,actor9_name,actor9_character,actor9_profile,actor10_name,actor10_character,actor10_profile\n';

/**
 * GET /api/movies
 */
export const getMovies = async (_req: Request, res: Response): Promise<void> => {
    try {
        const results: Movie[] = [];
        const stream = fs.createReadStream(csvPath).pipe(csv());

        stream.on('data', (row: Record<string, string | undefined>) => {
            if (!row.title) return;
            const movie: Movie = {
                title: row.title ?? '',
                original_title: row.original_title ?? '',
                release_date: row.release_date ?? '',
                runtime: Number(row.runtime ?? '0'),
                genres: row.genres ?? '',
                overview: row.overview ?? '',
                budget: Number(row.budget ?? '0'),
                revenue: Number(row.revenue ?? '0'),
                studios: row.studios ?? '',
                producers: row.producers ?? '',
                directors: row.directors ?? '',
                mpa_rating: row.mpa_rating ?? '',
                collection: row.collection ?? '',
                poster_url: row.poster_url ?? '',
                backdrop_url: row.backdrop_url ?? '',
                studio_logos: row.studio_logos ?? '',
                studio_countries: row.studio_countries ?? '',
                actor1_name: row.actor1_name ?? '',
                actor1_character: row.actor1_character ?? '',
                actor1_profile: row.actor1_profile ?? '',
                actor2_name: row.actor2_name ?? '',
                actor2_character: row.actor2_character ?? '',
                actor2_profile: row.actor2_profile ?? '',
                actor3_name: row.actor3_name ?? '',
                actor3_character: row.actor3_character ?? '',
                actor3_profile: row.actor3_profile ?? '',
                actor4_name: row.actor4_name ?? '',
                actor4_character: row.actor4_character ?? '',
                actor4_profile: row.actor4_profile ?? '',
                actor5_name: row.actor5_name ?? '',
                actor5_character: row.actor5_character ?? '',
                actor5_profile: row.actor5_profile ?? '',
                actor6_name: row.actor6_name ?? '',
                actor6_character: row.actor6_character ?? '',
                actor6_profile: row.actor6_profile ?? '',
                actor7_name: row.actor7_name ?? '',
                actor7_character: row.actor7_character ?? '',
                actor7_profile: row.actor7_profile ?? '',
                actor8_name: row.actor8_name ?? '',
                actor8_character: row.actor8_character ?? '',
                actor8_profile: row.actor8_profile ?? '',
                actor9_name: row.actor9_name ?? '',
                actor9_character: row.actor9_character ?? '',
                actor9_profile: row.actor9_profile ?? '',
                actor10_name: row.actor10_name ?? '',
                actor10_character: row.actor10_character ?? '',
                actor10_profile: row.actor10_profile ?? ''
            };
            results.push(movie);
        });

        stream.on('end', () => {
            res.status(200).json({
                success: true,
                count: results.length,
                data: results.slice(0, 100)
            });
        });

        stream.on('error', (err: Error) => {
            res.status(500).json({ success: false, message: err.message });
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message });
    }
};

/**
 * POST /api/movies/insert
 */
export const insertMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        const newMovie: Movie = req.body;

        if (!newMovie.title || newMovie.title.trim() === '') {
            res.status(400).json({ success: false, message: 'Title is required' });
            return;
        }

        const movies: Movie[] = [];
        const reader = fs.createReadStream(csvPath).pipe(csv());

        reader.on('data', (row: Record<string, string | undefined>) => {
            movies.push({
                title: row.title ?? '',
                original_title: row.original_title ?? '',
                release_date: row.release_date ?? '',
                runtime: Number(row.runtime ?? '0'),
                genres: row.genres ?? '',
                overview: row.overview ?? '',
                budget: Number(row.budget ?? '0'),
                revenue: Number(row.revenue ?? '0'),
                studios: row.studios ?? '',
                producers: row.producers ?? '',
                directors: row.directors ?? '',
                mpa_rating: row.mpa_rating ?? '',
                collection: row.collection ?? '',
                poster_url: row.poster_url ?? '',
                backdrop_url: row.backdrop_url ?? '',
                studio_logos: row.studio_logos ?? '',
                studio_countries: row.studio_countries ?? '',
                actor1_name: row.actor1_name ?? '',
                actor1_character: row.actor1_character ?? '',
                actor1_profile: row.actor1_profile ?? '',
                actor2_name: row.actor2_name ?? '',
                actor2_character: row.actor2_character ?? '',
                actor2_profile: row.actor2_profile ?? '',
                actor3_name: row.actor3_name ?? '',
                actor3_character: row.actor3_character ?? '',
                actor3_profile: row.actor3_profile ?? '',
                actor4_name: row.actor4_name ?? '',
                actor4_character: row.actor4_character ?? '',
                actor4_profile: row.actor4_profile ?? '',
                actor5_name: row.actor5_name ?? '',
                actor5_character: row.actor5_character ?? '',
                actor5_profile: row.actor5_profile ?? '',
                actor6_name: row.actor6_name ?? '',
                actor6_character: row.actor6_character ?? '',
                actor6_profile: row.actor6_profile ?? '',
                actor7_name: row.actor7_name ?? '',
                actor7_character: row.actor7_character ?? '',
                actor7_profile: row.actor7_profile ?? '',
                actor8_name: row.actor8_name ?? '',
                actor8_character: row.actor8_character ?? '',
                actor8_profile: row.actor8_profile ?? '',
                actor9_name: row.actor9_name ?? '',
                actor9_character: row.actor9_character ?? '',
                actor9_profile: row.actor9_profile ?? '',
                actor10_name: row.actor10_name ?? '',
                actor10_character: row.actor10_character ?? '',
                actor10_profile: row.actor10_profile ?? ''
            });
        });

        reader.on('end', () => {
            movies.push(newMovie);

            const rows = movies.map((m) => [
                `"${m.title}"`,
                `"${m.original_title}"`,
                m.release_date,
                m.runtime,
                `"${m.genres}"`,
                `"${m.overview}"`,
                m.budget,
                m.revenue,
                `"${m.studios}"`,
                `"${m.producers}"`,
                `"${m.directors}"`,
                `"${m.mpa_rating}"`,
                `"${m.collection}"`,
                `"${m.poster_url}"`,
                `"${m.backdrop_url}"`,
                `"${m.studio_logos}"`,
                `"${m.studio_countries}"`,
                `"${m.actor1_name}"`,
                `"${m.actor1_character}"`,
                `"${m.actor1_profile}"`,
                `"${m.actor2_name}"`,
                `"${m.actor2_character}"`,
                `"${m.actor2_profile}"`,
                `"${m.actor3_name}"`,
                `"${m.actor3_character}"`,
                `"${m.actor3_profile}"`,
                `"${m.actor4_name}"`,
                `"${m.actor4_character}"`,
                `"${m.actor4_profile}"`,
                `"${m.actor5_name}"`,
                `"${m.actor5_character}"`,
                `"${m.actor5_profile}"`,
                `"${m.actor6_name}"`,
                `"${m.actor6_character}"`,
                `"${m.actor6_profile}"`,
                `"${m.actor7_name}"`,
                `"${m.actor7_character}"`,
                `"${m.actor7_profile}"`,
                `"${m.actor8_name}"`,
                `"${m.actor8_character}"`,
                `"${m.actor8_profile}"`,
                `"${m.actor9_name}"`,
                `"${m.actor9_character}"`,
                `"${m.actor9_profile}"`,
                `"${m.actor10_name}"`,
                `"${m.actor10_character}"`,
                `"${m.actor10_profile}"`
            ].join(',')).join('\n');

            fs.writeFile(csvPath, csvHeader + rows, 'utf8', (err) => {
                if (err) {
                    res.status(500).json({ success: false, message: err.message });
                    return;
                }
                res.status(201).json({ success: true, data: newMovie });
            });
        });

        reader.on('error', (err: Error) =>
            res.status(500).json({ success: false, message: err.message })
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message });
    }
};

/**
 * DELETE /api/movies/delete/:id
 */
export const deleteMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ success: false, message: 'Movie title is required' });
            return;
        }
        const titleToDelete = decodeURIComponent(id);
        const movies: Movie[] = [];
        let found = false;

        const reader = fs.createReadStream(csvPath).pipe(csv());
        reader.on('data', (row: Record<string, string | undefined>) => {
            if ((row.title ?? '').toLowerCase() !== titleToDelete.toLowerCase()) {
                const movie: Movie = {
                    title: row.title ?? '',
                    original_title: row.original_title ?? '',
                    release_date: row.release_date ?? '',
                    runtime: Number(row.runtime ?? '0'),
                    genres: row.genres ?? '',
                    overview: row.overview ?? '',
                    budget: Number(row.budget ?? '0'),
                    revenue: Number(row.revenue ?? '0'),
                    studios: row.studios ?? '',
                    producers: row.producers ?? '',
                    directors: row.directors ?? '',
                    mpa_rating: row.mpa_rating ?? '',
                    collection: row.collection ?? '',
                    poster_url: row.poster_url ?? '',
                    backdrop_url: row.backdrop_url ?? '',
                    studio_logos: row.studio_logos ?? '',
                    studio_countries: row.studio_countries ?? '',
                    actor1_name: row.actor1_name ?? '',
                    actor1_character: row.actor1_character ?? '',
                    actor1_profile: row.actor1_profile ?? '',
                    actor2_name: row.actor2_name ?? '',
                    actor2_character: row.actor2_character ?? '',
                    actor2_profile: row.actor2_profile ?? '',
                    actor3_name: row.actor3_name ?? '',
                    actor3_character: row.actor3_character ?? '',
                    actor3_profile: row.actor3_profile ?? '',
                    actor4_name: row.actor4_name ?? '',
                    actor4_character: row.actor4_character ?? '',
                    actor4_profile: row.actor4_profile ?? '',
                    actor5_name: row.actor5_name ?? '',
                    actor5_character: row.actor5_character ?? '',
                    actor5_profile: row.actor5_profile ?? '',
                    actor6_name: row.actor6_name ?? '',
                    actor6_character: row.actor6_character ?? '',
                    actor6_profile: row.actor6_profile ?? '',
                    actor7_name: row.actor7_name ?? '',
                    actor7_character: row.actor7_character ?? '',
                    actor7_profile: row.actor7_profile ?? '',
                    actor8_name: row.actor8_name ?? '',
                    actor8_character: row.actor8_character ?? '',
                    actor8_profile: row.actor8_profile ?? '',
                    actor9_name: row.actor9_name ?? '',
                    actor9_character: row.actor9_character ?? '',
                    actor9_profile: row.actor9_profile ?? '',
                    actor10_name: row.actor10_name ?? '',
                    actor10_character: row.actor10_character ?? '',
                    actor10_profile: row.actor10_profile ?? ''
                };
                movies.push(movie);
            } else {
                found = true;
            }
        });


        reader.on('end', () => {
            if (!found) {
                res.status(404).json({ success: false, message: 'Movie not found' });
                return;
            }

            const rows = movies.map((m) => [
                `"${m.title}"`,
                `"${m.original_title}"`,
                m.release_date,
                m.runtime,
                `"${m.genres}"`,
                `"${m.overview}"`,
                m.budget,
                m.revenue,
                `"${m.studios}"`,
                `"${m.producers}"`,
                `"${m.directors}"`,
                `"${m.mpa_rating}"`,
                `"${m.collection}"`,
                `"${m.poster_url}"`,
                `"${m.backdrop_url}"`,
                `"${m.studio_logos}"`,
                `"${m.studio_countries}"`,
                `"${m.actor1_name}"`,
                `"${m.actor1_character}"`,
                `"${m.actor1_profile}"`,
                `"${m.actor2_name}"`,
                `"${m.actor2_character}"`,
                `"${m.actor2_profile}"`,
                `"${m.actor3_name}"`,
                `"${m.actor3_character}"`,
                `"${m.actor3_profile}"`,
                `"${m.actor4_name}"`,
                `"${m.actor4_character}"`,
                `"${m.actor4_profile}"`,
                `"${m.actor5_name}"`,
                `"${m.actor5_character}"`,
                `"${m.actor5_profile}"`,
                `"${m.actor6_name}"`,
                `"${m.actor6_character}"`,
                `"${m.actor6_profile}"`,
                `"${m.actor7_name}"`,
                `"${m.actor7_character}"`,
                `"${m.actor7_profile}"`,
                `"${m.actor8_name}"`,
                `"${m.actor8_character}"`,
                `"${m.actor8_profile}"`,
                `"${m.actor9_name}"`,
                `"${m.actor9_character}"`,
                `"${m.actor9_profile}"`,
                `"${m.actor10_name}"`,
                `"${m.actor10_character}"`,
                `"${m.actor10_profile}"`
            ].join(',')).join('\n');

            fs.writeFile(csvPath, csvHeader + rows, 'utf8', (err) => {
                if (err) {
                    res.status(500).json({ success: false, message: err.message });
                    return;
                }
                res.status(200).json({ success: true, message: 'Movie deleted', title: titleToDelete });
            });
        });

        reader.on('error', (err: Error) =>
            res.status(500).json({ success: false, message: err.message })
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message });
    }
};
