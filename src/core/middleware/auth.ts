import { Request, Response, NextFunction } from 'express';

/**
 * Authentication middleware
 *
 * Validates API key from header ('x-api-key' or 'Authorization: Bearer <key>').
 * Responds with 401 Unauthorized if the key is missing or invalid.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const apiKey =
        (req.headers['x-api-key'] as string) ||
        (req.headers.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1]
            : undefined);

    if (!apiKey || apiKey !== process.env.API_KEY) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized: missing or invalid API key',
            code: 'UNAUTHORIZED',
            timestamp: new Date().toISOString()
        });
        return;
    }

    next();
}
