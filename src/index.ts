/**
 * Application entry point with production-ready lifecycle management
 *
 * Handles startup sequence, graceful shutdown, and signal processing for
 * cloud deployment environments. Implements the application bootstrap
 * pattern with proper error handling and resource cleanup.
 *
 * @see {@link ../docs/node-express-architecture.md#application-lifecycle} for lifecycle concepts
 * @see {@link ../docs/environment-configuration.md} for configuration details
 */

// Load environment variables from .env file (must be first)
import 'dotenv/config';

import { createApp } from '@/app';
import { config } from '@utilities/envConfig';

const PORT = config.PORT || 8000;

/**
 * Start the Express application server
 *
 * Initializes the application with all middleware and routes configured,
 * then starts listening on the specified port. Implements graceful startup
 * with proper error handling for production deployments.
 */
const startServer = async (): Promise<void> => {
    try {
        const app = createApp();

        const server = app.listen(PORT, () => {
            console.log(`🚀 HelloWorld API server running on port ${PORT}`);
            console.log(`📚 Environment: ${config.NODE_ENV}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
            console.log(`📖 Documentation: http://localhost:${PORT}/docs`);
        });

        // Graceful shutdown handling for production environments
        const gracefulShutdown = (signal: string) => {
            console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

            server.close((err) => {
                if (err) {
                    console.error('❌ Error during server shutdown:', err);
                    process.exit(1);
                }

                console.log('✅ Server closed successfully');
                console.log('👋 Goodbye!');
                process.exit(0);
            });
        };

        // Register signal handlers for graceful shutdown
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start the application
startServer();