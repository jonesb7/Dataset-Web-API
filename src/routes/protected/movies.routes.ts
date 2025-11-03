/**
 * Protected Movie Routes
 *
 * Endpoints (mounted under /protected):
 *   POST   /protected/post                 -> createMovie
 *   PATCH  /protected/patchID/:id          -> patchMovie
 *   DELETE /protected/deleteID/:id         -> deleteMovieById
 *   GET    /protected/pages                -> paged listing
 *   GET    /protected/stats                -> stats by key
 *   GET    /protected/movies               -> list all
 *   GET    /protected/random               -> random movies
 *   GET    /protected/getID/:id            -> get movie by id
 */

import { Router, Request, Response } from 'express';
import { param, body, query } from 'express-validator';
import { authMiddleware } from '@middleware/auth';
import {
    createMovie,
    patchMovie,
    deleteMovieById,
    getMoviesPage,
    getMovieStats,
    listMovies,
    getRandomMovies,
    getMovie
} from '@/services/movies.service';
import { handleValidationErrors } from '@middleware/validation';

const r: Router = Router();

// Require API key for everything in this router
r.use(authMiddleware);

/**
 * POST /protected/post
 */
r.post(
    '/post',
    [
        body('title').trim().notEmpty().isLength({ max: 500 }),
        body('original_title').optional().trim().isLength({ max: 500 }),
        body('release_date').optional().isISO8601(),
        body('runtime').optional().isInt({ min: 0, max: 1000 }),
        body('genres').optional().isString(),
        body('overview').optional().isString().isLength({ max: 5000 }),
        body('budget').optional().isInt({ min: 0 }),
        body('revenue').optional().isInt({ min: 0 }),
        body('mpa_rating').optional().isString().isLength({ max: 10 }),
        body('collection').optional().isString(),
        body('poster_url').optional().isString(),
        body('backdrop_url').optional().isString(),
        body('producers').optional().isString(),
        body('directors').optional().isString(),
        body('studios').optional().isString(),
        body('studio_logos').optional().isString(),
        body('studio_countries').optional().isString(),
        body('actor1_name').optional().isString().isLength({ max: 200 }),
        body('actor1_character').optional().isString().isLength({ max: 200 }),
        body('actor1_profile').optional().isString(),
        body('actor2_name').optional().isString().isLength({ max: 200 }),
        body('actor2_character').optional().isString().isLength({ max: 200 }),
        body('actor2_profile').optional().isString(),
        body('actor3_name').optional().isString().isLength({ max: 200 }),
        body('actor3_character').optional().isString().isLength({ max: 200 }),
        body('actor3_profile').optional().isString(),
        body('actor4_name').optional().isString().isLength({ max: 200 }),
        body('actor4_character').optional().isString().isLength({ max: 200 }),
        body('actor4_profile').optional().isString(),
        body('actor5_name').optional().isString().isLength({ max: 200 }),
        body('actor5_character').optional().isString().isLength({ max: 200 }),
        body('actor5_profile').optional().isString(),
        body('actor6_name').optional().isString().isLength({ max: 200 }),
        body('actor6_character').optional().isString().isLength({ max: 200 }),
        body('actor6_profile').optional().isString(),
        body('actor7_name').optional().isString().isLength({ max: 200 }),
        body('actor7_character').optional().isString().isLength({ max: 200 }),
        body('actor7_profile').optional().isString(),
        body('actor8_name').optional().isString().isLength({ max: 200 }),
        body('actor8_character').optional().isString().isLength({ max: 200 }),
        body('actor8_profile').optional().isString(),
        body('actor9_name').optional().isString().isLength({ max: 200 }),
        body('actor9_character').optional().isString().isLength({ max: 200 }),
        body('actor9_profile').optional().isString(),
        body('actor10_name').optional().isString().isLength({ max: 200 }),
        body('actor10_character').optional().isString().isLength({ max: 200 }),
        body('actor10_profile').optional().isString()
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
 * PATCH /protected/patchID/:id
 */
r.patch(
    '/patchID/:id',
    [
        param('id').isInt({ min: 1 }).withMessage('Movie ID must be a positive integer'),
        body('title').optional().trim().notEmpty().isLength({ max: 500 }),
        body('original_title').optional().trim().isLength({ max: 500 }),
        body('release_date').optional().isISO8601(),
        body('runtime').optional().isInt({ min: 0, max: 1000 }),
        body('genres').optional().isString(),
        body('overview').optional().isString().isLength({ max: 5000 }),
        body('budget').optional().isInt({ min: 0 }),
        body('revenue').optional().isInt({ min: 0 }),
        body('mpa_rating').optional().isString().isLength({ max: 10 }),
        body('collection').optional().isString(),
        body('poster_url').optional().isString(),
        body('backdrop_url').optional().isString(),
        body('producers').optional().isString(),
        body('directors').optional().isString(),
        body('studios').optional().isString(),
        body('studio_logos').optional().isString(),
        body('studio_countries').optional().isString(),
        body('actor1_name').optional().isString().isLength({ max: 200 }),
        body('actor1_character').optional().isString().isLength({ max: 200 }),
        body('actor1_profile').optional().isString(),
        body('actor2_name').optional().isString().isLength({ max: 200 }),
        body('actor2_character').optional().isString().isLength({ max: 200 }),
        body('actor2_profile').optional().isString(),
        body('actor3_name').optional().isString().isLength({ max: 200 }),
        body('actor3_character').optional().isString().isLength({ max: 200 }),
        body('actor3_profile').optional().isString(),
        body('actor4_name').optional().isString().isLength({ max: 200 }),
        body('actor4_character').optional().isString().isLength({ max: 200 }),
        body('actor4_profile').optional().isString(),
        body('actor5_name').optional().isString().isLength({ max: 200 }),
        body('actor5_character').optional().isString().isLength({ max: 200 }),
        body('actor5_profile').optional().isString(),
        body('actor6_name').optional().isString().isLength({ max: 200 }),
        body('actor6_character').optional().isString().isLength({ max: 200 }),
        body('actor6_profile').optional().isString(),
        body('actor7_name').optional().isString().isLength({ max: 200 }),
        body('actor7_character').optional().isString().isLength({ max: 200 }),
        body('actor7_profile').optional().isString(),
        body('actor8_name').optional().isString().isLength({ max: 200 }),
        body('actor8_character').optional().isString().isLength({ max: 200 }),
        body('actor8_profile').optional().isString(),
        body('actor9_name').optional().isString().isLength({ max: 200 }),
        body('actor9_character').optional().isString().isLength({ max: 200 }),
        body('actor9_profile').optional().isString(),
        body('actor10_name').optional().isString().isLength({ max: 200 }),
        body('actor10_character').optional().isString().isLength({ max: 200 }),
        body('actor10_profile').optional().isString()
    ],
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
 * DELETE /protected/deleteID/:id
 */
r.delete(
    '/deleteID/:id',
    [param('id').isInt({ min: 1 }).withMessage('Movie ID must be a positive integer')],
    handleValidationErrors,
    async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            const deleted = await deleteMovieById(id);
            if (!deleted) {
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
 * GET /protected/pages  (page, limit, sort, order, q)
 */
r.get(
    '/page',
    [
        query('page').optional().isInt({ min: 1 }),
        query('limit').optional().isInt({ min: 1, max: 100 }),
        query('sort').optional().isString(),
        query('order').optional().isIn(['asc', 'desc']),
        query('q').optional().isString()
    ],
    handleValidationErrors,
    async (req: Request, res: Response) => {
        try {
            const page = req.query.page ? parseInt(String(req.query.page), 10) : undefined;
            const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : undefined;
            const sort = typeof req.query.sort === 'string' ? req.query.sort : undefined;
            const order = typeof req.query.order === 'string' ? (req.query.order as 'asc' | 'desc') : undefined;
            const q = typeof req.query.q === 'string' ? req.query.q : undefined;

            const result = await getMoviesPage({
                ...(page !== undefined ? { page } : {}),
                ...(limit !== undefined ? { limit } : {}),
                ...(sort ? { sort } : {}),
                ...(order ? { order } : {}),
                ...(q ? { q } : {})
            });

            res.json({
                success: true,
                message: 'Movies page fetched successfully',
                data: result,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to fetch movies page: ${message}`,
                code: 'MOVIE_PAGES_ERROR',
                timestamp: new Date().toISOString()
            });
        }
    }
);

/**
 * GET /protected/stats?by=...
 */
r.get(
    '/stats',
    [query('by').exists().isString()],
    handleValidationErrors,
    async (req: Request, res: Response) => {
        try {
            const by = String(req.query.by);
            const data = await getMovieStats(by);
            res.json({
                success: true,
                message: 'Movie stats computed successfully',
                data,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(400).json({
                success: false,
                message: `Failed to compute stats: ${message}`,
                code: 'MOVIE_STATS_ERROR',
                timestamp: new Date().toISOString()
            });
        }
    }
);

/**
 * GET /protected/movies  (list-all; you can later add filters)
 */
r.get('/movies', async (_req: Request, res: Response) => {
    try {
        const items = await listMovies({ page: 1, pageSize: 100 }); // simple default page
        res.json({
            success: true,
            message: 'All movies fetched successfully',
            data: items,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            message: `Failed to fetch movies: ${message}`,
            code: 'MOVIES_LIST_ERROR',
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * GET /protected/random  (?limit=10)
 */
r.get(
    '/random',
    [query('limit').optional().isInt({ min: 1, max: 100 })],
    handleValidationErrors,
    async (req: Request, res: Response) => {
        console.log('Loaded API Key:', process.env.API_KEY);
        try {
            const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;
            const items = await getRandomMovies(limit);
            res.json({
                success: true,
                message: 'Random movies fetched successfully',
                data: items,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to fetch random movies: ${message}`,
                code: 'MOVIES_RANDOM_ERROR',
                timestamp: new Date().toISOString()
            });
        }
    }
);

/**
 * GET /protected/getID/:id
 */
r.get(
    '/getID/:id',
    [param('id').isInt({ min: 1 }).withMessage('Movie ID must be a positive integer')],
    handleValidationErrors,
    async (req: Request<{ id: string }>, res: Response) => {
        try {
            const id = parseInt(req.params.id, 10);
            const movie = await getMovie(id);
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
                message: 'Movie fetched successfully',
                data: movie,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to fetch movie: ${message}`,
                code: 'MOVIE_GET_ERROR',
                timestamp: new Date().toISOString()
            });
        }
    }
);

export default r;
