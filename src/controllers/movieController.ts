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
    mpa_rating: string;
    country: string;
}

const csvPath = path.resolve(__dirname, '../../data/movies_last30years.csv');

export const getMovies = async (_req: Request, res: Response): Promise<void> => {
    try {
        const results: Movie[] = [];

        const stream = fs.createReadStream(csvPath).pipe(csv());

        // row fields can be undefined -> type accordingly and coalesce
        stream.on('data', (row: Record<string, string | undefined>) => {
            // optional: skip rows missing a required field
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
                mpa_rating: row.mpa_rating ?? '',
                country: row.country ?? '',
            };

            results.push(movie);
        });

        stream.on('end', () => {
            res.status(200).json({
                success: true,
                count: results.length,
                data: results.slice(0, 100), // trim for speed
            });
        });

        stream.on('error', (err: Error) => {
            res.status(500).json({
                success: false,
                message: 'Error reading file',
                error: err.message,
            });
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message });
    }
};




