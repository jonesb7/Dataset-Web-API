import { Router, Request, Response } from 'express';
import { getRandomMovies, listMovies, getMovie, stats, ListArgs } from '../../services/movies.service';
import { insertMovie, deleteMovie } from '../../controllers/movieController';
const r: Router = Router();

// GET /api/movies
r.get('/', async (req: Request, res: Response): Promise<void> => {
    const page = Math.max(1, Number.parseInt(String(req.query.page ?? '1'), 10));
    const pageSize = Math.min(
        100,
        Math.max(1, Number.parseInt(String(req.query.pageSize ?? '25'), 10))
    );

    const { year, title, genre } = req.query as {
        year?: string; title?: string; genre?: string;
    };

    // Build args without undefined keys (works with exactOptionalPropertyTypes)
    const args: Pick<ListArgs, 'page' | 'pageSize'> &
        Partial<Pick<ListArgs, 'year' | 'title' | 'genre'>> = { page, pageSize };
    if (year)  args.year = year;
    if (title) args.title = title;
    if (genre) args.genre = genre;

    const result = await listMovies(args);
    res.json(result);
});

// GET /api/movies/stats?by=year|genre
r.get('/stats', async (req: Request, res: Response): Promise<void> => {
    const by = String(req.query.by ?? 'year');
    res.json(await stats(by));
});

r.get('/random', async (_req: Request, res: Response): Promise<void> => {
    try {
        const movies = await getRandomMovies(10);
        res.status(200).json({ success: true, data: movies });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message });
    }
});
// POST /api/movies/insert - NEW!
r.post('/insert', insertMovie);

// DELETE /api/movies/delete/:id - NEW!
r.delete('/delete/:id', deleteMovie);
// GET /api/movies/:id
// 👇 Tell TS that params contain { id: string } so req.params.id is not undefined
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