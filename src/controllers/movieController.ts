// src/controllers/movieController.ts
import { Request, Response } from 'express';
import { listMovies, getRandomMovies as svcRandom } from '../services/movies.service';

// GET /api/movies?page=&pageSize=&year=&title=&genre=
export async function getMovies(req: Request, res: Response): Promise<void> {
    const page = Math.max(1, Number.parseInt(String(req.query.page ?? '1'), 10));
    const pageSize = Math.min(
        100,
        Math.max(1, Number.parseInt(String(req.query.pageSize ?? '25'), 10))
    );

    const { year, title, genre } = req.query as {
        year?: string; title?: string; genre?: string;
    };

    const movies = await listMovies({ page, pageSize, year, title, genre });
    res.json({ success: true, count: movies.length, data: movies });
}

// GET /api/movies/random?limit=10
export async function getRandomMovies(req: Request, res: Response): Promise<void> {
    const limit = Math.min(
        100,
        Math.max(1, Number.parseInt(String(req.query.limit ?? '10'), 10))
    );
    const rows = await svcRandom(limit);
    res.json({ success: true, count: rows.length, data: rows });
}

// GET /api/movies/moviebyyear?year=2010
export async function getMoviesByYear(req: Request, res: Response): Promise<void> {
    const year = String(req.query.year ?? '');
    if (!/^\d{4}$/.test(year)) {
        res.status(400).json({ success: false, message: 'year must be a 4-digit number' });
        return;
    }
    const rows = await listMovies({ page: 1, pageSize: 50, year });
    res.json({ success: true, count: rows.length, data: rows });
}



