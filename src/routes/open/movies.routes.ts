import { Router, Request, Response } from 'express';
import { query, param, body } from 'express-validator';
import {
    getRandomMovies,
    listMovies,
    getMovie,
    stats,
    ListArgs,
    // listMoviesByOffset,
    createMovie,
    updateMovie,
    patchMovie,
    deleteMovieById,
    addMovieRating
} from '../../services/movies.service';

import { insertMovie, deleteMovie } from '../../controllers/movieController';
import { handleValidationErrors } from '@middleware/validation';

const r: Router = Router();

// TODO: should be pagination with no filters
// GET /api/movies
r.get('/', async (req: Request, res: Response): Promise<void> => {
    const page = Math.max(1, Number.parseInt(String(req.query.page ?? '1'), 10));
    const pageSize = Math.min(100, Math.max(1, Number.parseInt(String(req.query.pageSize ?? '25'), 10)));

    // Call listMovies with only pagination parameters, no filters
    const args: Pick<ListArgs, 'page' | 'pageSize'> = { page, pageSize };

    try {
        const result = await listMovies(args);
        res.json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message });
    }
});


const allowedStatsKeys = [
    'genre', 'year', 'mpa_rating', 'producers', 'directors',
    'studios', 'collection', 'runtime', 'budget', 'revenue'
];

r.get('/stats',
    [
        query('by')
            .optional()
            .isIn(allowedStatsKeys)
            .withMessage(`by parameter must be one of: ${allowedStatsKeys.join(', ')}`)
    ],
    handleValidationErrors,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const by = String(req.query.by ?? 'year').toLowerCase();
            const result = await stats(by);

            const isNumericStat = ['runtime', 'budget', 'revenue'].includes(by);

            res.json({
                success: true,
                groupedBy: by,
                data: result,
                ...(isNumericStat ? {} : { count: Array.isArray(result) ? result.length : 1 }),
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(400).json({ success: false, message });
        }
    }
);


// GET /api/movies/page (multi-filter + pagination)
r.get('/page', async (req: Request, res: Response): Promise<void> => {
    const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10));
    const limit = Math.max(1, Math.min(100, parseInt(String(req.query.limit ?? '25'), 10)));

    // Numeric filters
    const yearStart = req.query.yearStart ? parseInt(String(req.query.yearStart), 10) : undefined;
    const yearEnd = req.query.yearEnd ? parseInt(String(req.query.yearEnd), 10) : undefined;
    const runtimeMin = req.query.runtimeMin ? parseInt(String(req.query.runtimeMin), 10) : undefined;
    const runtimeMax = req.query.runtimeMax ? parseInt(String(req.query.runtimeMax), 10) : undefined;

    // Budget and revenue filters
    const budgetMin = req.query.budgetMin ? parseInt(String(req.query.budgetMin), 10) : undefined;
    const budgetMax = req.query.budgetMax ? parseInt(String(req.query.budgetMax), 10) : undefined;
    const revenueMin = req.query.revenueMin ? parseInt(String(req.query.revenueMin), 10) : undefined;
    const revenueMax = req.query.revenueMax ? parseInt(String(req.query.revenueMax), 10) : undefined;

    // Other filters
    const year = req.query.year as string | undefined;
    const genre = req.query.genre as string | undefined;
    const mpaRating = req.query.mpaRating as string | undefined;
    const title = req.query.title as string | undefined;
    const studios = req.query.studios as string | undefined;
    const producers = req.query.producers as string | undefined;
    const directors = req.query.directors as string | undefined;
    const collection = req.query.collection as string | undefined;
    const posterUrl = req.query.posterUrl as string | undefined;
    const backdropUrl = req.query.backdropUrl as string | undefined;
    const studioLogos = req.query.studioLogos as string | undefined;
    const studioCountries = req.query.studioCountries as string | undefined;

    // Actors as comma-separated list
    const actorNames = req.query.actorNames
        ? String(req.query.actorNames)
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
        : undefined;

    try {
        const data = await listMovies(<ListArgs>{
            page,
            pageSize: limit,
            yearStart,
            yearEnd,
            runtimeMin,
            runtimeMax,
            budgetMin,
            budgetMax,
            revenueMin,
            revenueMax,
            year,
            genre,
            mpaRating,
            title,
            studios,
            producers,
            directors,
            collection,
            posterUrl,
            backdropUrl,
            studioLogos,
            studioCountries,
            actorNames
        });

        res.json({
            success: true,
            page,
            limit,
            offset: (page - 1) * limit,
            data
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message });
    }
});

// GET /api/movies/random
r.get('/random', async (_req: Request, res: Response): Promise<void> => {
    try {
        const movies = await getRandomMovies(10);
        res.status(200).json({ success: true, data: movies });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message });
    }
});

// POST /api/movies - Create a new movie
r.post('/post',
    [
        // existing validations...
        body('producers')
            .optional()
            .isString()
            .withMessage('Producers must be a semicolon-separated string'),
        body('directors')
            .optional()
            .isString()
            .withMessage('Directors must be a semicolon-separated string'),
        body('studios')
            .optional()
            .isString()
            .withMessage('Studios must be a semicolon-separated string'),
        body('studio_logos')
            .optional()
            .isString()
            .withMessage('Studio logos must be a semicolon-separated string'),
        body('studio_countries')
            .optional()
            .isString()
            .withMessage('Studio countries must be a semicolon-separated string'),
        body('collection')
            .optional()
            .isString()
            .withMessage('Collection must be a string'),
        body('poster_url')
            .optional()
            .isURL()
            .withMessage('Poster URL must be a valid URL'),
        body('backdrop_url')
            .optional()
            .isURL()
            .withMessage('Backdrop URL must be a valid URL')
        // Add actor fields if necessary, or accept a structured array of actors
    ],
    handleValidationErrors,
    async (req: Request, res: Response): Promise<void> => {
        try {
            // Pass all these new fields as part of movieData to the service
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


// TODO: REMOVE
// PUT /api/movies/:id - Full update of a movie
r.put('/:id',
    [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Movie ID must be a positive integer'),
        body('title')
            .trim()
            .notEmpty()
            .withMessage('Title is required')
            .isLength({ min: 1, max: 500 })
            .withMessage('Title must be between 1 and 500 characters'),
        body('original_title')
            .trim()
            .notEmpty()
            .withMessage('Original title is required')
            .isLength({ max: 500 })
            .withMessage('Original title must not exceed 500 characters'),
        body('release_date')
            .optional()
            .isISO8601()
            .withMessage('Release date must be a valid ISO date'),
        body('runtime')
            .isInt({ min: 0, max: 1000 })
            .withMessage('Runtime must be between 0 and 1000 minutes'),
        body('genres')
            .isString()
            .withMessage('Genres must be a string'),
        body('overview')
            .isString()
            .isLength({ max: 5000 })
            .withMessage('Overview must not exceed 5000 characters'),
        body('budget')
            .isInt({ min: 0 })
            .withMessage('Budget must be a positive integer'),
        body('revenue')
            .isInt({ min: 0 })
            .withMessage('Revenue must be a positive integer'),
        body('mpa_rating')
            .isString()
            .isLength({ max: 10 })
            .withMessage('MPA rating must not exceed 10 characters'),
        body('country')
            .isString()
            .isLength({ max: 100 })
            .withMessage('Country must not exceed 100 characters')
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

// PATCH /api/movies/patchID - Partial update of a movie
r.patch('/patchID',
    [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Movie ID must be a positive integer'),
        body('title')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('Title cannot be empty')
            .isLength({ max: 500 })
            .withMessage('Title must not exceed 500 characters'),
        body('original_title')
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage('Original title must not exceed 500 characters'),
        body('release_date')
            .optional()
            .isISO8601()
            .withMessage('Release date must be a valid ISO date'),
        body('runtime')
            .optional()
            .isInt({ min: 0, max: 1000 })
            .withMessage('Runtime must be between 0 and 1000 minutes'),
        body('genres')
            .optional()
            .isString()
            .withMessage('Genres must be a string'),
        body('overview')
            .optional()
            .isString()
            .isLength({ max: 5000 })
            .withMessage('Overview must not exceed 5000 characters'),
        body('budget')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Budget must be a positive integer'),
        body('revenue')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Revenue must be a positive integer'),
        body('mpa_rating')
            .optional()
            .isString()
            .isLength({ max: 10 })
            .withMessage('MPA rating must not exceed 10 characters'),
        body('country')
            .optional()
            .isString()
            .isLength({ max: 100 })
            .withMessage('Country must not exceed 100 characters')
    ],
    handleValidationErrors,
    async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);

            // Check if at least one field is provided
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

// DELETE /api/movies/deleteID - Delete a movie
r.delete('/deleteID',
    [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Movie ID must be a positive integer')
    ],
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

// TODO: REMOVE
// POST /api/movies/:id/rating - Add a rating to a movie
r.post('/:id/rating',
    [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Movie ID must be a positive integer'),
        body('rating')
            .isFloat({ min: 0, max: 10 })
            .withMessage('Rating must be a number between 0 and 10'),
        body('userId')
            .optional()
            .isString()
            .isLength({ max: 100 })
            .withMessage('User ID must not exceed 100 characters')
    ],
    handleValidationErrors,
    async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
            const movieId = parseInt(req.params.id, 10);
            const { rating, userId } = req.body;

            // First check if movie exists
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

            const ratingResult = await addMovieRating(movieId, rating, userId);

            res.status(201).json({
                success: true,
                message: 'Rating added successfully',
                data: ratingResult,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to add rating: ${message}`,
                code: 'RATING_ADD_ERROR',
                timestamp: new Date().toISOString()
            });
        }
    }
);


// GET /api/movies/getID
r.get('/getID',
    [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Movie ID must be a positive integer')
    ],
    handleValidationErrors,
    async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        const idStr = req.params.id;
        const id = Number.parseInt(idStr, 10);

        const row = await getMovie(id);
        if (!row) {
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
            data: row,
            timestamp: new Date().toISOString()
        });
    }
);

export default r;