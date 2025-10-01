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
import { corsMiddleware } from '@middleware/cors';
import { loggerMiddleware } from '@middleware/logger';
import { errorHandler } from '@middleware/errorHandler';
import { routes } from '@/routes';
import { swaggerSpec, swaggerUiOptions } from '@/core/config/swagger';

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

    // Security and CORS middleware (must be first)
    app.use(corsMiddleware);

    // Request parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging middleware (after parsing, before routes)
    app.use(loggerMiddleware);

    // API Documentation with Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

    // API routes
    app.use('/', routes);

    // Global error handling middleware (must be last)
    app.use(errorHandler);

    return app;
};