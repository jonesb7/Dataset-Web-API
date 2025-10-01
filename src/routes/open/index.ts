/**
 * Open routes barrel exports
 *
 * Aggregates all publicly accessible routes that don't require authentication.
 * Provides clean organization for routes that are available to all clients.
 *
 * @see {@link ../../../docs/node-express-architecture.md#routing-patterns} for routing organization
 */

// Health monitoring routes
export * from './healthRoutes';

// Hello World demonstration routes
export * from './helloRoutes';

// Parameters demonstration routes
export * from './parametersRoutes';