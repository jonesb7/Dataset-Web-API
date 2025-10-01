/**
 * Request logging middleware for development and debugging
 *
 * Provides comprehensive request logging with configurable detail levels
 * and performance monitoring for API endpoints.
 *
 * @see {@link ../../../docs/api-design-patterns.md#logging-patterns} for logging strategies
 */

import { Request, Response, NextFunction } from 'express';
import { config } from '@utilities/envConfig';

/**
 * Request logging middleware with environment-aware configuration
 *
 * Logs HTTP requests with timing information, status codes, and error details.
 * Automatically adjusts logging verbosity based on environment settings.
 */
export const loggerMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    // Skip logging if disabled in configuration
    if (!config.ENABLE_LOGGING) {
        return next();
    }

    const startTime = Date.now();
    const { method, url, ip } = request;
    const userAgent = request.get('User-Agent') || 'Unknown';

    // Log request start in development mode
    if (config.NODE_ENV === 'development') {
        console.log(`📨 [${new Date().toISOString()}] ${method} ${url} - ${ip}`);

        // Log request headers in development
        if (Object.keys(request.headers).length > 0) {
            console.log(`   Headers: ${JSON.stringify(request.headers, null, 2)}`);
        }

        // Log request body for POST/PUT/PATCH requests
        if (['POST', 'PUT', 'PATCH'].includes(method) && request.body) {
            console.log(`   Body: ${JSON.stringify(request.body, null, 2)}`);
        }
    }

    // Override response.end to capture response details
    const originalEnd = response.end;
    response.end = function(chunk?: any, encoding?: any): Response {
        const duration = Date.now() - startTime;
        const { statusCode } = response;
        const contentLength = response.get('Content-Length') || '0';

        // Determine log level based on status code
        const getStatusIcon = (status: number): string => {
            if (status >= 500) return '❌'; // Server error
            if (status >= 400) return '⚠️';  // Client error
            if (status >= 300) return '🔄'; // Redirect
            if (status >= 200) return '✅'; // Success
            return '📋'; // Informational
        };

        const statusIcon = getStatusIcon(statusCode);

        // Log response in all environments
        console.log(
            `${statusIcon} [${new Date().toISOString()}] ` +
            `${method} ${url} - ${statusCode} - ${duration}ms - ${contentLength}bytes - ${ip}`
        );

        // Log additional details in development
        if (config.NODE_ENV === 'development') {
            console.log(`   User-Agent: ${userAgent}`);

            // Log slow requests (>1000ms)
            if (duration > 1000) {
                console.warn(`🐌 Slow request detected: ${duration}ms`);
            }

            // Log error details for 4xx/5xx responses
            if (statusCode >= 400 && chunk) {
                try {
                    const errorData = JSON.parse(chunk.toString());
                    console.error(`   Error: ${errorData.message || 'Unknown error'}`);
                    if (errorData.code) {
                        console.error(`   Code: ${errorData.code}`);
                    }
                } catch (e) {
                    // Chunk is not JSON, log as-is
                    console.error(`   Response: ${chunk.toString().substring(0, 200)}...`);
                }
            }
        }

        // Call original end method
        return originalEnd.call(this, chunk, encoding);
    };

    next();
};

/**
 * Performance monitoring utility for tracking endpoint performance
 *
 * Higher-order function that wraps async route handlers with timing
 * and error tracking for performance monitoring.
 */
export const withPerformanceMonitoring = (
    handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
    return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        const startTime = Date.now();
        const endpoint = `${request.method} ${request.route?.path || request.url}`;

        try {
            await handler(request, response, next);

            const duration = Date.now() - startTime;

            // Log performance metrics in development
            if (config.NODE_ENV === 'development' && duration > 100) {
                console.log(`⏱️  Performance: ${endpoint} took ${duration}ms`);
            }
        } catch (error) {
            const duration = Date.now() - startTime;
            console.error(`💥 Error in ${endpoint} after ${duration}ms:`, error);
            throw error; // Re-throw to be handled by error middleware
        }
    };
};