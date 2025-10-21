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
                country: row.country ?? ''
            };

            results.push(movie);
        });

        stream.on('end', () => {
            res.status(200).json({
                success: true,
                count: results.length,
                data: results.slice(0, 100) // trim for speed
            });
        });

        stream.on('error', (err: Error) => {
            res.status(500).json({
                success: false,
                message: 'Error reading file',
                error: err.message
            });
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message });
    }
};

// ============================================
// NEW FUNCTION - Insert Movie
// ============================================
export const insertMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            title,
            original_title,
            release_date,
            runtime,
            genres,
            overview,
            budget,
            revenue,
            mpa_rating,
            country
        } = req.body;

        // Validate required field
        if (!title || title.trim() === '') {
            res.status(400).json({
                success: false,
                message: 'Title is required'
            });
            return;
        }

        // Create new movie object
        const newMovie: Movie = {
            title: title.trim(),
            original_title: original_title || title.trim(),
            release_date: release_date || '',
            runtime: runtime ? Number(runtime) : 0,
            genres: genres || '',
            overview: overview || '',
            budget: budget ? Number(budget) : 0,
            revenue: revenue ? Number(revenue) : 0,
            mpa_rating: mpa_rating || '',
            country: country || ''
        };

        // Read existing CSV data
        const existingMovies: Movie[] = [];
        const readStream = fs.createReadStream(csvPath).pipe(csv());

        readStream.on('data', (row: Record<string, string | undefined>) => {
            if (!row.title) return;
            existingMovies.push({
                title: row.title ?? '',
                original_title: row.original_title ?? '',
                release_date: row.release_date ?? '',
                runtime: Number(row.runtime ?? '0'),
                genres: row.genres ?? '',
                overview: row.overview ?? '',
                budget: Number(row.budget ?? '0'),
                revenue: Number(row.revenue ?? '0'),
                mpa_rating: row.mpa_rating ?? '',
                country: row.country ?? ''
            });
        });

        readStream.on('end', () => {
            // Add new movie to the list
            existingMovies.push(newMovie);

            // Convert to CSV format
            const csvHeader = 'title,original_title,release_date,runtime,genres,overview,budget,revenue,mpa_rating,country\n';
            const csvRows = existingMovies.map(movie => {
                return [
                    `"${movie.title.replace(/"/g, '""')}"`,
                    `"${movie.original_title.replace(/"/g, '""')}"`,
                    movie.release_date,
                    movie.runtime,
                    `"${movie.genres.replace(/"/g, '""')}"`,
                    `"${movie.overview.replace(/"/g, '""')}"`,
                    movie.budget,
                    movie.revenue,
                    movie.mpa_rating,
                    movie.country
                ].join(',');
            }).join('\n');

            const csvContent = csvHeader + csvRows;

            // Write back to CSV file
            fs.writeFile(csvPath, csvContent, 'utf8', (err) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'Error writing to file',
                        error: err.message
                    });
                    return;
                }

                res.status(201).json({
                    success: true,
                    message: 'Movie created successfully',
                    data: newMovie
                });
            });
        });

        readStream.on('error', (err: Error) => {
            res.status(500).json({
                success: false,
                message: 'Error reading file',
                error: err.message
            });
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            message: `Error: ${message}`
        });
    }
};

// ============================================
// NEW FUNCTION - Delete Movie
// ============================================
export const deleteMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                success: false,
                message: 'Movie title is required'
            });
            return;
        }

        const movieTitle = decodeURIComponent(id); // Using title as identifier

        // Read existing CSV data
        const existingMovies: Movie[] = [];
        let movieFound = false;

        const readStream = fs.createReadStream(csvPath).pipe(csv());

        readStream.on('data', (row: Record<string, string | undefined>) => {
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
                country: row.country ?? ''
            };

            // Only keep movies that don't match the title to delete
            if (movie.title.toLowerCase() !== movieTitle.toLowerCase()) {
                existingMovies.push(movie);
            } else {
                movieFound = true;
            }
        });

        readStream.on('end', () => {
            if (!movieFound) {
                res.status(404).json({
                    success: false,
                    message: 'Movie not found'
                });
                return;
            }

            // Convert to CSV format
            const csvHeader = 'title,original_title,release_date,runtime,genres,overview,budget,revenue,mpa_rating,country\n';
            const csvRows = existingMovies.map(movie => {
                return [
                    `"${movie.title.replace(/"/g, '""')}"`,
                    `"${movie.original_title.replace(/"/g, '""')}"`,
                    movie.release_date,
                    movie.runtime,
                    `"${movie.genres.replace(/"/g, '""')}"`,
                    `"${movie.overview.replace(/"/g, '""')}"`,
                    movie.budget,
                    movie.revenue,
                    movie.mpa_rating,
                    movie.country
                ].join(',');
            }).join('\n');

            const csvContent = csvHeader + csvRows;

            // Write back to CSV file
            fs.writeFile(csvPath, csvContent, 'utf8', (err) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'Error writing to file',
                        error: err.message
                    });
                    return;
                }

                res.status(200).json({
                    success: true,
                    message: 'Movie deleted successfully',
                    title: movieTitle
                });
            });
        });

        readStream.on('error', (err: Error) => {
            res.status(500).json({
                success: false,
                message: 'Error reading file',
                error: err.message
            });
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            message: `Error: ${message}`
        });
    }
};




