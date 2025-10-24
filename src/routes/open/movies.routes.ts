// src/routes/open/movies.routes.ts

import { Router, Request, Response } from 'express';
import {
    listMovies,
    listMoviesAdvanced,
    listMoviesByOffset,
    getRandomMovies,
    getMovie,
    stats,
    ListArgs,
    AdvancedListArgs,
} from '../../services/movies.service';

import { insertMovie, deleteMovie } from '../../controllers/movieController';

const r: Router = Router();

/** helper: turn query param into number or undefined */
const num = (v: unknown): number | undefined => {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
};

/** helper: trim string or return undefined if blank/missing */
const str = (v: unknown): string | undefined =>
    typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined;

/* =========================================================================
 * GET /api/movies
 * Simple list with page/pageSize and optional year/title/genre filters
 * =========================================================================
 *
 * Example:
 *   /api/movies?page=2&pageSize=10&year=2018&genre=Action
 */
r.get('/', async (req: Request, res: Response): Promise<void> => {
    const page = Math.max(1, Number.parseInt(String(req.query.page ?? '1'), 10));
    const pageSize = Math.min(
        100,
        Math.max(1, Number.parseInt(String(req.query.pageSize ?? '25'), 10))
    );

    const { year, title, genre } = req.query as {
        year?: string;
        title?: string;
        genre?: string;
    };

    // Build args in a typesafe way
    const args: Pick<ListArgs, 'page' | 'pageSize'> &
        Partial<Pick<ListArgs, 'year' | 'title' | 'genre'>> = {
        page,
        pageSize,
    };

    if (year) args.year = year;
    if (title) args.title = title;
    if (genre) args.genre = genre;

    try {
        const result = await listMovies(args);
        res.json({
            success: true,
            page,
            pageSize,
            count: result.length,
            data: result,
        });
    } catch (err) {
        console.error('Error in GET /api/movies:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/* =========================================================================
 * GET /api/movies/stats?by=year|genre
 * Aggregations by year or by genre
 * =========================================================================
 *
 * /api/movies/stats?by=year
 * /api/movies/stats?by=genre
 */
r.get('/stats', async (req: Request, res: Response): Promise<void> => {
    const by = String(req.query.by ?? 'year');
    try {
        const data = await stats(by);
        res.json({ success: true, by, data });
    } catch (err) {
        console.error('Error in GET /api/movies/stats:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/* =========================================================================
 * GET /api/movies/page
 * Advanced filtered search with paging.
 *
 * Supported query params (all optional except page/limit defaults kick in):
 *   page, limit
 *   yearStart, yearEnd
 *   budgetLow, budgetHigh
 *   revenueLow, revenueHigh
 *   runtimeLow, runtimeHigh
 *   genre, mpaRating, title
 *
 * Examples:
 *   /api/movies/page?yearStart=2010&yearEnd=2020&genre=Action&limit=5&page=1
 *   /api/movies/page?runtimeLow=80&runtimeHigh=120&mpaRating=PG-13&limit=5
 *   /api/movies/page?budgetLow=1000000&budgetHigh=50000000
 */
r.get('/page', async (req: Request, res: Response): Promise<void> => {
    // Shows up in curl -i so we can prove which handler returned
    res.set('X-Route', '/api/movies/page');

    // required-ish pagination pieces
    const page = num(req.query.page) ?? 1;
    const limit = Math.min(100, num(req.query.limit) ?? 25);

    // Build filters object in a way that satisfies
    // exactOptionalPropertyTypes + runtime flexibility.
    const filters: AdvancedListArgs = {
        page,
        limit,
    };

    const yStart = num(req.query.yearStart);
    if (yStart !== undefined) filters.yearStart = yStart;

    const yEnd = num(req.query.yearEnd);
    if (yEnd !== undefined) filters.yearEnd = yEnd;

    const bLow = num(req.query.budgetLow);
    if (bLow !== undefined) filters.budgetLow = bLow;

    const bHigh = num(req.query.budgetHigh);
    if (bHigh !== undefined) filters.budgetHigh = bHigh;

    const revLow = num(req.query.revenueLow);
    if (revLow !== undefined) filters.revenueLow = revLow;

    const revHigh = num(req.query.revenueHigh);
    if (revHigh !== undefined) filters.revenueHigh = revHigh;

    const rtLow = num(req.query.runtimeLow);
    if (rtLow !== undefined) filters.runtimeLow = rtLow;

    const rtHigh = num(req.query.runtimeHigh);
    if (rtHigh !== undefined) filters.runtimeHigh = rtHigh;

    const g = str(req.query.genre);
    if (g !== undefined) filters.genre = g;

    const rating = str(req.query.mpaRating);
    if (rating !== undefined) filters.mpaRating = rating;

    const t = str(req.query.title);
    if (t !== undefined) filters.title = t;

    try {
        const data = await listMoviesAdvanced(filters);

        // Convenience header so you can copy/paste in debugging
        res.set(
            'X-Filters',
            JSON.stringify({
                page,
                limit,
                yearStart: req.query.yearStart,
                yearEnd: req.query.yearEnd,
                budgetLow: req.query.budgetLow,
                budgetHigh: req.query.budgetHigh,
                revenueLow: req.query.revenueLow,
                revenueHigh: req.query.revenueHigh,
                runtimeLow: req.query.runtimeLow,
                runtimeHigh: req.query.runtimeHigh,
                genre: req.query.genre,
                mpaRating: req.query.mpaRating,
                title: req.query.title,
            })
        );

        res.json({
            success: true,
            page,
            limit,
            offset: (page - 1) * limit,
            data,
        });
    } catch (err) {
        console.error('Server error in GET /api/movies/page:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/* =========================================================================
 * GET /api/movies/page/simple
 * Simple pagination with NO filters (DB smoke test)
 *
 * /api/movies/page/simple?limit=5&page=1
 * =========================================================================
 */
r.get('/page/simple', async (req: Request, res: Response): Promise<void> => {
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
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message });
    }
});

/* =========================================================================
 * GET /api/movies/random
 * Returns random movies (uses ORDER BY RANDOM() in Postgres)
 * =========================================================================
 */
r.get('/random', async (_req: Request, res: Response): Promise<void> => {
    try {
        const movies = await getRandomMovies(10);
        res.status(200).json({ success: true, data: movies });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message });
    }
});

/* =========================================================================
 * POST /api/movies/insert
 * CSV-backed "insert" into your local dataset file
 * =========================================================================
 */
r.post('/insert', insertMovie);

/* =========================================================================
 * DELETE /api/movies/delete/:id
 * CSV-backed "delete" by title/id string (you built this in movieController)
 * =========================================================================
 */
r.delete('/delete/:id', deleteMovie);

/* =========================================================================
 * GET /api/movies/:id
 * Lookup by numeric movie_id in Postgres
 * =========================================================================
 */
r.get('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
        res.status(400).json({ error: 'id must be a number' });
        return;
    }

    try {
        const row = await getMovie(id);
        if (!row) {
            res.status(404).json({ error: 'Not found' });
            return;
        }
        res.json({ success: true, data: row });
    } catch (err) {
        console.error('Error in GET /api/movies/:id:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default r;

