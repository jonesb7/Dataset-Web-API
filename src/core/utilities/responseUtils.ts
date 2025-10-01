/**
 * Standardized API response utilities for consistent client communication
 *
 * Provides helper functions for creating properly formatted API responses
 * that follow consistent patterns for success, error, and pagination scenarios.
 *
 * @see {@link ../../../docs/api-design-patterns.md#response-formatting} for response patterns
 */

import { Response } from 'express';
import { ApiResponse, ErrorResponse, PaginatedResponse, ErrorCodes } from '@/types';

/**
 * Send successful API response with standardized format
 *
 * Creates consistent success responses with proper HTTP status codes
 * and standardized JSON structure for reliable client parsing.
 *
 * @param response Express response object
 * @param data The data payload to return
 * @param message Optional success message
 * @param validation Optional validation array for educational responses
 * @param statusCode HTTP status code (default: 200)
 */
export const sendSuccess = <T>(
    response: Response,
    data: T,
    message?: string,
    validation?: string[] | number,
    statusCode?: number
): void => {
    // Handle overloaded parameters (validation could be statusCode if it's a number)
    let actualStatusCode = 200;
    let actualValidation: string[] | undefined;

    if (typeof validation === 'number') {
        actualStatusCode = validation;
        actualValidation = undefined;
    } else {
        actualValidation = validation;
        actualStatusCode = statusCode || 200;
    }

    const apiResponse: ApiResponse<T> = {
        success: true,
        data,
        ...(message && { message }),
        ...(actualValidation && { validation: actualValidation }),
        timestamp: new Date().toISOString()
    };

    response.status(actualStatusCode).json(apiResponse);
};

/**
 * Send error response with standardized format and error codes
 *
 * Creates consistent error responses with proper HTTP status codes,
 * error codes for programmatic handling, and optional validation details.
 *
 * @param response Express response object
 * @param statusCode HTTP status code
 * @param message Human-readable error message
 * @param errorCode Machine-readable error code
 * @param details Optional additional error details
 */
export const sendError = (
    response: Response,
    statusCode: number,
    message: string,
    errorCode: ErrorCodes,
    details?: any
): void => {
    const errorResponse: ErrorResponse = {
        success: false,
        message,
        code: errorCode,
        timestamp: new Date().toISOString(),
        details
    };

    response.status(statusCode).json(errorResponse);
};

/**
 * Send paginated response with metadata for client navigation
 *
 * Creates paginated responses with comprehensive pagination metadata
 * enabling efficient client-side navigation and data management.
 *
 * @param response Express response object
 * @param items Array of items for current page
 * @param page Current page number (1-based)
 * @param limit Items per page
 * @param total Total number of items across all pages
 */
export const sendPaginated = <T>(
    response: Response,
    items: T[],
    page: number,
    limit: number,
    total: number
): void => {
    const pages = Math.ceil(total / limit);

    const paginatedResponse: PaginatedResponse<T> = {
        items,
        pagination: {
            page,
            limit,
            total,
            pages,
            hasNext: page < pages,
            hasPrev: page > 1
        }
    };

    sendSuccess(response, paginatedResponse);
};

/**
 * Common error response helpers for frequent HTTP status codes
 *
 * Convenience functions that pre-configure common error scenarios
 * with appropriate status codes and error types.
 */
export const ErrorResponses = {
    /**
     * Send 400 Bad Request error
     */
    badRequest: (response: Response, message: string = 'Bad Request', details?: any): void => {
        sendError(response, 400, message, ErrorCodes.BAD_REQUEST, details);
    },

    /**
     * Send 401 Unauthorized error
     */
    unauthorized: (response: Response, message: string = 'Unauthorized'): void => {
        sendError(response, 401, message, ErrorCodes.UNAUTHORIZED);
    },

    /**
     * Send 403 Forbidden error
     */
    forbidden: (response: Response, message: string = 'Forbidden'): void => {
        sendError(response, 403, message, ErrorCodes.FORBIDDEN);
    },

    /**
     * Send 404 Not Found error
     */
    notFound: (response: Response, message: string = 'Resource not found'): void => {
        sendError(response, 404, message, ErrorCodes.NOT_FOUND);
    },

    /**
     * Send 500 Internal Server Error
     */
    internalError: (response: Response, message: string = 'Internal Server Error', details?: any): void => {
        sendError(response, 500, message, ErrorCodes.INTERNAL_ERROR, details);
    },

    /**
     * Send 503 Service Unavailable error
     */
    serviceUnavailable: (response: Response, message: string = 'Service Unavailable'): void => {
        sendError(response, 503, message, ErrorCodes.SERVICE_UNAVAILABLE);
    }
};