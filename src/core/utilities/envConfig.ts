/**
 * Environment configuration management with type safety and validation
 *
 * Centralizes all environment variable access with proper type conversion,
 * validation, and default values. Ensures consistent configuration handling
 * across all application components.
 *
 * @see {@link ../../../docs/environment-configuration.md} for configuration patterns
 */

/**
 * Application configuration interface
 *
 * Type-safe configuration object that defines all available environment
 * variables with their expected types and validation rules.
 */
interface Config {
    /** Server port number (default: 8000) */
    PORT: number;
    /** Application environment (development, staging, production) */
    NODE_ENV: string;
    /** CORS allowed origins (comma-separated URLs) */
    CORS_ORIGINS: string[];
    /** Request body size limit (default: 10mb) */
    BODY_LIMIT: string;
    /** Enable request logging (default: true) */
    ENABLE_LOGGING: boolean;
    /** API version identifier */
    API_VERSION: string;
}

/**
 * Parse and validate environment variables with proper type conversion
 *
 * Converts string environment variables to appropriate types with validation
 * and provides sensible defaults for development environments.
 */
const parseConfig = (): Config => {
    // Helper function to parse boolean environment variables
    const parseBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
        if (value === undefined) return defaultValue;
        return value.toLowerCase() === 'true';
    };

    // Helper function to parse comma-separated arrays
    const parseArray = (value: string | undefined, defaultValue: string[]): string[] => {
        if (!value) return defaultValue;
        return value.split(',').map(item => item.trim()).filter(Boolean);
    };

    // Helper function to parse integer values
    const parseInteger = (value: string | undefined, defaultValue: number): number => {
        if (!value) return defaultValue;
        const parsed = parseInt(value, 10);
        if (isNaN(parsed)) {
            console.warn(`Invalid integer value for environment variable: ${value}, using default: ${defaultValue}`);
            return defaultValue;
        }
        return parsed;
    };

    return {
        PORT: parseInteger(process.env.PORT, 8000),
        NODE_ENV: process.env.NODE_ENV || 'development',
        CORS_ORIGINS: parseArray(process.env.CORS_ORIGINS, ['http://localhost:3000', 'http://localhost:8000']),
        BODY_LIMIT: process.env.BODY_LIMIT || '10mb',
        ENABLE_LOGGING: parseBoolean(process.env.ENABLE_LOGGING, true),
        API_VERSION: process.env.API_VERSION || '1.0.0'
    };
};

/**
 * Validate critical configuration values
 *
 * Ensures that required environment variables are present and valid
 * before the application starts, preventing runtime configuration errors.
 */
const validateConfig = (config: Config): void => {
    const errors: string[] = [];

    // Validate port range
    if (config.PORT < 1 || config.PORT > 65535) {
        errors.push(`PORT must be between 1 and 65535, got: ${config.PORT}`);
    }

    // Validate environment
    const validEnvironments = ['development', 'staging', 'production', 'test'];
    if (!validEnvironments.includes(config.NODE_ENV)) {
        errors.push(`NODE_ENV must be one of: ${validEnvironments.join(', ')}, got: ${config.NODE_ENV}`);
    }

    // Validate CORS origins format
    config.CORS_ORIGINS.forEach(origin => {
        if (origin !== '*' && !origin.startsWith('http')) {
            errors.push(`Invalid CORS origin format: ${origin}. Must be a valid URL or '*'`);
        }
    });

    if (errors.length > 0) {
        console.error('❌ Configuration validation failed:');
        errors.forEach(error => console.error(`  - ${error}`));
        process.exit(1);
    }
};

// Parse and validate configuration on module load
export const config = parseConfig();
validateConfig(config);

// Log configuration in development mode (excluding sensitive values)
if (config.NODE_ENV === 'development') {
    console.log('📋 Application Configuration:');
    console.log(`  - PORT: ${config.PORT}`);
    console.log(`  - NODE_ENV: ${config.NODE_ENV}`);
    console.log(`  - CORS_ORIGINS: ${config.CORS_ORIGINS.join(', ')}`);
    console.log(`  - ENABLE_LOGGING: ${config.ENABLE_LOGGING}`);
    console.log(`  - API_VERSION: ${config.API_VERSION}`);
}