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
    patchMovie,
    deleteMovieById
} from '@/services/movies.service';

import { handleValidationErrors } from '@middleware/validation';

const r: Router = Router();

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
r.post('/post',
    [
        // existing validations...
        body('actor1_name').optional().isString().isLength({ max: 200 }),
        body('actor1_character').optional().isString().isLength({ max: 200 }),
        body('actor1_profile').optional().isString(),
        // ... similar validations for actors 2 through 10 ...
        body('actor10_name').optional().isString().isLength({ max: 200 }),
        body('actor10_character').optional().isString().isLength({ max: 200 }),
        body('actor10_profile').optional().isString()
        // other validations...
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



r.patch('/patchID:id',
    [
        param('id')
            .isInt({ min: 1 })
            .withMessage('Movie ID must be a positive integer'),
        body('title')
            .optional()
            .trim()
            .notEmpty()
            .isLength({ max: 500 }),
        body('original_title')
            .optional()
            .trim()
            .isLength({ max: 500 }),
        body('release_date')
            .optional()
            .isISO8601(),
        body('runtime')
            .optional()
            .isInt({ min: 0, max: 1000 }),
        body('genres')
            .optional()
            .isString(),
        body('overview')
            .optional()
            .isString()
            .isLength({ max: 5000 }),
        body('budget')
            .optional()
            .isInt({ min: 0 }),
        body('revenue')
            .optional()
            .isInt({ min: 0 }),
        body('mpa_rating')
            .optional()
            .isString()
            .isLength({ max: 10 }),
        body('collection')
            .optional()
            .isString(),
        body('poster_url')
            .optional()
            .isURL(),
        body('backdrop_url')
            .optional()
            .isURL(),
        body('producers')
            .optional()
            .isString(),
        body('directors')
            .optional()
            .isString(),
        body('studios')
            .optional()
            .isString(),
        body('studio_logos')
            .optional()
            .isString(),
        body('studio_countries')
            .optional()
            .isString(),


        // Actor fields: optional strings with max length, one per actor slot
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


// DELETE /api/movies/deleteID - Delete a movie
r.delete('/deleteID/:id',
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


// GET /api/movies/getID
r.get('/getID/:id',
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