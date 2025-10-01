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
 *                     data:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "Hello, StudentName! This came from a query parameter."
 *                         parameterType:
 *                           type: string
 *                           example: "query"
 *                         parameterValue:
 *                           type: string
 *                           example: "StudentName"
 *                         validation:
 *                           type: object
 *                           properties:
 *                             applied:
 *                               type: array
 *                               items:
 *                                 type: string
 *                               example: ["required", "length", "sanitization"]
 *                             sanitized:
 *                               type: boolean
 *                               example: true
 *                         description:
 *                           type: string
 *                         timestamp:
 *                           type: string
 *                           format: date-time
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
 *     description: Educational endpoint showing path parameter extraction and validation
 *     tags: [Parameters]
 */
parametersRoutes.get('/path/:name',
    validateRequest([
        param('name')
            .notEmpty()
            .withMessage('Name path parameter is required')
            .isLength({ min: 1, max: 30 })
            .withMessage('Name must be between 1 and 30 characters')
            .matches(/^[a-zA-Z0-9\s]+$/)
            .withMessage('Name must contain only letters, numbers, and spaces')
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
 *     description: Educational endpoint showing JSON body parameter extraction and validation
 *     tags: [Parameters]
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
 *     description: Educational endpoint showing HTTP header parameter extraction and validation
 *     tags: [Parameters]
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