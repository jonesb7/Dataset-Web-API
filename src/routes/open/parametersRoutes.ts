/**
 * Parameters demonstration routes for educational API parameter examples
 *
 * Educational routes that demonstrate the four main ways to pass data to web APIs
 * with comprehensive validation, sanitization, and error handling. Each route
 * shows best practices for its specific parameter type.
 *
 * @see {@link ../../../docs/api-design-patterns.md#parameter-patterns} for parameter patterns
 */

import { Router } from 'express';
import { query, param, body, header } from 'express-validator';
import {
    getQueryParameter,
    getPathParameter,
    postBodyParameter,
    getHeaderParameter
} from '@controllers/parametersController';
import { validateRequest, requireJsonContent } from '@middleware/validation';
import { sanitizeString } from '@utilities/validationUtils';

/**
 * @swagger
 * tags:
 *   - name: Parameters
 *     description: Educational demonstrations of API parameter types and validation
 */

export const parametersRoutes = Router();

/**
 * @swagger
 * /parameters/query:
 *   get:
 *     summary: Query parameter demonstration
 *     description: |
 *       Educational endpoint showing query parameter extraction and validation.
 *
 *       **Educational Focus:**
 *       - Query parameters are passed in the URL after the '?' character
 *       - Used for filtering, pagination, or optional data
 *       - Visible in browser address bar and server logs
 *       - Should not contain sensitive information
 *     tags: [Parameters]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: "StudentName"
 *         description: Name parameter to demonstrate query parameter handling
 *     responses:
 *       200:
 *         description: Query parameter processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Successfully processed query parameter: StudentName"
 *                     data:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "StudentName"
 *                         sanitized:
 *                           type: boolean
 *                           example: true
 *                         source:
 *                           type: string
 *                           example: "query parameter"
 *                     validation:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["query parameter extraction", "input sanitization"]
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Validation failed"
 *               code: "INVALID_FIELD_VALUE"
 *               timestamp: "2024-01-15T10:30:00.000Z"
 *               validationErrors:
 *                 - field: "name"
 *                   message: "Name query parameter is required"
 */
parametersRoutes.get('/query',
    validateRequest([
        query('name')
            .notEmpty()
            .withMessage('Name query parameter is required')
            .isLength({ min: 1, max: 50 })
            .withMessage('Name must be between 1 and 50 characters')
            .customSanitizer((value: string) => sanitizeString(value))
            .trim()
    ]),
    getQueryParameter
);

/**
 * @swagger
 * /parameters/path/{name}:
 *   get:
 *     summary: Path parameter demonstration
 *     description: |
 *       Educational endpoint showing path parameter extraction and validation.
 *
 *       **Educational Focus:**
 *       - Path parameters are part of the URL path itself
 *       - Used for identifying specific resources
 *       - Required parameters that define the resource being accessed
 *       - URL-encoded special characters are automatically decoded
 *     tags: [Parameters]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 30
 *           example: "StudentName"
 *         description: Name parameter embedded in URL path
 *     responses:
 *       200:
 *         description: Path parameter processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Successfully processed path parameter: StudentName"
 *                     data:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "StudentName"
 *                         sanitized:
 *                           type: boolean
 *                           example: true
 *                         source:
 *                           type: string
 *                           example: "path parameter"
 *                     validation:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["path parameter extraction", "input sanitization"]
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
parametersRoutes.get('/path/:name',
    validateRequest([
        param('name')
            .notEmpty()
            .withMessage('Name path parameter is required')
            .isLength({ min: 1, max: 100 })
            .withMessage('Name must be between 1 and 100 characters')
            .customSanitizer((value: string) => sanitizeString(value))
            .trim()
    ]),
    getPathParameter
);

/**
 * @swagger
 * /parameters/body:
 *   post:
 *     summary: Request body parameter demonstration
 *     description: |
 *       Educational endpoint showing JSON body parameter extraction and validation.
 *
 *       **Educational Focus:**
 *       - Body parameters are sent in the HTTP request body
 *       - Used for complex data structures and large payloads
 *       - Requires Content-Type: application/json header
 *       - JSON parsing occurs before validation
 *     tags: [Parameters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: "StudentName"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "student@uw.edu"
 *     responses:
 *       200:
 *         description: Request body processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Successfully processed request body parameters"
 *                     data:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "StudentName"
 *                         email:
 *                           type: string
 *                           example: "student@uw.edu"
 *                         sanitized:
 *                           type: boolean
 *                           example: true
 *                         source:
 *                           type: string
 *                           example: "request body"
 *                     validation:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["JSON parsing", "request body extraction", "input sanitization"]
 *       400:
 *         description: Validation error or invalid JSON
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
parametersRoutes.post('/body',
    requireJsonContent,
    validateRequest([
        body('name')
            .notEmpty()
            .withMessage('Name is required in request body')
            .isLength({ min: 1, max: 100 })
            .withMessage('Name must be between 1 and 100 characters')
            .customSanitizer((value: string) => sanitizeString(value))
            .trim()
    ]),
    postBodyParameter
);

/**
 * @swagger
 * /parameters/headers:
 *   get:
 *     summary: Header parameter demonstration
 *     description: |
 *       Educational endpoint showing HTTP header parameter extraction and validation.
 *
 *       **Educational Focus:**
 *       - Headers provide metadata about the request
 *       - Custom headers typically start with X- prefix
 *       - Used for authentication, content negotiation, and custom data
 *       - Headers are case-insensitive but conventionally use kebab-case
 *     tags: [Parameters]
 *     parameters:
 *       - in: header
 *         name: X-Custom-Header
 *         required: false
 *         schema:
 *           type: string
 *           example: "CustomValue"
 *         description: Custom header for demonstration
 *       - in: header
 *         name: X-User-Agent
 *         required: false
 *         schema:
 *           type: string
 *           example: "MyApp/1.0"
 *         description: User agent information
 *     responses:
 *       200:
 *         description: Header parameters processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Successfully processed header parameters"
 *                     data:
 *                       type: object
 *                       properties:
 *                         customHeader:
 *                           type: string
 *                           example: "CustomValue"
 *                         userAgent:
 *                           type: string
 *                           example: "MyApp/1.0"
 *                         sanitized:
 *                           type: boolean
 *                           example: true
 *                         source:
 *                           type: string
 *                           example: "header"
 *                     validation:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["header extraction", "input sanitization"]
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
parametersRoutes.get('/headers',
    validateRequest([
        header('X-User-Name')
            .notEmpty()
            .withMessage('X-User-Name header is required')
            .isLength({ min: 1, max: 50 })
            .withMessage('X-User-Name must be between 1 and 50 characters')
            .customSanitizer((value: string) => sanitizeString(value))
            .trim()
    ]),
    getHeaderParameter
);