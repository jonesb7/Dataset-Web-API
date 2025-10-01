/**
 * Global error handling middleware for consistent error responses
 *
 * Centralized error handling that catches all unhandled errors and
 * formats them into standardized API responses with proper logging.
 *
 * @see {@link ../../../docs/error-handling-patterns.md} for error handling strategies
 */

import { Request, Response, NextFunction } from 'express';
import { ErrorResponse, ErrorCodes } from '@/types';
import { config } from '@utilities/envConfig';

/**
 * Custom application error class for structured error handling
 *
 * Extends the standard Error class with additional properties for
 * HTTP status codes and error codes for consistent error responses.
 */
export class AppError extends Error {
    public statusCode: number;
    public errorCode: ErrorCodes;
    public isOperational: boolean;

    constructor(
        message: string,
        statusCode: number = 500,
        errorCode: ErrorCodes = ErrorCodes.INTERNAL_ERROR,
        isOperational: boolean = true
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = isOperational;

        // Maintain proper stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Global error handling middleware
 *
 * Catches all errors thrown in the application and formats them into
 * standardized error responses. Handles both operational errors (expected)
 * and programming errors (unexpected) with appropriate logging and responses.
 */
export const errorHandler = (
    error: Error | AppError,
    request: Request,
    response: Response,
    next: NextFunction
): void => {
    let statusCode = 500;
    let errorCode = ErrorCodes.INTERNAL_ERROR;
    let message = 'Internal Server Error';
    let details: any = undefined;

    // Handle custom AppError instances
    if (error instanceof AppError) {
        statusCode = error.statusCode;
        errorCode = error.errorCode;
        message = error.message;
    }
    // Handle specific error types
    else if (error.name === 'ValidationError') {
        statusCode = 400;
        errorCode = ErrorCodes.INVALID_REQUEST_FORMAT;
        message = 'Validation failed';
        details = error.message;
    }
    else if (error.name === 'CastError') {
        statusCode = 400;
        errorCode = ErrorCodes.BAD_REQUEST;
        message = 'Invalid data format';
    }
    else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        errorCode = ErrorCodes.UNAUTHORIZED;
        message = 'Invalid authentication token';
    }
    else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        errorCode = ErrorCodes.UNAUTHORIZED;
        message = 'Authentication token has expired';
    }
    else if (error.message.includes('CORS')) {
        statusCode = 403;
        errorCode = ErrorCodes.FORBIDDEN;
        message = 'Cross-origin request blocked';
    }
    // Handle syntax errors (malformed JSON, etc.)
    else if (error instanceof SyntaxError && 'body' in error) {
        statusCode = 400;
        errorCode = ErrorCodes.INVALID_REQUEST_FORMAT;
        message = 'Invalid JSON in request body';
    }

    // Log error details for debugging
    const logError = (err: Error, req: Request): void => {
        const timestamp = new Date().toISOString();
        const { method, url, ip } = req;
        const userAgent = req.get('User-Agent') || 'Unknown';

        console.error(`💥 [${timestamp}] Error in ${method} ${url}:`);
        console.error(`   Status: ${statusCode}`);
        console.error(`   Message: ${message}`);
        console.error(`   IP: ${ip}`);
        console.error(`   User-Agent: ${userAgent}`);

        // Log full error details in development
        if (config.NODE_ENV === 'development') {
            console.error(`   Stack: ${err.stack}`);
            if (req.body && Object.keys(req.body).length > 0) {
                console.error(`   Request Body: ${JSON.stringify(req.body, null, 2)}`);
            }
        }

        // Log operational vs programming errors differently
        if (error instanceof AppError && error.isOperational) {
            console.error(`   Type: Operational Error (expected)`);
        } else {
            console.error(`   Type: Programming Error (unexpected)`);
        }
    };

    // Log the error
    logError(error, request);

    // Create standardized error response
    const errorResponse: ErrorResponse = {
        success: false,
        message,
        code: errorCode,
        timestamp: new Date().toISOString(),
        details: config.NODE_ENV === 'development' ? details : undefined
    };

    // Send error response
    response.status(statusCode).json(errorResponse);
};

/**
 * Async error wrapper for route handlers
 *
 * Higher-order function that wraps async route handlers to automatically
 * catch and forward errors to the global error handler.
 */
export const asyncHandler = (
    handler: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (request: Request, response: Response, next: NextFunction): void => {
        Promise.resolve(handler(request, response, next)).catch(next);
    };
};

/**
 * 404 Not Found handler for unmatched routes
 *
 * Catches requests to non-existent endpoints and returns standardized
 * 404 responses instead of default Express error pages.
 */
export const notFoundHandler = (request: Request, response: Response, next: NextFunction): void => {
    const error = new AppError(
        `Route ${request.method} ${request.url} not found`,
        404,
        ErrorCodes.NOT_FOUND
    );
    next(error);
};