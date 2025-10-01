/**
 * Documentation Routes
 *
 * Serves markdown documentation files as HTML with syntax highlighting
 * and provides both rendered and raw file access.
 *
 * Educational demonstrations:
 * - Static file serving with dynamic processing
 * - Content type handling (text/html vs text/plain)
 * - Path parameter validation and sanitization
 * - File system security (path traversal prevention)
 */

import { Router, Request, Response } from 'express';
import { param } from 'express-validator';
import path from 'path';
import fs from 'fs';

import { handleValidationErrors } from '@/core/middleware/validation';
import { readMarkdownFile, generateDocsIndex } from '@/core/utilities/markdownUtils';

const router = Router();

/**
 * Documentation index page
 *
 * @swagger
 * /docs:
 *   get:
 *     summary: Documentation index page
 *     description: |
 *       Displays an index of all available documentation files with links
 *       to both rendered HTML and raw markdown versions.
 *
 *       **Educational Focus:**
 *       - Dynamic content generation from file system
 *       - HTML response with navigation
 *       - Integration with existing API documentation
 *     tags: [Documentation]
 *     responses:
 *       200:
 *         description: Documentation index page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Complete HTML page with documentation index
 */
router.get('/', (request: Request, response: Response) => {
    try {
        const docsPath = path.join(__dirname, '../../../docs');
        const indexHtml = generateDocsIndex(docsPath);

        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.send(indexHtml);
    } catch (error) {
        console.error('Error generating docs index:', error);
        response.status(500).json({
            success: false,
            message: 'Failed to generate documentation index',
            code: 'DOCS_INDEX_ERROR',
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * Serve raw markdown files
 *
 * @swagger
 * /docs/raw/{filename}:
 *   get:
 *     summary: Serve raw markdown file
 *     description: |
 *       Returns the raw markdown content of documentation files.
 *       Useful for downloading or viewing source markdown.
 *
 *       **Educational Focus:**
 *       - Content-Type header for plain text
 *       - File serving with proper MIME types
 *       - Path parameter validation for security
 *     tags: [Documentation]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-zA-Z0-9_-]+\.md$'
 *           example: 'API_DOCUMENTATION.md'
 *         description: Name of the markdown file to retrieve
 *     responses:
 *       200:
 *         description: Raw markdown content
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               description: Raw markdown file content
 *       404:
 *         description: Documentation file not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Documentation file 'example.md' not found"
 *                 code:
 *                   type: string
 *                   example: 'DOCS_FILE_NOT_FOUND'
 *                 timestamp:
 *                   type: string
 *                   example: '2024-01-15T10:30:00.000Z'
 *       400:
 *         description: Invalid filename format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Invalid file path'
 *                 code:
 *                   type: string
 *                   example: 'INVALID_PATH'
 *                 timestamp:
 *                   type: string
 *                   example: '2024-01-15T10:30:00.000Z'
 */
router.get('/raw/:filename',
    [
        param('filename')
            .matches(/^[a-zA-Z0-9_-]+\.md$/)
            .withMessage('Filename must be a valid markdown file (alphanumeric, underscores, hyphens only)')
    ],
    handleValidationErrors,
    (request: Request, response: Response): void => {
        try {
            const filename = request.params.filename;
            if (!filename) {
                response.status(400).json({
                    success: false,
                    message: 'Filename parameter is required',
                    code: 'MISSING_FILENAME',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            const docsPath = path.join(__dirname, '../../../docs');
            const filePath = path.join(docsPath, filename);

            // Security check: ensure the resolved path is within docs directory
            const resolvedPath = path.resolve(filePath);
            const resolvedDocsPath = path.resolve(docsPath);

            if (!resolvedPath.startsWith(resolvedDocsPath)) {
                response.status(400).json({
                    success: false,
                    message: 'Invalid file path',
                    code: 'INVALID_PATH',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            if (!fs.existsSync(filePath)) {
                response.status(404).json({
                    success: false,
                    message: `Documentation file '${filename}' not found`,
                    code: 'DOCS_FILE_NOT_FOUND',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            const markdownContent = fs.readFileSync(filePath, 'utf8');

            response.setHeader('Content-Type', 'text/plain; charset=utf-8');
            response.setHeader('Content-Disposition', `inline; filename="${filename}"`);
            response.send(markdownContent);

        } catch (error) {
            console.error('Error serving raw markdown file:', error);
            response.status(500).json({
                success: false,
                message: 'Failed to serve documentation file',
                code: 'DOCS_SERVE_ERROR',
                timestamp: new Date().toISOString()
            });
        }
    }
);

/**
 * Serve rendered markdown files as HTML
 *
 * @swagger
 * /docs/{filename}:
 *   get:
 *     summary: Serve rendered markdown file as HTML
 *     description: |
 *       Converts markdown documentation to HTML with syntax highlighting
 *       and styled presentation. Provides a user-friendly reading experience.
 *
 *       **Educational Focus:**
 *       - Markdown to HTML conversion
 *       - Syntax highlighting for code blocks
 *       - CSS styling for documentation
 *       - Content transformation pipelines
 *     tags: [Documentation]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-zA-Z0-9_-]+\.md$'
 *           example: 'API_DOCUMENTATION.md'
 *         description: Name of the markdown file to render
 *     responses:
 *       200:
 *         description: Rendered HTML documentation
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Complete HTML page with styled documentation
 *       404:
 *         description: Documentation file not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Documentation file 'example.md' not found"
 *                 code:
 *                   type: string
 *                   example: 'DOCS_FILE_NOT_FOUND'
 *                 timestamp:
 *                   type: string
 *                   example: '2024-01-15T10:30:00.000Z'
 *       400:
 *         description: Invalid filename format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Invalid file path'
 *                 code:
 *                   type: string
 *                   example: 'INVALID_PATH'
 *                 timestamp:
 *                   type: string
 *                   example: '2024-01-15T10:30:00.000Z'
 */
router.get('/:filename',
    [
        param('filename')
            .matches(/^[a-zA-Z0-9_-]+\.md$/)
            .withMessage('Filename must be a valid markdown file (alphanumeric, underscores, hyphens only)')
    ],
    handleValidationErrors,
    (request: Request, response: Response): void => {
        try {
            const filename = request.params.filename;
            if (!filename) {
                response.status(400).json({
                    success: false,
                    message: 'Filename parameter is required',
                    code: 'MISSING_FILENAME',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            const docsPath = path.join(__dirname, '../../../docs');
            const filePath = path.join(docsPath, filename);

            // Security check: ensure the resolved path is within docs directory
            const resolvedPath = path.resolve(filePath);
            const resolvedDocsPath = path.resolve(docsPath);

            if (!resolvedPath.startsWith(resolvedDocsPath)) {
                response.status(400).json({
                    success: false,
                    message: 'Invalid file path',
                    code: 'INVALID_PATH',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            const htmlContent = readMarkdownFile(filePath);

            if (!htmlContent) {
                response.status(404).json({
                    success: false,
                    message: `Documentation file '${filename}' not found`,
                    code: 'DOCS_FILE_NOT_FOUND',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            response.setHeader('Content-Type', 'text/html; charset=utf-8');
            response.send(htmlContent);

        } catch (error) {
            console.error('Error serving rendered markdown file:', error);
            response.status(500).json({
                success: false,
                message: 'Failed to render documentation file',
                code: 'DOCS_RENDER_ERROR',
                timestamp: new Date().toISOString()
            });
        }
    }
);

export default router;