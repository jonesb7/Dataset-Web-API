/**
 * CORS (Cross-Origin Resource Sharing) middleware configuration
 *
 * Configures cross-origin request handling for secure API access from
 * web applications. Implements security best practices while enabling
 * legitimate cross-origin requests.
 *
 * @see {@link ../../../docs/api-design-patterns.md#cors-configuration} for CORS patterns
 */

import cors from 'cors';
import { config } from '@utilities/envConfig';

/**
 * CORS middleware with environment-specific configuration
 *
 * Configures CORS settings based on environment variables with secure
 * defaults for production and permissive settings for development.
 */
export const corsMiddleware = cors({
    // Allow requests from configured origins
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        // Check if origin is in allowed list
        if (config.CORS_ORIGINS.includes('*') || config.CORS_ORIGINS.includes(origin)) {
            return callback(null, true);
        }

        // Reject requests from unauthorized origins
        // Return false (not Error) to properly reject with 403
        callback(null, false);
    },

    // Allowed HTTP methods
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    // Allowed request headers
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control',
        'X-API-Version'
    ],

    // Headers exposed to the client
    exposedHeaders: [
        'X-API-Version',
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset'
    ],

    // Enable cookies and credentials
    credentials: true,

    // Cache preflight requests for 24 hours
    maxAge: 86400,

    // Handle preflight requests
    preflightContinue: false,
    optionsSuccessStatus: 204
});