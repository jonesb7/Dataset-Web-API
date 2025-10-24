// src/routes/index.ts
import { Router, Request, Response } from 'express';

// pull in the per-feature routers from open/
import {
    healthRoutes,
    helloRoutes,
    parametersRoutes,
    docsRoutes,
    moviesRoutes,
} from './open';

// 404 handler
import { notFoundHandler } from '../core/middleware/errorHandler';

export const routes = Router();

/**
 * Public, no-auth routes
 * These are mounted under /api in app.ts
 * So e.g. GET /api/health, /api/hello, etc.
 */
routes.use('/health', healthRoutes);
routes.use('/hello', helloRoutes);
routes.use('/parameters', parametersRoutes);
routes.use('/api/movies', moviesRoutes); // <--- yup, /api/movies becomes /api/api/movies if you also prefix in app.ts. See note below.
routes.use('/docs', docsRoutes);

/**
 * API root: GET /api
 * Returns metadata + useful links to help consumers explore.
 */
routes.get('/', (_req: Request, res: Response): void => {
    res.json({
        success: true,
        message: 'TCSS-460 HelloWorld API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            // health
            health: '/health',
            healthDetailed: '/health/detailed',

            // hello
            hello: '/hello',

            // parameters demo
            parametersQuery: '/parameters/query?name=value',
            parametersPath: '/parameters/path/{name}',
            parametersBody: '/parameters/body',
            parametersHeaders: '/parameters/headers',

            // movies
            movies: '/api/movies',
            moviesStatsYear: '/api/movies/stats?by=year',
            moviesStatsGenre: '/api/movies/stats?by=genre',
            moviesPageSimple: '/api/movies/page/simple?limit=5&page=1',
            moviesPageAdvanced:
                '/api/movies/page?yearStart=2010&yearEnd=2020&genre=Action&limit=5&page=1',
        },
        docs: '/docs',
    });
});

/**
 * 404 fallback for anything that didn't match above
 */
routes.use('*', notFoundHandler);

export default routes;
