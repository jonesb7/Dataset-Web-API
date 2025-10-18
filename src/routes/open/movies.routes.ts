// src/routes/open/movies.routes.ts
import { Router } from 'express';
import {
    getMovies,
    getRandomMovies,
    getMoviesByYear
} from '../../controllers/movieController'; // <-- two dots, not one

const r = Router();

// GET /api/movies?page=1&pageSize=50&year=2010&title=Inception&genre=Action
r.get('/', getMovies);

// GET /api/movies/random?limit=10
r.get('/random', getRandomMovies);

// GET /api/movies/moviebyyear?year=2010
r.get('/moviebyyear', getMoviesByYear);

export default r;
