/**
 * Hello World controller for demonstrating HTTP methods
 *
 * Educational controller that implements all five major HTTP methods
 * (GET, POST, PUT, PATCH, DELETE) to demonstrate their usage and semantics.
 * Each method returns a description of its purpose and typical use cases.
 *
 * @see {@link ../../docs/api-design-patterns.md#http-methods} for HTTP method patterns
 */

import { Request, Response } from 'express';
import { sendSuccess } from '@utilities/responseUtils';
import { HelloResponse } from '@/types';
import { asyncHandler } from '@middleware/errorHandler';

/**
 * @swagger
 * components:
 *   schemas:
 *     HelloResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Greeting message returned by the endpoint
 *         method:
 *           type: string
 *           description: HTTP method used for the request (GET, POST, PUT, PATCH, DELETE)
 *         description:
 *           type: string
 *           description: Educational description explaining the HTTP method's characteristics
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: ISO timestamp of when the response was generated
 */

/**
 * Handle GET request to hello endpoint
 *
 * GET is used for retrieving data without side effects. It should be safe
 * and idempotent, meaning multiple identical requests should have the same
 * effect as a single request.
 *
 * @swagger
 * /hello:
 *   get:
 *     summary: Retrieve hello message using GET method
 *     description: Demonstrates the GET HTTP method for data retrieval
 *     tags:
 *       - Hello
 *     responses:
 *       200:
 *         description: Successful response with hello message
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/HelloResponse'
 *             example:
 *               message: "Hello, World!"
 *               method: "GET"
 *               description: "GET is used for retrieving data. It's safe and idempotent."
 *               timestamp: "2024-01-15T10:30:00.000Z"
 *
 * @route GET /hello
 * @param request Express request object
 * @param response Express response object
 */
export const getHello = asyncHandler(async (request: Request, response: Response): Promise<void> => {
    const helloData: HelloResponse = {
        message: 'Hello, World!',
        method: 'GET',
        description: 'GET is used for retrieving data. It\'s safe and idempotent - multiple requests have the same effect.',
        timestamp: new Date().toISOString()
    };

    sendSuccess(response, helloData, 'Hello message retrieved successfully');
});

/**
 * Handle POST request to hello endpoint
 *
 * POST is used for creating new resources or submitting data. It typically
 * has side effects and is not idempotent - multiple identical requests
 * may have different effects.
 *
 * @swagger
 * /hello:
 *   post:
 *     summary: Create or submit hello message using POST method
 *     description: Demonstrates the POST HTTP method for data creation/submission
 *     tags:
 *       - Hello
 *     responses:
 *       201:
 *         description: Successful creation response
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/HelloResponse'
 *             example:
 *               message: "Hello, World!"
 *               method: "POST"
 *               description: "POST is used for creating resources or submitting data with side effects."
 *               timestamp: "2024-01-15T10:30:00.000Z"
 *
 * @route POST /hello
 * @param request Express request object
 * @param response Express response object
 */
export const postHello = asyncHandler(async (request: Request, response: Response): Promise<void> => {
    const helloData: HelloResponse = {
        message: 'Hello, World!',
        method: 'POST',
        description: 'POST is used for creating resources or submitting data. It has side effects and is not idempotent.',
        timestamp: new Date().toISOString()
    };

    sendSuccess(response, helloData, 'Hello message created successfully', 201);
});

/**
 * Handle PUT request to hello endpoint
 *
 * PUT is used for creating or completely replacing a resource. It should be
 * idempotent - multiple identical requests should have the same effect.
 * PUT typically replaces the entire resource.
 *
 * @swagger
 * /hello:
 *   put:
 *     summary: Create or replace hello message using PUT method
 *     description: Demonstrates the PUT HTTP method for resource creation/replacement
 *     tags:
 *       - Hello
 *     responses:
 *       200:
 *         description: Successful replacement response
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/HelloResponse'
 *             example:
 *               message: "Hello, World!"
 *               method: "PUT"
 *               description: "PUT is used for creating or completely replacing resources. It's idempotent."
 *               timestamp: "2024-01-15T10:30:00.000Z"
 *
 * @route PUT /hello
 * @param request Express request object
 * @param response Express response object
 */
export const putHello = asyncHandler(async (request: Request, response: Response): Promise<void> => {
    const helloData: HelloResponse = {
        message: 'Hello, World!',
        method: 'PUT',
        description: 'PUT is used for creating or completely replacing resources. It\'s idempotent and replaces entire resources.',
        timestamp: new Date().toISOString()
    };

    sendSuccess(response, helloData, 'Hello message replaced successfully');
});

/**
 * Handle PATCH request to hello endpoint
 *
 * PATCH is used for partial updates to a resource. Unlike PUT, it modifies
 * only specific fields rather than replacing the entire resource. PATCH
 * operations may or may not be idempotent depending on implementation.
 *
 * @swagger
 * /hello:
 *   patch:
 *     summary: Partially update hello message using PATCH method
 *     description: Demonstrates the PATCH HTTP method for partial resource updates
 *     tags:
 *       - Hello
 *     responses:
 *       200:
 *         description: Successful partial update response
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/HelloResponse'
 *             example:
 *               message: "Hello, World!"
 *               method: "PATCH"
 *               description: "PATCH is used for partial updates to resources, modifying specific fields."
 *               timestamp: "2024-01-15T10:30:00.000Z"
 *
 * @route PATCH /hello
 * @param request Express request object
 * @param response Express response object
 */
export const patchHello = asyncHandler(async (request: Request, response: Response): Promise<void> => {
    const helloData: HelloResponse = {
        message: 'Hello, World!',
        method: 'PATCH',
        description: 'PATCH is used for partial updates to resources. It modifies specific fields rather than replacing entire resources.',
        timestamp: new Date().toISOString()
    };

    sendSuccess(response, helloData, 'Hello message updated successfully');
});

/**
 * Handle DELETE request to hello endpoint
 *
 * DELETE is used for removing resources. It should be idempotent - deleting
 * a resource multiple times should have the same effect as deleting it once.
 * After successful deletion, subsequent DELETE requests typically return 404.
 *
 * @swagger
 * /hello:
 *   delete:
 *     summary: Remove hello message using DELETE method
 *     description: Demonstrates the DELETE HTTP method for resource removal
 *     tags:
 *       - Hello
 *     responses:
 *       200:
 *         description: Successful deletion response
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/HelloResponse'
 *             example:
 *               message: "Goodbye, World!"
 *               method: "DELETE"
 *               description: "DELETE is used for removing resources. It's idempotent."
 *               timestamp: "2024-01-15T10:30:00.000Z"
 *
 * @route DELETE /hello
 * @param request Express request object
 * @param response Express response object
 */
export const deleteHello = asyncHandler(async (request: Request, response: Response): Promise<void> => {
    const helloData: HelloResponse = {
        message: 'Goodbye, World!',
        method: 'DELETE',
        description: 'DELETE is used for removing resources. It\'s idempotent - multiple deletions have the same effect.',
        timestamp: new Date().toISOString()
    };

    sendSuccess(response, helloData, 'Hello message deleted successfully');
});