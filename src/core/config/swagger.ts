/**
 * Swagger/OpenAPI configuration for API documentation
 *
 * Configures swagger-jsdoc to generate OpenAPI 3.0 specification from JSDoc comments
 * and provides centralized documentation settings for the HelloWorld API.
 *
 * @see {@link ../../../docs/api-design-patterns.md#api-documentation} for documentation patterns
 */

import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '@utilities/envConfig';

/**
 * OpenAPI 3.0 specification configuration
 *
 * Defines the base API metadata, servers, and documentation structure
 * for the TCSS-460 HelloWorld API educational project.
 */
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'TCSS-460 HelloWorld API',
        version: '1.0.0',
        description: `
Educational REST API demonstrating modern Node.js/Express/TypeScript patterns for TCSS-460.

This API showcases:
- HTTP method semantics (GET, POST, PUT, PATCH, DELETE)
- Request parameter types (query, path, body, headers)
- Input validation and sanitization
- Standardized response formats
- Error handling patterns
- API documentation with OpenAPI/Swagger

**Learning Objectives:**
- Understand RESTful API design principles
- Practice HTTP protocol fundamentals
- Implement proper input validation
- Create consistent API responses
- Document APIs for maintainability
        `,
        contact: {
            name: 'TCSS-460 Course',
            email: 'tcss460@uw.edu',
            url: 'https://www.washington.edu/students/crscat/tcss.html'
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
        },
        termsOfService: 'https://www.washington.edu/online/terms/'
    },
    servers: [
        {
            url: `http://localhost:${config.PORT || 8000}`,
            description: 'Development server'
        },
        {
            url: 'https://tcss460-api.herokuapp.com',
            description: 'Production server (example)'
        }
    ],
    tags: [
        {
            name: 'Health',
            description: 'System health and status endpoints'
        },
        {
            name: 'Hello',
            description: 'HTTP method demonstration endpoints'
        },
        {
            name: 'Parameters',
            description: 'Request parameter type demonstration endpoints'
        }
    ],
    components: {
        schemas: {
            ApiResponse: {
                type: 'object',
                required: ['success', 'timestamp'],
                properties: {
                    success: {
                        type: 'boolean',
                        description: 'Indicates if the request was successful'
                    },
                    data: {
                        description: 'Response payload data'
                    },
                    message: {
                        type: 'string',
                        description: 'Optional human-readable message'
                    },
                    timestamp: {
                        type: 'string',
                        format: 'date-time',
                        description: 'ISO 8601 timestamp of the response'
                    }
                }
            },
            ErrorResponse: {
                type: 'object',
                required: ['success', 'message', 'code', 'timestamp'],
                properties: {
                    success: {
                        type: 'boolean',
                        enum: [false],
                        description: 'Always false for error responses'
                    },
                    message: {
                        type: 'string',
                        description: 'Human-readable error message'
                    },
                    code: {
                        type: 'string',
                        enum: [
                            'BAD_REQUEST',
                            'UNAUTHORIZED',
                            'FORBIDDEN',
                            'NOT_FOUND',
                            'INVALID_REQUEST_FORMAT',
                            'INVALID_FIELD_VALUE',
                            'PAYLOAD_TOO_LARGE',
                            'INTERNAL_ERROR',
                            'SERVICE_UNAVAILABLE'
                        ],
                        description: 'Machine-readable error code'
                    },
                    timestamp: {
                        type: 'string',
                        format: 'date-time',
                        description: 'ISO 8601 timestamp of the error'
                    },
                    details: {
                        description: 'Additional error details (development only)'
                    },
                    validationErrors: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/ValidationError'
                        },
                        description: 'Array of field validation errors'
                    }
                }
            },
            ValidationError: {
                type: 'object',
                required: ['field', 'message'],
                properties: {
                    field: {
                        type: 'string',
                        description: 'Name of the field that failed validation'
                    },
                    message: {
                        type: 'string',
                        description: 'Validation error message'
                    },
                    value: {
                        description: 'The invalid value that was provided'
                    }
                }
            },
            HealthStatus: {
                type: 'object',
                required: ['status', 'timestamp'],
                properties: {
                    status: {
                        type: 'string',
                        enum: ['OK', 'WARNING', 'ERROR'],
                        description: 'Overall system health status'
                    },
                    timestamp: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Timestamp of health check'
                    },
                    uptime: {
                        type: 'number',
                        description: 'Server uptime in seconds'
                    },
                    version: {
                        type: 'string',
                        description: 'API version'
                    },
                    environment: {
                        type: 'string',
                        enum: ['development', 'staging', 'production'],
                        description: 'Current environment'
                    }
                }
            }
        }
    }
};

/**
 * Swagger JSDoc options configuration
 *
 * Configures the swagger-jsdoc parser to scan route files and
 * extract OpenAPI documentation from JSDoc comments.
 */
const swaggerOptions = {
    definition: swaggerDefinition,
    apis: [
        './src/routes/**/*.ts',
        './src/controllers/**/*.ts'
    ]
};

/**
 * Generate OpenAPI specification from JSDoc comments
 *
 * Creates the complete API specification by parsing JSDoc comments
 * from route and controller files and combining with base configuration.
 */
export const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * Swagger UI configuration options
 *
 * Customizes the Swagger UI interface with educational branding
 * and user-friendly settings for students.
 */
export const swaggerUiOptions = {
    customCss: `
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info .title { color: #4b2e83; }
        .swagger-ui .info .description { font-size: 14px; line-height: 1.6; }
        .swagger-ui .scheme-container { background: #f8f9fa; padding: 10px; }
    `,
    customSiteTitle: 'TCSS-460 HelloWorld API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
        docExpansion: 'list',
        filter: true,
        showRequestHeaders: true,
        showCommonExtensions: true,
        tryItOutEnabled: true
    }
};