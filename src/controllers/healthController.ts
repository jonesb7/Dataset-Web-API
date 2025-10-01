/**
 * Health check controller for API monitoring and status verification
 *
 * Provides endpoints for basic and detailed health checks that can be used
 * by load balancers, monitoring systems, and development tools.
 *
 * @see {@link ../../docs/api-design-patterns.md#health-check-patterns} for health check strategies
 */

import { Request, Response } from 'express';
import { sendSuccess } from '@utilities/responseUtils';
import { HealthResponse } from '@/types';
import { config } from '@utilities/envConfig';
import { asyncHandler } from '@middleware/errorHandler';

// Track application start time for uptime calculation
const startTime = Date.now();

/**
 * Basic health check endpoint
 *
 * Simple health check that returns basic status information.
 * Designed for load balancers and basic monitoring systems.
 *
 * @route GET /health
 */
export const getHealth = asyncHandler(async (request: Request, response: Response): Promise<void> => {
    const healthData: HealthResponse = {
        status: 'OK',
        timestamp: new Date().toISOString()
    };

    sendSuccess(response, healthData, 'API is healthy');
});

/**
 * Detailed health check endpoint
 *
 * Comprehensive health check with system information including
 * uptime, memory usage, and configuration details.
 *
 * @route GET /health/detailed
 */
export const getDetailedHealth = asyncHandler(async (request: Request, response: Response): Promise<void> => {
    const now = Date.now();
    const uptimeMs = now - startTime;

    // Get memory usage information
    const memoryUsage = process.memoryUsage();

    const healthData: HealthResponse = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        details: {
            uptime: uptimeMs,
            memory: {
                used: memoryUsage.heapUsed,
                total: memoryUsage.heapTotal
            },
            version: config.API_VERSION,
            environment: config.NODE_ENV
        }
    };

    sendSuccess(response, healthData, 'Detailed health information');
});