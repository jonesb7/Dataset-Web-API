/**
 * Protected Movie Routes
 * Require valid API key via authMiddleware.
 */

import { Router } from 'express';
import { authMiddleware } from '@middleware/auth';
import { insertMovie, deleteMovie } from '../../controllers/movieController';

const router = Router();

// Use authentication middleware for all routes
router.use(authMiddleware);

// Add new movie
router.post('/movies/insert', insertMovie);

// Delete movie by title
router.delete('/movies/delete/:id', deleteMovie);

export default router;
