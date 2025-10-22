import { Router, Request, Response } from 'express';
import {
    listMovies,
    listMoviesAdvanced,
    getRandomMovies,
    getMovie,
    stats,
    ListArgs
} from '@/services/movies.service';
import { insertMovie, deleteMovie } from '@controllers/movieController';

const r: Router = Router();

/**
 * GET /api/movies
 * Must return { data: [...] } for Newman tests.
 */
r.get('/', async (req: Request, res: Response): Promise<void> => {
    const page = Math.max(1, Number.parseInt(String(req.query.page ?? '1'), 10));
    const pageSize = Math.min(100, Math.max(1, Number.parseInt(String(req.query.pageSize ?? '25'), 10)));

    const { year, title, genre } = req.query as { year?: string; title?: string; genre?: string };

    const args: Pick<ListArgs, 'page' | 'pageSize'> &
        Partial<Pick<ListArgs, 'year' | 'title' | 'genre'>> = { page, pageSize };
    if (year) args.year = year;
    if (title) args.title = title;
    if (genre) args.genre = genre;

    const result = await listMovies(args);

    // Normalize various possible returns into { data: [...] }
    const payload =
        Array.isArray(result) ? { data: result } :
            Array.isArray((result as any)?.data) ? (result as any) :
                Array.isArray((result as any)?.items) ? { data: (result as any).items } :
                    { data: [] };

    res.status(200).json(payload);
});

/**
 * GET /api/movies/stats?by=year|genre
 * Must return { stats: [...] } for Newman tests.
 */
r.get('/stats', async (req: Request, res: Response): Promise<void> => {
    const by = String(req.query.by ?? 'year'); // 'year' or 'genre'
    const s = await stats(by);
    res.status(200).json({ stats: s });
});

/**
 * GET /api/movies/page?limit=10&offset=50&... (advanced filters)
 * Returns a friendly envelope (your tests don’t check this one’s shape strictly).
 */
r.get('/page', async (req: Request, res: Response): Promise<void> => {
    try {
        const parseNumber = (value: unknown): number | undefined => {
            const n = Number(value);
            return Number.isNaN(n) ? undefined : n;
        };

        const {
            page = '1',
            limit = '10',
            yearStart,
            yearEnd,
            budgetLow,
            budgetHigh,
            revenueLow,
            revenueHigh,
            runtimeLow,
            runtimeHigh,
            genre,
            studio,
            producer,
            director,
            mpaRating,
            collection
        } = req.query;

        const result = await listMoviesAdvanced({
            page: parseNumber(page) ?? 1,
            limit: parseNumber(limit) ?? 10,
            yearStart: parseNumber(yearStart),
            yearEnd: parseNumber(yearEnd),
            budgetLow: parseNumber(budgetLow),
            budgetHigh: parseNumber(budgetHigh),
            revenueLow: parseNumber(revenueLow),
            revenueHigh: parseNumber(revenueHigh),
            runtimeLow: parseNumber(runtimeLow),
            runtimeHigh: parseNumber(runtimeHigh),
            genre: typeof genre === 'string' && genre.trim() !== '' ? genre.trim() : undefined,
            studio: typeof studio === 'string' && studio.trim() !== '' ? studio.trim() : undefined,
            producer: typeof producer === 'string' && producer.trim() !== '' ? producer.trim() : undefined,
            director: typeof director === 'string' && director.trim() !== '' ? director.trim() : undefined,
            mpaRating: typeof mpaRating === 'string' && mpaRating.trim() !== '' ? mpaRating.trim() : undefined,
            collection: typeof collection === 'string' && collection.trim() !== '' ? collection.trim() : undefined
        });

        res.status(200).json({
            success: true,
            data: result,
            page: parseInt(String(page), 10),
            limit: parseInt(String(limit), 10),
            offset: (parseInt(String(page), 10) - 1) * parseInt(String(limit), 10)
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Server error in GET /movies/page:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * GET /api/movies/random
 */
r.get('/random', async (_req: Request, res: Response): Promise<void> => {
    try {
        const movies = await getRandomMovies(10);
        res.status(200).json({ success: true, data: movies });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message });
    }
});

/**
 * POST /api/movies/insert
 */
r.post('/insert', insertMovie);

/**
 * DELETE /api/movies/delete/:id
 */
r.delete('/delete/:id', deleteMovie);

/**
 * GET /api/movies/:id
 */
r.get('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const idStr = req.params.id;
    const id = Number.parseInt(idStr, 10);
    if (Number.isNaN(id)) {
        res.status(400).json({ error: 'id must be a number' });
        return;
    }

    const row = await getMovie(id);
    if (!row) {
        res.status(404).json({ error: 'Not found' });
        return;
    }
    res.status(200).json(row);
});

export default r;
