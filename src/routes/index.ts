/**
 * Main application routing configuration
 *
 * Configures all API routes with proper organization, middleware application,
 * and error handling for a complete routing system.
 *
 * @see {@link ../../docs/node-express-architecture.md#routing-architecture} for routing patterns
 */

import { Router } from 'express';
import { healthRoutes } from './open/healthRoutes';
import { helloRoutes } from './open/helloRoutes';
import { parametersRoutes } from './open/parametersRoutes';
import docsRoutes from './open/docsRoutes';
import { notFoundHandler } from '@middleware/errorHandler';

export const routes = Router();

// Health check routes (no authentication required)
routes.use('/health', healthRoutes);

// Hello World demonstration routes (no authentication required)
routes.use('/hello', helloRoutes);

// Parameters demonstration routes (no authentication required)
routes.use('/parameters', parametersRoutes);

// Documentation routes (no authentication required)
routes.use('/docs', docsRoutes);

// API version and documentation endpoint
routes.get('/', (request, response) => {
    response.json({
        success: true,
        message: 'TCSS-460 HelloWorld API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/health',
            healthDetailed: '/health/detailed',
            hello: '/hello',
            parametersQuery: '/parameters/query?name=value',
            parametersPath: '/parameters/path/{name}',
            parametersBody: '/parameters/body',
            parametersHeaders: '/parameters/headers',
            docs: '/docs'
        },
        documentation: '/api-docs'
    });
});

// Handle 404 for unmatched routes
routes.use('*', notFoundHandler);