/**
 * Express application factory with complete middleware stack
 *
 * Configures CORS, body parsing, routing, and error handling for production use.
 * Implements MVC architecture patterns with separation of concerns.
 *
 * @see {@link ../docs/node-express-architecture.md#mvc-architecture-pattern} for MVC concepts
 * @see {@link ../docs/api-design-patterns.md#middleware-system} for middleware patterns
 * @returns Configured Express application instance
 */

import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { corsMiddleware } from './core/middleware/cors';
import { loggerMiddleware } from './core/middleware/logger';
import { errorHandler } from './core/middleware/errorHandler';
import { routes } from './routes';
import moviesRouter from '@routes/open/movies.routes';
import fs from 'fs';
import yaml from 'yaml';
import path from 'path';

/**
 * Create and configure Express application with complete middleware stack
 *
 * Sets up the application with proper middleware ordering, security headers,
 * request parsing, and error handling. Follows industry best practices for
 * production Express.js applications.
 *
 * @returns Fully configured Express application
 */
export const createApp = (): Express => {
    const app = express();

    // Trust proxy headers (important for deployment behind load balancers)
    app.set('trust proxy', 1);

    // =======================
    // 🔒 Security Middleware
    // =======================
    app.use(corsMiddleware);

    // =======================
    // 📦 Body Parsing
    // =======================
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // =======================
    // 🧾 Request Logging
    // =======================
    app.use(loggerMiddleware);

    // =======================
    // 📚 API Documentation
    // =======================

    // Load YAML dynamically (works both locally and on Render)
    const swaggerPath = path.resolve(process.cwd(), 'project_files/api.yaml');
    const swaggerFile = fs.readFileSync(swaggerPath, 'utf8');
    const swaggerDoc = yaml.parse(swaggerFile);

    // Serve Swagger UI at /api-docs
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

    // Redirect root to docs (fixes Render “Cannot GET /”)
    app.get('/', (_req, res) => res.redirect('/api-docs'));

    // =======================
    // 🌐 API Routes
    // =======================
    app.use('/api/movies', moviesRouter);
    app.use('/', routes);

    // =======================
    // ⚠️ Global Error Handler
    // =======================
    app.use(errorHandler);

    return app;
};
