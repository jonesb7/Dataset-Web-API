/**
 * Centralized type definitions for the TCSS-460 HelloWorld API
 *
 * Barrel export file providing clean imports for all type definitions used throughout
 * the application. Organizes types by domain (API responses, errors) while
 * maintaining a single import point for consumers.
 *
 * @see {@link ../../docs/typescript-patterns.md#type-organization} for type organization patterns
 * @example
 * // Clean imports from centralized types
 * import { ApiResponse, HealthResponse, ErrorCodes } from '@/types';
 * @example
 * // Or import specific type files
 * import { ApiResponse } from '@/types/apiTypes';
 * import { ErrorResponse } from '@/types/errorTypes';
 */

// Barrel exports for centralized types
export * from './apiTypes';
export * from './errorTypes';