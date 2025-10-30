/**
 * Protected Movie Routes (WRITE operations)
 * -----------------------------------------
 * Handles all authenticated movie modification endpoints under `/protected`.
 *
 * These routes require a valid API key (via `authMiddleware`) and provide:
 *  - POST   /protected/movies
 *  - PUT    /protected/movies/:id
 *  - PATCH  /protected/movies/:id
 *  - DELETE /protected/movies/:id
 *  - POST   /protected/movies/:id/rating
 *
 */

import { Router, Request, Response } from 'express';
import { param, body } from 'express-validator';
import { authMiddleware } from '@middleware/auth';
import {
    createMovie,
    updateMovie,
    patchMovie,
    deleteMovieById,
    addMovieRating,
    getMovie
} from '../../services/movies.service';
import { handleValidationErrors } from '@middleware/validation';

const r: Router = Router();

// Require API key for all protected routes
r.use(authMiddleware);

/**
 * POST /protected/movies
 * Create a new movie
 */
r.post(
    '/movies',
    [
        body('title').trim().notEmpty().isLength({ min: 1, max: 500 }),
        body('original_title').optional().trim().isLength({ max: 500 }),
        body('release_date').optional().isISO8601(),
        body('runtime').optional().isInt({ min: 0, max: 1000 }),
        body('genres').optional().isString(),
        body('overview').optional().isString().isLength({ max: 5000 }),
        body('budget').optional().isInt({ min: 0 }),
        body('revenue').optional().isInt({ min: 0 }),
        body('mpa_rating').optional().isString().isLength({ max: 10 }),
        body('country').optional().isString().isLength({ max: 100 })
    ],
    handleValidationErrors,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const movie = await createMovie(req.body);
            res.status(201).json({
                success: true,
                message: 'Movie created successfully',
                data: movie,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to create movie: ${message}`,
                code: 'MOVIE_CREATE_ERROR',
                timestamp: new Date().toISOString()
            });
        }
    }
);

/**
 * PUT /protected/movies/:id
 */
r.put(
    '/movies/:id',
    [
        param('id').isInt({ min: 1 }),
        body('title').trim().notEmpty().isLength({ min: 1, max: 500 }),
        body('original_title').trim().notEmpty().isLength({ max: 500 }),
        body('release_date').optional().isISO8601(),
        body('runtime').isInt({ min: 0, max: 1000 }),
        body('genres').isString(),
        body('overview').isString().isLength({ max: 5000 }),
        body('budget').isInt({ min: 0 }),
        body('revenue').isInt({ min: 0 }),
        body('mpa_rating').isString().isLength({ max: 10 }),
        body('country').isString().isLength({ max: 100 })
    ],
    handleValidationErrors,
    async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            const movie = await updateMovie(id, req.body);

            if (!movie) {
                res.status(404).json({
                    success: false,
                    message: `Movie with ID ${id} not found`,
                    code: 'MOVIE_NOT_FOUND',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            res.json({
                success: true,
                message: 'Movie updated successfully',
                data: movie,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to update movie: ${message}`,
                code: 'MOVIE_UPDATE_ERROR',
                timestamp: new Date().toISOString()
            });
        }
    }
);

/**
 * PATCH /protected/movies/:id
 */
r.patch(
    '/movies/:id',
    [param('id').isInt({ min: 1 })],
    handleValidationErrors,
    async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);

            if (Object.keys(req.body).length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'At least one field must be provided for update',
                    code: 'NO_FIELDS_PROVIDED',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            const movie = await patchMovie(id, req.body);
            if (!movie) {
                res.status(404).json({
                    success: false,
                    message: `Movie with ID ${id} not found`,
                    code: 'MOVIE_NOT_FOUND',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            res.json({
                success: true,
                message: 'Movie partially updated successfully',
                data: movie,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to update movie: ${message}`,
                code: 'MOVIE_PATCH_ERROR',
                timestamp: new Date().toISOString()
            });
        }
    }
);

/**
 * DELETE /protected/movies/:id
 */
r.delete(
    '/movies/:id',
    [param('id').isInt({ min: 1 })],
    handleValidationErrors,
    async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            const ok = await deleteMovieById(id);

            if (!ok) {
                res.status(404).json({
                    success: false,
                    message: `Movie with ID ${id} not found`,
                    code: 'MOVIE_NOT_FOUND',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            res.json({
                success: true,
                message: `Movie with ID ${id} deleted successfully`,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to delete movie: ${message}`,
                code: 'MOVIE_DELETE_ERROR',
                timestamp: new Date().toISOString()
            });
        }
    }
);

/**
 * POST /protected/movies/:id/rating
 */
r.post(
    '/movies/:id/rating',
    [
        param('id').isInt({ min: 1 }),
        body('rating').isFloat({ min: 0, max: 10 }),
        body('userId').optional().isString().isLength({ max: 100 })
    ],
    handleValidationErrors,
    async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
            const movieId = parseInt(req.params.id, 10);
            const { rating, userId } = req.body;

            const movie = await getMovie(movieId);
            if (!movie) {
                res.status(404).json({
                    success: false,
                    message: `Movie with ID ${movieId} not found`,
                    code: 'MOVIE_NOT_FOUND',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            const saved = await addMovieRating(movieId, parseFloat(String(rating)), userId);
            res.status(201).json({
                success: true,
                message: 'Rating added successfully',
                data: saved,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to add rating: ${message}`,
                code: 'MOVIE_RATING_ERROR',
                timestamp: new Date().toISOString()
            });
        }
    }
);

export default r;
