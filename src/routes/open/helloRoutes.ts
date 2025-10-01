/**
 * Hello World routes for demonstrating HTTP methods
 *
 * Educational routes that implement all five major HTTP methods to show their
 * usage patterns and semantic differences. Each route demonstrates the appropriate
 * use case and behavior for its corresponding HTTP method.
 *
 * @see {@link ../../../docs/api-design-patterns.md#http-method-patterns} for HTTP method patterns
 */

import { Router } from 'express';
import {
    getHello,
    postHello,
    putHello,
    patchHello,
    deleteHello
} from '../../controllers/helloController';

/**
 * @swagger
 * tags:
 *   - name: Hello
 *     description: Hello World API endpoints for demonstrating HTTP methods
 */

export const helloRoutes = Router();

/**
 * @swagger
 * /hello:
 *   get:
 *     summary: Retrieve hello message
 *     description: |
 *       Demonstrates GET method for safe, idempotent data retrieval.
 *
 *       **Educational Focus:**
 *       - GET requests should be safe (no side effects)
 *       - Multiple identical requests have the same effect
 *       - Used for retrieving data without modifying server state
 *     tags: [Hello]
 *     responses:
 *       200:
 *         description: Hello message retrieved successfully
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
 *                           example: "Hello, World!"
 *                         method:
 *                           type: string
 *                           example: "GET"
 *                         description:
 *                           type: string
 *                           example: "GET is used for retrieving data. It's safe and idempotent - multiple requests have the same effect."
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 */
helloRoutes.get('/', getHello);

/**
 * @swagger
 * /hello:
 *   post:
 *     summary: Create hello message
 *     description: |
 *       Demonstrates POST method for resource creation with side effects.
 *
 *       **Educational Focus:**
 *       - POST requests can have side effects
 *       - Not idempotent (repeated requests may create multiple resources)
 *       - Used for creating new resources or submitting data
 *     tags: [Hello]
 *     responses:
 *       201:
 *         description: Hello message created successfully
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
 *                           example: "Hello, World! (Created)"
 *                         method:
 *                           type: string
 *                           example: "POST"
 *                         description:
 *                           type: string
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Invalid request format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
helloRoutes.post('/', postHello);

/**
 * @swagger
 * /hello:
 *   put:
 *     summary: Create or replace hello message
 *     description: |
 *       Demonstrates PUT method for idempotent resource replacement.
 *
 *       **Educational Focus:**
 *       - PUT requests are idempotent
 *       - Replaces entire resource (or creates if doesn't exist)
 *       - Multiple identical requests have the same result
 *     tags: [Hello]
 *     responses:
 *       200:
 *         description: Hello message replaced successfully
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
 *                           example: "Hello, World! (Replaced)"
 *                         method:
 *                           type: string
 *                           example: "PUT"
 *                         description:
 *                           type: string
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 */
helloRoutes.put('/', putHello);

/**
 * @swagger
 * /hello:
 *   patch:
 *     summary: Partially update hello message
 *     description: |
 *       Demonstrates PATCH method for partial resource modifications.
 *
 *       **Educational Focus:**
 *       - PATCH requests modify part of a resource
 *       - More efficient than PUT for small changes
 *       - May or may not be idempotent depending on implementation
 *     tags: [Hello]
 *     responses:
 *       200:
 *         description: Hello message updated successfully
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
 *                           example: "Hello, World! (Updated)"
 *                         method:
 *                           type: string
 *                           example: "PATCH"
 *                         description:
 *                           type: string
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 */
helloRoutes.patch('/', patchHello);

/**
 * @swagger
 * /hello:
 *   delete:
 *     summary: Remove hello message
 *     description: |
 *       Demonstrates DELETE method for idempotent resource removal.
 *
 *       **Educational Focus:**
 *       - DELETE requests are idempotent
 *       - Multiple delete requests have the same effect
 *       - Used for removing resources from the server
 *     tags: [Hello]
 *     responses:
 *       200:
 *         description: Hello message removed successfully
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
 *                           example: "Hello, World! (Deleted)"
 *                         method:
 *                           type: string
 *                           example: "DELETE"
 *                         description:
 *                           type: string
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 */
helloRoutes.delete('/', deleteHello);