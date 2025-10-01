/**
 * Generic validation middleware for Express routes
 *
 * Provides reusable validation middleware that can be composed with
 * route handlers to validate request data before processing.
 *
 * @see {@link ../../../docs/api-design-patterns.md#validation-middleware} for validation patterns
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ErrorResponse, ErrorCodes, ValidationError } from '@/types';

/**
 * Process validation results and send standardized error responses
 *
 * Middleware that checks for validation errors from express-validator
 * and formats them into consistent API error responses.
 */
export const handleValidationErrors = (
    request: Request,
    response: Response,
    next: NextFunction
): void => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        // Convert express-validator errors to our format
        const validationErrors: ValidationError[] = errors.array().map(error => ({
            field: error.type === 'field' ? (error as any).path : 'unknown',
            message: error.msg,
            value: error.type === 'field' ? (error as any).value : undefined
        }));

        const errorResponse: ErrorResponse = {
            success: false,
            message: 'Validation failed',
            code: ErrorCodes.INVALID_FIELD_VALUE,
            timestamp: new Date().toISOString(),
            validationErrors
        };

        response.status(400).json(errorResponse);
        return;
    }

    next();
};

/**
 * Create validation middleware chain with error handling
 *
 * Combines validation rules with error handling middleware for
 * convenient use in route definitions.
 *
 * @param validations Array of express-validator validation chains
 * @returns Array of middleware functions for route validation
 */
export const validateRequest = (validations: ValidationChain[]) => {
    return [...validations, handleValidationErrors];
};

/**
 * Content-Type validation middleware
 *
 * Ensures that requests contain the expected Content-Type header
 * for endpoints that expect specific content formats.
 */
export const requireJsonContent = (
    request: Request,
    response: Response,
    next: NextFunction
): void => {
    const contentType = request.get('Content-Type');

    // Skip validation for GET requests and requests without body
    if (request.method === 'GET' || !request.body) {
        return next();
    }

    if (!contentType || !contentType.includes('application/json')) {
        const errorResponse: ErrorResponse = {
            success: false,
            message: 'Content-Type must be application/json',
            code: ErrorCodes.INVALID_REQUEST_FORMAT,
            timestamp: new Date().toISOString()
        };

        response.status(400).json(errorResponse);
        return;
    }

    next();
};

/**
 * Request size validation middleware
 *
 * Validates that request body size is within acceptable limits
 * to prevent resource exhaustion attacks.
 */
export const validateRequestSize = (maxSizeBytes: number = 1024 * 1024) => {
    return (request: Request, response: Response, next: NextFunction): void => {
        const contentLength = request.get('Content-Length');

        if (contentLength && parseInt(contentLength) > maxSizeBytes) {
            const errorResponse: ErrorResponse = {
                success: false,
                message: `Request body too large. Maximum size: ${maxSizeBytes} bytes`,
                code: ErrorCodes.PAYLOAD_TOO_LARGE,
                timestamp: new Date().toISOString()
            };

            response.status(413).json(errorResponse);
            return;
        }

        next();
    };
};

/**
 * Query parameter validation helper
 *
 * Validates and parses common query parameters like pagination,
 * sorting, and filtering with proper error handling.
 */
export const validateQueryParams = (
    request: Request,
    response: Response,
    next: NextFunction
): void => {
    const { page, limit, sort } = request.query;

    // Validate pagination parameters
    if (page !== undefined) {
        const pageNum = parseInt(page as string);
        if (isNaN(pageNum) || pageNum < 1) {
            const errorResponse: ErrorResponse = {
                success: false,
                message: 'Page parameter must be a positive integer',
                code: ErrorCodes.INVALID_FIELD_VALUE,
                timestamp: new Date().toISOString()
            };

            response.status(400).json(errorResponse);
            return;
        }
        request.query.page = pageNum.toString();
    }

    if (limit !== undefined) {
        const limitNum = parseInt(limit as string);
        if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
            const errorResponse: ErrorResponse = {
                success: false,
                message: 'Limit parameter must be between 1 and 100',
                code: ErrorCodes.INVALID_FIELD_VALUE,
                timestamp: new Date().toISOString()
            };

            response.status(400).json(errorResponse);
            return;
        }
        request.query.limit = limitNum.toString();
    }

    // Validate sort parameter format
    if (sort !== undefined) {
        const sortStr = sort as string;
        const validSortPattern = /^[a-zA-Z_][a-zA-Z0-9_]*(:asc|:desc)?$/;

        if (!validSortPattern.test(sortStr)) {
            const errorResponse: ErrorResponse = {
                success: false,
                message: 'Sort parameter must be in format: field or field:asc/desc',
                code: ErrorCodes.INVALID_FIELD_VALUE,
                timestamp: new Date().toISOString()
            };

            response.status(400).json(errorResponse);
            return;
        }
    }

    next();
};