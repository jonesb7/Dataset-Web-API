/**
 * Parameters demonstration controller for educational API parameter examples
 *
 * Educational controller that demonstrates the four main ways to pass data
 * to web APIs: query parameters, path parameters, request body, and headers.
 * Each endpoint shows validation, sanitization, and proper usage patterns.
 *
 * @see {@link ../../docs/api-design-patterns.md#parameter-patterns} for parameter patterns
 */

import { Request, Response } from 'express';
import { sendSuccess } from '@utilities/responseUtils';
import { sanitizeString } from '@utilities/validationUtils';
import { asyncHandler } from '@middleware/errorHandler';

/**
 * @swagger
 * components:
 *   schemas:
 *     ParametersResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Personalized greeting message using the provided name
 *         parameterType:
 *           type: string
 *           enum: [query, path, body, header]
 *           description: Type of parameter demonstrated by this endpoint
 *         parameterValue:
 *           type: string
 *           description: The sanitized parameter value that was received
 *         validation:
 *           type: object
 *           properties:
 *             applied:
 *               type: array
 *               items:
 *                 type: string
 *               description: List of validation rules that were applied
 *             sanitized:
 *               type: boolean
 *               description: Whether the input value was sanitized for security
 *         description:
 *           type: string
 *           description: Educational description of this parameter type and its use cases
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: ISO timestamp of when the response was generated
 */

/**
 * Handle GET request with query parameter demonstration
 *
 * Query parameters are the most common way to pass optional data to GET endpoints.
 * They appear after the '?' in the URL and are ideal for filtering, pagination,
 * search terms, and optional configuration. They should be used for non-sensitive
 * data as they appear in URLs and server logs.
 *
 * @swagger
 * /parameters/query:
 *   get:
 *     summary: Demonstrate query parameter usage
 *     description: Shows how to extract and validate data from URL query parameters
 *     tags: [Parameters]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *         description: Name to include in greeting (1-50 characters)
 *     responses:
 *       200:
 *         description: Successful query parameter demonstration
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ParametersResponse'
 *             example:
 *               message: "Hello, John!"
 *               parameterType: "query"
 *               parameterValue: "John"
 *               validation:
 *                 applied: ["required", "length(1-50)", "sanitized"]
 *                 sanitized: true
 *               description: "Query parameters are ideal for optional filters, pagination, and search terms"
 *               timestamp: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Validation error (missing or invalid name parameter)
 *
 * @route GET /parameters/query?name=value
 * @param request Express request object with query parameters
 * @param response Express response object
 */
export const getQueryParameter = asyncHandler(async (request: Request, response: Response): Promise<void> => {
    const originalName = request.query.name as string;
    const sanitizedName = sanitizeString(originalName);

    const data = {
        name: sanitizedName,
        sanitized: true,
        source: 'query parameter'
    };

    const validation = [
        'query parameter extraction',
        'input sanitization'
    ];

    sendSuccess(
        response,
        data,
        `Successfully processed query parameter: ${sanitizedName}`,
        validation
    );
});

/**
 * Handle GET request with path parameter demonstration
 *
 * Path parameters are part of the URL path itself and are ideal for identifying
 * specific resources. They are typically used for IDs, usernames, or other
 * resource identifiers. Path parameters are considered part of the resource
 * location and should represent hierarchical relationships.
 *
 * @swagger
 * /parameters/path/{name}:
 *   get:
 *     summary: Demonstrate path parameter usage
 *     description: Shows how to extract and validate data from URL path segments
 *     tags: [Parameters]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 30
 *           pattern: '^[a-zA-Z0-9\\s]+$'
 *         description: Name to include in greeting (1-30 characters, alphanumeric only)
 *     responses:
 *       200:
 *         description: Successful path parameter demonstration
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ParametersResponse'
 *             example:
 *               message: "Hello, Alice!"
 *               parameterType: "path"
 *               parameterValue: "Alice"
 *               validation:
 *                 applied: ["required", "length(1-30)", "alphanumeric", "sanitized"]
 *                 sanitized: false
 *               description: "Path parameters identify specific resources and represent hierarchical relationships"
 *               timestamp: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Validation error (invalid name format or length)
 *
 * @route GET /parameters/path/:name
 * @param request Express request object with path parameters
 * @param response Express response object
 */
export const getPathParameter = asyncHandler(async (request: Request, response: Response): Promise<void> => {
    const originalName = request.params.name || '';
    const sanitizedName = sanitizeString(originalName);

    const data = {
        name: sanitizedName,
        sanitized: true,
        source: 'path parameter'
    };

    const validation = [
        'path parameter extraction',
        'input sanitization'
    ];

    sendSuccess(
        response,
        data,
        `Successfully processed path parameter: ${sanitizedName}`,
        validation
    );
});

/**
 * Handle POST request with body parameter demonstration
 *
 * Request body parameters are used to send complex data structures to the server.
 * They are ideal for creating or updating resources, sending forms, file uploads,
 * and any scenario where you need to transmit structured data. The body is not
 * visible in URLs and can handle large amounts of data.
 *
 * @swagger
 * /parameters/body:
 *   post:
 *     summary: Demonstrate request body parameter usage
 *     description: Shows how to extract and validate data from JSON request body
 *     tags: [Parameters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 description: Name to include in greeting (1-100 characters)
 *           example:
 *             name: "Bob"
 *     responses:
 *       200:
 *         description: Successful body parameter demonstration
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ParametersResponse'
 *             example:
 *               message: "Hello, Bob!"
 *               parameterType: "body"
 *               parameterValue: "Bob"
 *               validation:
 *                 applied: ["required", "length(1-100)", "json-format", "sanitized"]
 *                 sanitized: true
 *               description: "Request body is ideal for complex data, form submissions, and large payloads"
 *               timestamp: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Validation error (missing name field, invalid JSON, or wrong Content-Type)
 *
 * @route POST /parameters/body
 * @param request Express request object with JSON body
 * @param response Express response object
 */
export const postBodyParameter = asyncHandler(async (request: Request, response: Response): Promise<void> => {
    const originalName = request.body.name;
    const sanitizedName = sanitizeString(originalName);

    // Type-safe data object with explicit structure
    const data: {
        name: string;
        sanitized: boolean;
        source: string;
        description?: string;
        email?: string;
    } = {
        name: sanitizedName,
        sanitized: true,
        source: 'request body'
    };

    // Include any other fields from the request body
    if (request.body.description) {
        data.description = sanitizeString(request.body.description);
    }
    if (request.body.email) {
        data.email = sanitizeString(request.body.email);
    }

    const validation = [
        'JSON parsing',
        'request body extraction',
        'input sanitization'
    ];

    sendSuccess(
        response,
        data,
        `Successfully processed request body: ${sanitizedName}`,
        validation
    );
});

/**
 * Handle GET request with header parameter demonstration
 *
 * Headers are used to pass metadata about the request or specify how the request
 * should be processed. They are ideal for authentication tokens, content-type
 * specifications, API versioning, client information, and other request metadata.
 * Headers are part of the HTTP protocol and should contain operational data.
 *
 * @swagger
 * /parameters/headers:
 *   get:
 *     summary: Demonstrate header parameter usage
 *     description: Shows how to extract and validate data from HTTP headers
 *     tags: [Parameters]
 *     parameters:
 *       - in: header
 *         name: X-User-Name
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *         description: Name to include in greeting via custom header (1-50 characters)
 *     responses:
 *       200:
 *         description: Successful header parameter demonstration
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ParametersResponse'
 *             example:
 *               message: "Hello, Charlie!"
 *               parameterType: "header"
 *               parameterValue: "Charlie"
 *               validation:
 *                 applied: ["required", "length(1-50)", "header-format", "sanitized"]
 *                 sanitized: false
 *               description: "Headers carry metadata like authentication, content-type, and API versioning"
 *               timestamp: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Validation error (missing X-User-Name header or invalid format)
 *
 * @route GET /parameters/headers
 * @param request Express request object with custom headers
 * @param response Express response object
 */
export const getHeaderParameter = asyncHandler(async (request: Request, response: Response): Promise<void> => {
    const originalName = request.get('X-User-Name') || '';
    const sanitizedName = sanitizeString(originalName);

    const data = {
        xUserName: sanitizedName,
        sanitized: true,
        source: 'header'
    };

    const validation = [
        'header extraction',
        'input sanitization'
    ];

    sendSuccess(
        response,
        data,
        `Successfully processed header: ${sanitizedName}`,
        validation
    );
});