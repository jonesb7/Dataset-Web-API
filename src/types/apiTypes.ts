/**
 * Generic API response type definitions
 *
 * Standardized response formats for consistent API communication patterns.
 * These types ensure all endpoints return data in a predictable structure
 * that clients can reliably parse and handle.
 *
 * @see {@link ../../docs/api-design-patterns.md#response-formatting} for response patterns
 */

/**
 * Standard API response wrapper for all successful operations
 *
 * Provides consistent structure for API responses with typed data payload,
 * success indicators, and optional metadata for client applications.
 *
 * @template T The type of data being returned in the response (defaults to unknown for type safety)
 */
export interface ApiResponse<T = unknown> {
    /** Indicates successful completion of the requested operation */
    success: boolean;
    /** The actual data payload returned by the API endpoint */
    data: T;
    /** Optional message providing additional context about the operation */
    message?: string;
    /** ISO timestamp of when the response was generated */
    timestamp: string;
}

/**
 * Hello World demonstration response structure
 *
 * Educational response format for hello endpoints that demonstrates
 * HTTP method characteristics and provides descriptive information
 * about each method's purpose and behavior.
 */
export interface HelloResponse {
    /** Greeting message returned by the endpoint */
    message: string;
    /** HTTP method used for the request (GET, POST, PUT, PATCH, DELETE) */
    method: string;
    /** Educational description explaining the HTTP method's characteristics */
    description: string;
    /** ISO timestamp of when the response was generated */
    timestamp: string;
}

/**
 * Parameters demonstration response structure
 *
 * Educational response format for parameter endpoints that demonstrates
 * different ways to pass data to APIs (query, path, body, headers) along
 * with validation information for learning purposes.
 */
export interface ParametersResponse {
    /** Personalized greeting message using the provided name */
    message: string;
    /** Type of parameter demonstrated by this endpoint */
    parameterType: 'query' | 'path' | 'body' | 'header';
    /** The sanitized parameter value that was received */
    parameterValue: string;
    /** Validation metadata for educational purposes */
    validation: {
        /** List of validation rules that were applied */
        applied: string[];
        /** Whether the input value was sanitized for security */
        sanitized: boolean;
    };
    /** Educational description of this parameter type and its use cases */
    description: string;
    /** ISO timestamp of when the response was generated */
    timestamp: string;
}

/**
 * Health check response structure
 *
 * Standardized format for health monitoring endpoints to provide
 * consistent status information for load balancers and monitoring systems.
 */
export interface HealthResponse {
    /** Current operational status of the API service */
    status: 'OK' | 'DEGRADED' | 'DOWN';
    /** ISO timestamp of the health check execution */
    timestamp: string;
    /** Optional system information for detailed health checks */
    details?: {
        /** Current server uptime in milliseconds */
        uptime: number;
        /** Memory usage statistics */
        memory: {
            used: number;
            total: number;
        };
        /** Application version information */
        version: string;
        /** Current environment (development, staging, production) */
        environment: string;
    };
}

/**
 * Paginated response wrapper for list endpoints
 *
 * Standardized pagination structure for endpoints that return collections
 * of data, enabling efficient data transfer and client-side pagination.
 *
 * @template T The type of items in the paginated collection (defaults to unknown for type safety)
 */
export interface PaginatedResponse<T = unknown> {
    /** Array of items for the current page */
    items: T[];
    /** Pagination metadata for client navigation */
    pagination: {
        /** Current page number (1-based) */
        page: number;
        /** Number of items per page */
        limit: number;
        /** Total number of items across all pages */
        total: number;
        /** Total number of pages available */
        pages: number;
        /** Whether there are more pages after the current one */
        hasNext: boolean;
        /** Whether there are pages before the current one */
        hasPrev: boolean;
    };
}