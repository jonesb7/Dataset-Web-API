import { Request, Response, NextFunction } from 'express';

/**
 * Authentication middleware
 *
 * Validates incoming requests using API key authorization.
 * Checks either 'x-api-key' header or 'Authorization: Bearer <key>'.
 * If valid, continues request; otherwise returns 401 Unauthorized.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const apiKey =
        (req.headers['x-api-key'] as string) ||
        (req.headers.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1]
            : undefined);

    if (!apiKey || apiKey !== process.env.API_KEY) {
        res.status(401).json({ error: 'Unauthorized: missing or invalid API key' });
        return; // ✅ ensure consistent return type (void)
    }

    next();
}
