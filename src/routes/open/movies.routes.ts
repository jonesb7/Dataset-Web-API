// src/routes/open/movies.routes.ts
import { Router, Request, Response } from 'express';
import {
    listMovies,
    listMoviesAdvanced,
    listMoviesByOffset,
    getMovie,
    stats,
    BasicListArgs,
    AdvancedListArgs,
} from '../../services/movies.service';

const r: Router = Router();

/** helpers to coerce values from req.query */
const num = (v: unknown): number | undefined => {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
};
const str = (v: unknown): string | undefined =>
    typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined;

/**
 * GET /api/movies
 * simple basic filtering (year/title/genre) w/ page+pageSize
 */
r.get('/', async (req: Request, res: Response): Promise<void> => {
    const page = Math.max(
        1,
        Number.parseInt(String(req.query.page ?? '1'), 10),
    );
    const pageSize = Math.min(
        100,
        Math.max(
            1,
            Number.parseInt(String(req.query.pageSize ?? '25'), 10),
        ),
    );

    const args: BasicListArgs = {
        page,
        pageSize,
        year: str(req.query.year),
        title: str(req.query.title),
        genre: str(req.query.genre),
    };

    try {
        const data = await listMovies(args);
        res.json({
            success: true,
            page,
            pageSize,
            offset: (page - 1) * pageSize,
            data,
        });
    } catch (err) {
        console.error('GET /api/movies error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * GET /api/movies/stats?by=genre|year
 */
r.get('/stats', async (req: Request, res: Response): Promise<void> => {
    const by = String(req.query.by ?? 'year');
    try {
        const data = await stats(by);
        res.json({ success: true, by, data });
    } catch (err) {
        console.error('GET /api/movies/stats error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * GET /api/movies/page
 * full insane filter version
 */
r.get('/page', async (req: Request, res: Response): Promise<void> => {
    // helpful header so you can confirm which route handled it in curl -i
    res.set('X-Route', '/api/movies/page');

    const page = num(req.query.page) ?? 1;
    const limit = Math.min(100, num(req.query.limit) ?? 25);

    const filters: AdvancedListArgs = {
        page,
        limit,

        yearStart: num(req.query.yearStart),
        yearEnd: num(req.query.yearEnd),

        budgetLow: num(req.query.budgetLow),
        budgetHigh: num(req.query.budgetHigh),

        revenueLow: num(req.query.revenueLow),
        revenueHigh: num(req.query.revenueHigh),

        runtimeLow: num(req.query.runtimeLow),
        runtimeHigh: num(req.query.runtimeHigh),

        genre: str(req.query.genre),
        mpaRating: str(req.query.mpaRating),
        title: str(req.query.title),

        studio: str(req.query.studio),
        producer: str(req.query.producer),
        director: str(req.query.director),
        collection: str(req.query.collection),
    };

    try {
        const data = await listMoviesAdvanced(filters);

        // optional: echo filters back so you can debug in browser / curl
        res.set('X-Filters', JSON.stringify(filters));


        res.json({
            success: true,
            page,
            limit,
            offset: (page - 1) * limit,
            data,
        });
    } catch (err) {
        console.error('GET /api/movies/page error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * GET /api/movies/page/simple
 * really dumb pagination (no filters) just to show stuff loads
 */
r.get(
    '/page/simple',
    async (req: Request, res: Response): Promise<void> => {
        res.set('X-Route', '/api/movies/page/simple');

        const page = num(req.query.page) ?? 1;
        const limit = Math.min(100, num(req.query.limit) ?? 25);
        const offset = (page - 1) * limit;

        try {
            const data = await listMoviesByOffset(limit, offset);

            res.json({
                success: true,
                page,
                limit,
                offset,
                data,
            });
        } catch (err) {
            console.error('GET /api/movies/page/simple error:', err);
            res
                .status(500)
                .json({ success: false, message: 'Server error' });
        }
    },
);

/**
 * GET /api/movies/:id
 * Single movie lookup
 */
r.get('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const idNum = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(idNum)) {
        res.status(400).json({ error: 'id must be a number' });
        return;
    }

    try {
        const row = await getMovie(idNum);
        if (!row) {
            res.status(404).json({ error: 'Not found' });
            return;
        }
        res.json(row);
    } catch (err) {
        console.error('GET /api/movies/:id error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default r;
