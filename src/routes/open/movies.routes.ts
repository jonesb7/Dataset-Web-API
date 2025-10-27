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

// GET /api/movies
r.get('/', async (req: Request, res: Response): Promise<void> => {
    const page = Math.max(1, Number.parseInt(String(req.query.page ?? '1'), 10));
    const pageSize = Math.min(100, Math.max(1, Number.parseInt(String(req.query.pageSize ?? '25'), 10)));

    const { year, title, genre } = req.query as {
        year?: string;
        title?: string;
        genre?: string;
    };

    const args: Pick<ListArgs, 'page' | 'pageSize'> &
        Partial<Pick<ListArgs, 'year' | 'title' | 'genre'>> = { page, pageSize };
    if (year) args.year = year;
    if (title) args.title = title;
    if (genre) args.genre = genre;

    const result = await listMovies(<ListArgs>args);
    res.json(result);
});

// GET /api/movies/stats?by=year|genre
r.get('/stats',
    [
        query('by')
            .optional()
            .isIn(['year', 'genre'])
            .withMessage('by parameter must be either "year" or "genre"')
    ],
    handleValidationErrors,
    async (req: Request, res: Response): Promise<void> => {
        const by = String(req.query.by ?? 'year');
        const result = await stats(by);
        res.json({
            success: true,
            data: result,
            groupedBy: by,
            timestamp: new Date().toISOString()
        });
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
r.post('/',
    [
        body('title')
            .trim()
            .notEmpty()
            .withMessage('Title is required')
            .isLength({ min: 1, max: 500 })
            .withMessage('Title must be between 1 and 500 characters'),
        body('original_title')
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage('Original title must not exceed 500 characters'),
        body('release_date')
            .optional()
            .isISO8601()
            .withMessage('Release date must be a valid ISO date (YYYY-MM-DD)'),
        body('runtime')
            .optional()
            .isInt({ min: 0, max: 1000 })
            .withMessage('Runtime must be a positive integer (0-1000 minutes)'),
        body('genres')
            .optional()
            .isString()
            .withMessage('Genres must be a comma-separated string'),
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

// PATCH /api/movies/:id - Partial update of a movie
r.patch('/:id',
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

// DELETE /api/movies/:id - Delete a movie
r.delete('/:id',
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

// POST /api/movies/insert - Legacy CSV insert
r.post('/insert', insertMovie);

// DELETE /api/movies/delete/:id - Legacy CSV delete
r.delete('/delete/:id', deleteMovie);

// GET /api/movies/:id
r.get('/:id',
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