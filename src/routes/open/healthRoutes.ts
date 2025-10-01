/**
 * Health check routes for API monitoring
 *
 * Defines endpoints for basic and detailed health monitoring that
 * can be used by load balancers, monitoring systems, and developers.
 *
 * @see {@link ../../../docs/api-design-patterns.md#health-endpoints} for health endpoint patterns
 */

import { Router } from 'express';
import { getHealth, getDetailedHealth } from '@controllers/healthController';

export const healthRoutes = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Basic health check
 *     description: Returns simple health status for load balancer health checks
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/HealthStatus'
 *             example:
 *               success: true
 *               data:
 *                 status: "OK"
 *                 timestamp: "2024-01-15T10:30:00.000Z"
 *               message: "API is healthy"
 *               timestamp: "2024-01-15T10:30:00.000Z"
 *       503:
 *         description: API is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   options:
 *     summary: CORS preflight request
 *     description: |
 *       Handles CORS preflight requests for cross-origin access.
 *
 *       **Educational Focus:**
 *       - CORS (Cross-Origin Resource Sharing) allows web apps from different domains to access this API
 *       - Browsers send OPTIONS requests before actual requests (preflight)
 *       - Returns 204 No Content for allowed origins
 *       - Returns 403 Forbidden for disallowed origins
 *     tags: [Health]
 *     parameters:
 *       - in: header
 *         name: Origin
 *         required: true
 *         schema:
 *           type: string
 *           example: "http://localhost:3000"
 *         description: Origin of the requesting application
 *     responses:
 *       204:
 *         description: CORS preflight successful
 *         headers:
 *           Access-Control-Allow-Origin:
 *             schema:
 *               type: string
 *             description: Allowed origin
 *           Access-Control-Allow-Methods:
 *             schema:
 *               type: string
 *             description: Allowed HTTP methods
 *           Access-Control-Allow-Headers:
 *             schema:
 *               type: string
 *             description: Allowed request headers
 *           Access-Control-Allow-Credentials:
 *             schema:
 *               type: boolean
 *             description: Whether credentials are allowed
 *       403:
 *         description: Origin not allowed by CORS policy
 */
healthRoutes.get('/', getHealth);

/**
 * @swagger
 * /health/detailed:
 *   get:
 *     summary: Detailed health information
 *     description: Returns comprehensive health information including uptime, version, and environment details
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed health information
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/HealthStatus'
 *                         - type: object
 *                           properties:
 *                             uptime:
 *                               type: number
 *                               description: Server uptime in seconds
 *                             version:
 *                               type: string
 *                               description: API version
 *                             environment:
 *                               type: string
 *                               description: Current environment
 *             example:
 *               success: true
 *               data:
 *                 status: "OK"
 *                 timestamp: "2024-01-15T10:30:00.000Z"
 *                 uptime: 3600
 *                 version: "1.0.0"
 *                 environment: "development"
 *               message: "API is healthy with detailed information"
 *               timestamp: "2024-01-15T10:30:00.000Z"
 */
healthRoutes.get('/detailed', getDetailedHealth);