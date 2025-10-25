import { Router, Request, Response } from 'express';
import {
    getRandomMovies,
    listMovies,
    getMovie,
    stats,
    ListArgs
} from '../../services/movies.service';
import { insertMovie, deleteMovie } from '../../controllers/movieController';

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
r.get('/stats', async (req: Request, res: Response): Promise<void> => {
    const by = String(req.query.by ?? 'year');
    res.json(await stats(by));
});

// GET /api/movies/page (multi-filter + pagination)
r.get('/page', async (req: Request, res: Response): Promise<void> => {
    const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10));
    const limit = Math.max(1, Math.min(100, parseInt(String(req.query.limit ?? '25'), 10)));

    // Numeric filters
    const yearStart = req.query.yearStart ? parseInt(String(req.query.yearStart), 10) : undefined;
    const yearEnd = req.query.yearEnd ? parseInt(String(req.query.yearEnd), 10) : undefined;
    const runtimeMin = req.query.runtimeMin ? parseInt(String(req.query.runtimeMin), 10) : undefined;
    const runtimeMax = req.query.runtimeMax ? parseInt(String(req.query.runtimeMax), 10) : undefined;

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
        const data = await listMovies({
            page,
            pageSize: limit,
            yearStart,
            yearEnd,
            runtimeMin,
            runtimeMax,
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

// POST /api/movies/insert
r.post('/insert', insertMovie);

// DELETE /api/movies/delete/:id
r.delete('/delete/:id', deleteMovie);

// GET /api/movies/:id
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

    res.json(row);
});

export default r;
