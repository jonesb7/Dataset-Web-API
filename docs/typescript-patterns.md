# TypeScript Patterns

A comprehensive guide to TypeScript patterns and best practices for web application development.

> **💡 Related Code**: See implementations throughout the codebase, especially [`/src/types/`](../src/types/), [`/src/core/utilities/`](../src/core/utilities/), and [`/src/controllers/`](../src/controllers/)

## Quick Navigation
- 📝 **Message Types**: [`messageTypes.ts`](../src/types/messageTypes.ts) - Message-related type definitions
- 🔧 **API Types**: [`apiTypes.ts`](../src/types/apiTypes.ts) - Response and transaction types
- ⚠️ **Error Types**: [`errorTypes.ts`](../src/types/errorTypes.ts) - Standardized error codes
- 📦 **Type Barrel**: [`types/index.ts`](../src/types/index.ts) - Centralized type exports
- 🎯 **Controller Usage**: [`messageController.ts`](../src/controllers/messageController.ts) - Type usage in practice
- 🏗️ **Architecture**: [Node.js Architecture](./node-express-architecture.md#mvc-architecture-pattern) - TypeScript in MVC pattern
- 📝 **API Patterns**: [API Design Patterns](./api-design-patterns.md#response-formatting) - Type-safe API responses
- ⚙️ **Development Workflow**: [Development Workflow](./development-workflow.md#typescript-compilation-fundamentals) - TypeScript compilation process

## Table of Contents

- [TypeScript Fundamentals](#typescript-fundamentals)
- [Interface Design](#interface-design)
- [Generic Types](#generic-types)
- [Type Safety Patterns](#type-safety-patterns)
- [Error Handling with Types](#error-handling-with-types)
- [Advanced Patterns](#advanced-patterns)

---

## TypeScript Fundamentals

### Why TypeScript?

TypeScript adds static type checking to JavaScript, helping catch errors at compile time rather than runtime.

#### ✅ **Benefits:**
- **Catch errors early** during development
- **Better IDE support** with autocomplete and refactoring
- **Self-documenting code** through type annotations
- **Easier refactoring** with confidence
- **Better team collaboration** with clear interfaces

#### **TypeScript in Our Project:**
```typescript
// Type-safe function signatures
export const createMessage = async (request: Request, response: Response): Promise<void> => {
  const { name, message, priority }: MessageRequest = request.body;
  // TypeScript ensures these fields exist and are the right type
};
```

### Basic Type Annotations

```typescript
// Primitive types
const name: string = "John Doe";
const age: number = 25;
const isActive: boolean = true;

// Array types
const priorities: number[] = [1, 2, 3];
const messages: string[] = ["Hello", "World"];

// Object types
const user: { name: string; age: number } = {
  name: "John",
  age: 25
};

// Function types
const validator = (input: string): boolean => {
  return input.length > 0;
};
```

---

## Interface Design

### Interface Hierarchy in Our Project

```typescript
// Base interface for core message data
export interface MessageObject {
  name: string;
  message: string;
  priority: number;
}

// Request interface for API input
export interface MessageRequest {
  name: string;
  message: string;
  priority: number;
}

// Response interface with formatted display
export interface MessageEntry extends MessageObject {
  formatted: string;
}

// Database interface with metadata
export interface MessageRecord extends MessageObject {
  id: number;
  created_at: Date;
  updated_at: Date;
}
```

### Interface Design Principles

#### **1. Single Responsibility**
Each interface should represent one clear concept.

```typescript
// ✅ GOOD: Focused interfaces
interface User {
  id: number;
  username: string;
  email: string;
}

interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

// ❌ BAD: Mixed concerns
interface UserEverything {
  id: number;
  username: string;
  email: string;
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
  lastLoginDate: Date;
  profilePicture: Buffer;
  // Too many unrelated fields
}
```

#### **2. Composition Over Large Interfaces**

```typescript
// ✅ GOOD: Composable interfaces
interface UserBasic {
  id: number;
  username: string;
  email: string;
}

interface UserProfile extends UserBasic {
  firstName: string;
  lastName: string;
  bio?: string;
}

interface UserWithPreferences extends UserBasic {
  preferences: UserPreferences;
}

// Use composition for different contexts
type FullUser = UserProfile & UserWithPreferences;
```

#### **3. Optional vs Required Properties**

```typescript
// Clear distinction between required and optional
interface CreateUserRequest {
  username: string;        // Required
  email: string;          // Required
  password: string;       // Required
  firstName?: string;     // Optional
  lastName?: string;      // Optional
}

interface UpdateUserRequest {
  username?: string;      // All optional for partial updates
  email?: string;
  firstName?: string;
  lastName?: string;
}
```

### Interface Documentation

```typescript
/**
 * Request payload for creating a new message
 * Used by POST /message endpoint validation and processing
 * All fields are required and validated by express-validator middleware
 *
 * @interface MessageRequest
 * @example
 * const newMessage: MessageRequest = {
 *   name: "John Doe",
 *   message: "Hello World",
 *   priority: 1
 * };
 */
export interface MessageRequest {
  /** Unique identifier for message sender (validated for uniqueness in database) */
  name: string;
  /** Content of the message to be stored (required, non-empty after trimming) */
  message: string;
  /** Priority level: 1 (highest) to 3 (lowest) */
  priority: number;
}
```

---

## Generic Types

### Generic Interfaces

```typescript
// Generic response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errorCode?: string;
  errors?: any[];
}

// Usage with specific types
const messageResponse: ApiResponse<MessageEntry> = {
  success: true,
  data: {
    name: "John",
    message: "Hello",
    priority: 1,
    formatted: "{1} - [John] says: Hello"
  }
};

const listResponse: ApiResponse<MessageEntry[]> = {
  success: true,
  data: [messageEntry1, messageEntry2, messageEntry3]
};
```

### Generic Functions

```typescript
// Generic transaction result
export interface TransactionResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
}

// Generic transaction utility
export const withTransaction = async <T>(
  operation: (client: PoolClient) => Promise<T>
): Promise<TransactionResult<T>> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await operation(client);
    await client.query('COMMIT');

    return { success: true, data: result };
  } catch (error) {
    await client.query('ROLLBACK');
    return { success: false, error: error as Error };
  } finally {
    client.release();
  }
};

// Type-safe usage
const result = await withTransaction<MessageRecord>(async (client) => {
  const queryResult = await client.query('INSERT INTO messages...');
  return queryResult.rows[0]; // TypeScript knows this returns MessageRecord
});

if (result.success) {
  console.log(result.data.id); // TypeScript knows data is MessageRecord
}
```

### Generic Response Utilities

```typescript
// Generic response function with type safety
export const sendSuccess = <T>(
  response: Response,
  data?: T,
  message?: string,
  statusCode: number = 200
): void => {
  const responseBody: ApiResponse<T> = {
    success: true,
    ...(message && { message }),
    ...(data !== undefined && { data })
  };

  response.status(statusCode).json(responseBody);
};

// Usage ensures type safety
sendSuccess<MessageEntry>(response, messageEntry, "Message created");
// TypeScript ensures messageEntry matches MessageEntry interface
```

---

## Type Safety Patterns

### Union Types for Controlled Values

```typescript
// Priority levels as union type
type Priority = 1 | 2 | 3;

// Environment types
type Environment = 'development' | 'test' | 'staging' | 'production';

// HTTP methods
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Usage in interfaces
interface MessageRequest {
  name: string;
  message: string;
  priority: Priority; // Only allows 1, 2, or 3
}

interface RouteConfig {
  method: HttpMethod;
  path: string;
  handler: RequestHandler;
}
```

### Discriminated Unions

```typescript
// Different types of API responses
interface SuccessResponse {
  success: true;
  data: any;
  message?: string;
}

interface ErrorResponse {
  success: false;
  message: string;
  errorCode: string;
  errors?: any[];
}

type ApiResponse = SuccessResponse | ErrorResponse;

// Type guards for discriminated unions
const isSuccessResponse = (response: ApiResponse): response is SuccessResponse => {
  return response.success === true;
};

// Usage with type narrowing
const handleResponse = (response: ApiResponse) => {
  if (isSuccessResponse(response)) {
    // TypeScript knows this is SuccessResponse
    console.log(response.data);
  } else {
    // TypeScript knows this is ErrorResponse
    console.log(response.errorCode);
  }
};
```

### Type Guards

```typescript
// Runtime type checking
export const isStringProvided = (value: any): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

export const isValidPriority = (value: any): value is Priority => {
  return typeof value === 'number' && [1, 2, 3].includes(value);
};

// Usage in validation
const validateInput = (input: any) => {
  if (!isStringProvided(input.name)) {
    throw new Error('Name must be a non-empty string');
  }

  if (!isValidPriority(input.priority)) {
    throw new Error('Priority must be 1, 2, or 3');
  }

  // TypeScript now knows input.name is string and input.priority is Priority
  return { name: input.name, priority: input.priority };
};
```

### Utility Types

```typescript
// Partial for updates
type UpdateMessageRequest = Partial<MessageRequest>;
// Result: { name?: string; message?: string; priority?: number; }

// Pick for selecting specific fields
type MessageSummary = Pick<MessageRecord, 'id' | 'name' | 'priority'>;
// Result: { id: number; name: string; priority: number; }

// Omit for excluding fields
type CreateMessageData = Omit<MessageRecord, 'id' | 'created_at' | 'updated_at'>;
// Result: { name: string; message: string; priority: number; }

// Required for making all fields required
type RequiredMessageRequest = Required<MessageRequest>;
// Useful when all fields must be present

// Example usage
const updateMessage = (id: number, updates: UpdateMessageRequest): Promise<MessageRecord> => {
  // Only provided fields will be updated
  return updateMessageInDB(id, updates);
};
```

---

## Error Handling with Types

### Typed Error Classes

```typescript
// Base error with type information
abstract class AppError extends Error {
  abstract readonly statusCode: number;
  abstract readonly errorCode: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Specific error types
export class ValidationError extends AppError {
  readonly statusCode = 400;
  readonly errorCode = 'VALIDATION_ERROR';

  constructor(message: string, public field?: string) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  readonly statusCode = 404;
  readonly errorCode = 'NOT_FOUND';

  constructor(resource: string, id: string | number) {
    super(`${resource} with id ${id} not found`);
  }
}

export class ConflictError extends AppError {
  readonly statusCode = 409;
  readonly errorCode = 'CONFLICT';
}
```

### Result Pattern for Error Handling

```typescript
// Result type for operations that can fail
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Usage in functions
const parseInteger = (value: string): Result<number, string> => {
  const parsed = parseInt(value);

  if (isNaN(parsed)) {
    return { success: false, error: 'Invalid number format' };
  }

  return { success: true, data: parsed };
};

// Safe usage without exceptions
const handleInput = (input: string) => {
  const result = parseInteger(input);

  if (result.success) {
    console.log('Parsed number:', result.data);
  } else {
    console.log('Parse error:', result.error);
  }
};
```

### Async Error Handling

```typescript
// Async result pattern
type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

const createMessageSafe = async (request: MessageRequest): AsyncResult<MessageRecord> => {
  try {
    // Validation
    if (!isStringProvided(request.name)) {
      return { success: false, error: new ValidationError('Name is required') };
    }

    // Database operation
    const result = await pool.query('INSERT INTO messages...');
    return { success: true, data: result.rows[0] };

  } catch (error) {
    return { success: false, error: error as Error };
  }
};

// Usage
const result = await createMessageSafe(messageRequest);
if (result.success) {
  sendSuccess(response, result.data);
} else {
  handleError(response, result.error);
}
```

---

## Advanced Patterns

### Conditional Types

```typescript
// Conditional response types based on success
type ApiResponse<T, TSuccess extends boolean = boolean> =
  TSuccess extends true
    ? { success: true; data: T; message?: string }
    : { success: false; message: string; errorCode: string };

// Usage
type SuccessResponse<T> = ApiResponse<T, true>;
type ErrorResponse = ApiResponse<never, false>;
```

### Mapped Types

```typescript
// Make all properties nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

// Make all properties optional and nullable
type PartialNullable<T> = {
  [K in keyof T]?: T[K] | null;
};

// Usage for database updates
type MessageUpdate = PartialNullable<Omit<MessageRecord, 'id' | 'created_at'>>;
// Result: { name?: string | null; message?: string | null; priority?: number | null; updated_at?: Date | null; }
```

### Template Literal Types

```typescript
// Environment-specific configuration keys
type Environment = 'development' | 'test' | 'staging' | 'production';
type ConfigKey = `DB_${Uppercase<Environment>}_URL`;
// Result: "DB_DEVELOPMENT_URL" | "DB_TEST_URL" | "DB_STAGING_URL" | "DB_PRODUCTION_URL"

// HTTP method with path templates
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiEndpoint = `${HttpMethod} /api/${string}`;
// Result: "GET /api/${string}" | "POST /api/${string}" | etc.
```

### Decorator Patterns

```typescript
// Method decorator for validation
const validate = (schema: any) => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const [req, res] = args;
      const { error } = schema.validate(req.body);

      if (error) {
        return sendValidationError(res, error.message);
      }

      return method.apply(this, args);
    };
  };
};

// Usage
class MessageController {
  @validate(messageSchema)
  async createMessage(req: Request, res: Response) {
    // Request is pre-validated
    const message = await this.messageService.create(req.body);
    sendSuccess(res, message);
  }
}
```

---

## Type Configuration

### tsconfig.json Best Practices

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",

    // Type checking
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,

    // Module resolution
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,

    // Path mapping
    "baseUrl": "./src",
    "paths": {
      "@controllers/*": ["controllers/*"],
      "@utilities/*": ["core/utilities/*"],
      "@models": ["core/models/index"],
      "@db": ["core/utilities/database"]
    },

    // Additional checks
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts"
  ]
}
```

### Type Declaration Files

```typescript
// types/express.d.ts - Extending Express types
import { User } from '@models';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      requestId?: string;
    }
  }
}

// types/environment.d.ts - Environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'test' | 'staging' | 'production';
    PORT: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    JWT_SECRET: string;
  }
}
```

---

## Testing with Types

### Type-Safe Test Utilities

```typescript
// Test data factories with types
export const createMockMessage = (overrides: Partial<MessageRecord> = {}): MessageRecord => {
  return {
    id: 1,
    name: 'Test User',
    message: 'Test message',
    priority: 1,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides
  };
};

// Type-safe API testing
const testApiEndpoint = async <T>(
  method: HttpMethod,
  path: string,
  data?: any
): Promise<ApiResponse<T>> => {
  const response = await request(app)
    .method.toLowerCase()(path)
    .send(data);

  return response.body as ApiResponse<T>;
};

// Usage
const response = await testApiEndpoint<MessageEntry>('POST', '/api/messages', {
  name: 'Test',
  message: 'Hello',
  priority: 1
});

if (response.success) {
  expect(response.data.formatted).toContain('Test');
}
```

---

## Performance with Types

### Tree Shaking with Types

```typescript
// Use const assertions for better tree shaking
export const ERROR_CODES = {
  MSG_NAME_EXISTS: 'MSG_NAME_EXISTS',
  MSG_NOT_FOUND: 'MSG_NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
} as const;

// Creates type: 'MSG_NAME_EXISTS' | 'MSG_NOT_FOUND' | 'VALIDATION_ERROR'
type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
```

### Compile-Time Optimizations

```typescript
// Use type-only imports for better compilation
import type { MessageRecord, MessageEntry } from '@models';
import { sendSuccess } from '@utilities/responseUtils'; // Runtime import

// Type-only exports
export type { MessageRecord, MessageEntry };
export { sendSuccess }; // Runtime export
```

---

## Further Reading

- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Official TypeScript documentation
- [Type Challenges](https://github.com/type-challenges/type-challenges) - Practice with advanced types
- [TypeScript Best Practices](https://basarat.gitbook.io/typescript/) - Comprehensive guide

---

*TypeScript's type system enables building more reliable, maintainable, and self-documenting applications. These patterns help leverage TypeScript's full potential for web development.*