/**
 * Error handling type definitions and standardized error codes
 *
 * Comprehensive error handling system providing consistent error responses
 * and standardized error codes for reliable client-side error handling.
 *
 * @see {@link ../../docs/error-handling-patterns.md} for error handling strategies
 */

/**
 * Standardized API error response structure
 *
 * Consistent error format that provides structured information about
 * failures, enabling clients to handle errors programmatically.
 */
export interface ErrorResponse {
    /** Always false to indicate an error occurred */
    success: false;
    /** Human-readable error message for display purposes */
    message: string;
    /** Machine-readable error code for programmatic handling */
    code: string;
    /** ISO timestamp of when the error occurred */
    timestamp: string;
    /** Optional additional error details for debugging (type must be checked before use) */
    details?: unknown;
    /** Optional field-specific validation errors */
    validationErrors?: ValidationError[];
}

/**
 * Validation error details for form field errors
 *
 * Structured validation error information that maps specific
 * field validation failures to user-friendly error messages.
 */
export interface ValidationError {
    /** Name of the field that failed validation */
    field: string;
    /** Human-readable validation error message */
    message: string;
    /** The value that failed validation (type must be checked before use) */
    value?: unknown;
}

/**
 * Standardized error codes for consistent error handling
 *
 * Enumeration of all possible error conditions that can occur
 * in the API, enabling clients to handle specific error types
 * programmatically rather than parsing error messages.
 */
export enum ErrorCodes {
    // General HTTP errors
    /** Resource not found (404) */
    NOT_FOUND = 'NOT_FOUND',
    /** Unauthorized access (401) */
    UNAUTHORIZED = 'UNAUTHORIZED',
    /** Forbidden operation (403) */
    FORBIDDEN = 'FORBIDDEN',
    /** Bad request format (400) */
    BAD_REQUEST = 'BAD_REQUEST',
    /** Internal server error (500) */
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    /** Service temporarily unavailable (503) */
    SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

    // Validation errors
    /** Required field is missing */
    MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
    /** Field value is invalid */
    INVALID_FIELD_VALUE = 'INVALID_FIELD_VALUE',
    /** Request body format is invalid */
    INVALID_REQUEST_FORMAT = 'INVALID_REQUEST_FORMAT',

    // Rate limiting and resource errors
    /** Too many requests from client */
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
    /** Request payload too large */
    PAYLOAD_TOO_LARGE = 'PAYLOAD_TOO_LARGE',

    // Business logic errors (extend as needed)
    /** Requested operation is not allowed */
    OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
    /** Resource already exists */
    RESOURCE_EXISTS = 'RESOURCE_EXISTS',
    /** Resource is in invalid state for operation */
    INVALID_STATE = 'INVALID_STATE'
}