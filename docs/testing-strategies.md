# Testing Strategies

Comprehensive guide to testing Express.js APIs with TypeScript, covering unit testing, integration testing, and API testing methodologies.

> **💡 Related Code**: See implementations in [`/testing/`](../testing/) directory and [`package.json`](../package.json) test scripts

## Quick Navigation
- 🧪 **Test Structure**: [`testing/`](../testing/) - Organized testing approach
- 📮 **Postman Tests**: [`postman/`](../testing/postman/) - API testing collection
- 🏗️ **Test Architecture**: [Express Architecture](./node-express-architecture.md#error-handling) - Testable patterns
- 🔧 **Type Safety**: [TypeScript Patterns](./typescript-patterns.md) - Type-safe testing
- 📋 **Configuration**: [`package.json`](../package.json) - Test scripts and dependencies

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Test Organization](#test-organization)
- [Unit Testing Patterns](#unit-testing-patterns)
- [Integration Testing](#integration-testing)
- [API Testing with Postman](#api-testing-with-postman)
- [Test Automation](#test-automation)

---

## Testing Philosophy

### Testing Pyramid

```
                🔺
               /   \
              / E2E \     (Few) - End-to-end tests
             /       \
            /_________\
           /           \
          / Integration \  (Some) - Integration tests
         /               \
        /_________________\
       /                   \
      /       Unit          \  (Many) - Unit tests
     /                       \
    /_________________________\
```

#### **Unit Tests (Many)**
- Test individual functions and classes in isolation
- Fast execution and immediate feedback
- High code coverage and detailed error reporting
- Mock external dependencies

#### **Integration Tests (Some)**
- Test component interactions and API endpoints
- Verify data flow between layers
- Test middleware chains and error handling
- Use test databases or in-memory stores

#### **End-to-End Tests (Few)**
- Test complete user workflows
- Verify system behavior from client perspective
- Test deployed applications in staging environments
- Use tools like Postman, Cypress, or Playwright

### Testing Principles

1. **Arrange, Act, Assert (AAA Pattern)**
   ```typescript
   test('should return health status', async () => {
     // Arrange
     const request = createMockRequest();
     const response = createMockResponse();

     // Act
     await getHealth(request, response);

     // Assert
     expect(response.status).toHaveBeenCalledWith(200);
     expect(response.json).toHaveBeenCalledWith(expectedHealthResponse);
   });
   ```

2. **Test Independence**
   - Each test should be able to run independently
   - Tests should not depend on execution order
   - Clean up resources after each test

3. **Descriptive Test Names**
   ```typescript
   // Good: Descriptive and specific
   test('should return 400 when name field is missing')
   test('should create user with valid data')
   test('should handle database connection errors gracefully')

   // Bad: Vague and unclear
   test('user test')
   test('should work')
   test('error handling')
   ```

---

## Test Organization

### Directory Structure

```
testing/
├── unit/                    # Unit tests
│   ├── controllers/         # Controller tests
│   ├── middleware/          # Middleware tests
│   ├── utilities/          # Utility function tests
│   └── types/              # Type validation tests
├── integration/            # Integration tests
│   ├── health/             # Health endpoint tests
│   ├── api/                # Full API flow tests
│   └── middleware/         # Middleware integration tests
├── postman/                # Postman collections
│   ├── HelloWorld-API.postman_collection.json
│   ├── HelloWorld-Environment.postman_environment.json
│   └── README.md
└── fixtures/               # Test data and mocks
    ├── mockData.ts
    ├── testHelpers.ts
    └── setupTests.ts
```

### Test Configuration

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest testing/unit",
    "test:integration": "jest testing/integration",
    "test:postman": "newman run testing/postman/HelloWorld-API.postman_collection.json"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "@types/supertest": "^2.0.12",
    "jest": "^29.5.0",
    "newman": "^5.3.2",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.0"
  }
}
```

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/testing'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/testing/fixtures/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@middleware/(.*)$': '<rootDir>/src/core/middleware/$1',
    '^@utilities/(.*)$': '<rootDir>/src/core/utilities/$1'
  }
};
```

---

## Unit Testing Patterns

### Testing Utilities

```typescript
// testing/fixtures/testHelpers.ts
import { Request, Response } from 'express';

export const createMockRequest = (overrides?: Partial<Request>): Partial<Request> => ({
  method: 'GET',
  url: '/',
  headers: {},
  body: {},
  params: {},
  query: {},
  ip: '127.0.0.1',
  get: jest.fn(),
  ...overrides
});

export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    get: jest.fn(),
    set: jest.fn()
  };
  return res;
};

export const createMockNext = (): jest.Mock => jest.fn();
```

### Controller Testing

```typescript
// testing/unit/controllers/healthController.test.ts
import { getHealth, getDetailedHealth } from '@controllers/healthController';
import { createMockRequest, createMockResponse } from '../../fixtures/testHelpers';

describe('Health Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = createMockRequest();
    mockResponse = createMockResponse();
  });

  describe('getHealth', () => {
    test('should return basic health status', async () => {
      await getHealth(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            status: 'OK',
            timestamp: expect.any(String)
          }),
          message: 'API is healthy'
        })
      );
    });
  });

  describe('getDetailedHealth', () => {
    test('should return detailed health information', async () => {
      await getDetailedHealth(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            status: 'OK',
            timestamp: expect.any(String),
            details: expect.objectContaining({
              uptime: expect.any(Number),
              memory: expect.objectContaining({
                used: expect.any(Number),
                total: expect.any(Number)
              }),
              version: expect.any(String),
              environment: expect.any(String)
            })
          })
        })
      );
    });

    test('should include correct environment information', async () => {
      await getDetailedHealth(mockRequest as Request, mockResponse as Response);

      const responseCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseCall.data.details.environment).toBe(process.env.NODE_ENV || 'development');
    });
  });
});
```

### Middleware Testing

```typescript
// testing/unit/middleware/errorHandler.test.ts
import { errorHandler, AppError } from '@middleware/errorHandler';
import { ErrorCodes } from '@/types';
import { createMockRequest, createMockResponse, createMockNext } from '../../fixtures/testHelpers';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = createMockRequest();
    mockResponse = createMockResponse();
    mockNext = createMockNext();
  });

  test('should handle AppError instances correctly', () => {
    const error = new AppError('Test error', 400, ErrorCodes.BAD_REQUEST);

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Test error',
        code: ErrorCodes.BAD_REQUEST,
        timestamp: expect.any(String)
      })
    );
  });

  test('should handle generic Error instances', () => {
    const error = new Error('Generic error');

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Generic error',
        code: ErrorCodes.INTERNAL_ERROR
      })
    );
  });

  test('should handle JSON syntax errors', () => {
    const error = new SyntaxError('Unexpected token in JSON');
    (error as any).body = true; // Simulate body parsing error

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Invalid JSON in request body',
        code: ErrorCodes.INVALID_REQUEST_FORMAT
      })
    );
  });
});
```

### Utility Function Testing

```typescript
// testing/unit/utilities/responseUtils.test.ts
import { sendSuccess, sendError, ErrorResponses } from '@utilities/responseUtils';
import { ErrorCodes } from '@/types';
import { createMockResponse } from '../../fixtures/testHelpers';

describe('Response Utilities', () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = createMockResponse();
  });

  describe('sendSuccess', () => {
    test('should send success response with data', () => {
      const testData = { id: 1, name: 'Test' };

      sendSuccess(mockResponse as Response, testData, 'Success message');

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: testData,
          message: 'Success message',
          timestamp: expect.any(String)
        })
      );
    });

    test('should use custom status code', () => {
      sendSuccess(mockResponse as Response, {}, undefined, 201);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
  });

  describe('ErrorResponses helpers', () => {
    test('badRequest should send 400 error', () => {
      ErrorResponses.badRequest(mockResponse as Response, 'Invalid input');

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Invalid input',
          code: ErrorCodes.BAD_REQUEST
        })
      );
    });

    test('notFound should send 404 error', () => {
      ErrorResponses.notFound(mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Resource not found',
          code: ErrorCodes.NOT_FOUND
        })
      );
    });
  });
});
```

---

## Integration Testing

### API Integration Tests

```typescript
// testing/integration/health/healthEndpoints.test.ts
import request from 'supertest';
import { createApp } from '../../../src/app';
import { Express } from 'express';

describe('Health Endpoints Integration', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  describe('GET /health', () => {
    test('should return basic health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          status: 'OK',
          timestamp: expect.any(String)
        },
        message: 'API is healthy',
        timestamp: expect.any(String)
      });
    });

    test('should have correct response headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });

  describe('GET /health/detailed', () => {
    test('should return detailed health information', async () => {
      const response = await request(app)
        .get('/health/detailed')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          status: 'OK',
          timestamp: expect.any(String),
          details: {
            uptime: expect.any(Number),
            memory: {
              used: expect.any(Number),
              total: expect.any(Number)
            },
            version: expect.any(String),
            environment: expect.any(String)
          }
        }
      });
    });

    test('should include memory usage information', async () => {
      const response = await request(app)
        .get('/health/detailed')
        .expect(200);

      const { memory } = response.body.data.details;
      expect(memory.used).toBeGreaterThan(0);
      expect(memory.total).toBeGreaterThan(memory.used);
    });
  });
});
```

### Middleware Integration Tests

```typescript
// testing/integration/middleware/middlewareChain.test.ts
import request from 'supertest';
import { createApp } from '../../../src/app';

describe('Middleware Chain Integration', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  test('should handle CORS headers correctly', async () => {
    const response = await request(app)
      .options('/health')
      .set('Origin', 'http://localhost:3000')
      .expect(204);

    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    expect(response.headers['access-control-allow-methods']).toMatch(/GET/);
  });

  test('should reject disallowed CORS origins', async () => {
    await request(app)
      .get('/health')
      .set('Origin', 'http://malicious-site.com')
      .expect(500); // CORS error handled by error middleware
  });

  test('should handle malformed JSON in request body', async () => {
    const response = await request(app)
      .post('/health') // Assuming we had a POST endpoint
      .set('Content-Type', 'application/json')
      .send('{ invalid json }')
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Invalid JSON in request body',
      code: 'INVALID_REQUEST_FORMAT'
    });
  });

  test('should handle 404 for non-existent endpoints', async () => {
    const response = await request(app)
      .get('/nonexistent')
      .expect(404);

    expect(response.body).toMatchObject({
      success: false,
      message: expect.stringContaining('not found'),
      code: 'NOT_FOUND'
    });
  });
});
```

---

## API Testing with Postman

### Collection Structure

```json
{
  "info": {
    "name": "TCSS-460 HelloWorld API",
    "description": "Comprehensive test collection for HelloWorld API endpoints"
  },
  "item": [
    {
      "name": "Health Checks",
      "item": [
        {
          "name": "Basic Health Check",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Response has correct structure', function () {",
                  "    const responseJson = pm.response.json();",
                  "    pm.expect(responseJson).to.have.property('success', true);",
                  "    pm.expect(responseJson).to.have.property('data');",
                  "    pm.expect(responseJson.data).to.have.property('status', 'OK');",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{base_url}}/health"
          }
        }
      ]
    }
  ]
}
```

### Environment Configuration

```json
{
  "name": "HelloWorld API Environment",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:8000",
      "enabled": true,
      "description": "Base URL for the HelloWorld API"
    },
    {
      "key": "api_version",
      "value": "1.0.0",
      "enabled": true,
      "description": "Current API version"
    }
  ]
}
```

### Newman CLI Testing

```bash
# Run Postman collection with Newman
npm run test:postman

# Run with specific environment
newman run testing/postman/HelloWorld-API.postman_collection.json \
  -e testing/postman/HelloWorld-Environment.postman_environment.json \
  --reporters cli,json

# Run with custom data file
newman run testing/postman/HelloWorld-API.postman_collection.json \
  -d testing/postman/test-data.json \
  --reporters cli,htmlextra
```

---

## Test Automation

### CI/CD Pipeline Integration

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v3

    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run type checking
      run: npm run type-check

    - name: Run unit tests
      run: npm run test:unit

    - name: Run integration tests
      run: npm run test:integration

    - name: Build application
      run: npm run build

    - name: Start server for API tests
      run: |
        npm start &
        sleep 5

    - name: Run API tests with Newman
      run: npm run test:postman

    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
```

### Test Scripts

```json
{
  "scripts": {
    "test": "npm run test:unit && npm run test:integration",
    "test:unit": "jest testing/unit --coverage",
    "test:integration": "jest testing/integration",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage --coverageReporters=text-lcov | coveralls",
    "test:postman": "newman run testing/postman/HelloWorld-API.postman_collection.json -e testing/postman/HelloWorld-Environment.postman_environment.json",
    "test:all": "npm run test && npm run test:postman"
  }
}
```

---

## Best Practices Summary

### Test Organization
- ✅ Follow consistent directory structure and naming conventions
- ✅ Separate unit, integration, and API tests clearly
- ✅ Use descriptive test names that explain behavior
- ✅ Group related tests in describe blocks

### Test Quality
- ✅ Follow AAA pattern (Arrange, Act, Assert)
- ✅ Write independent tests that don't depend on execution order
- ✅ Use appropriate assertions and matchers
- ✅ Test both success and error scenarios

### Test Coverage
- ✅ Aim for high unit test coverage (>80%)
- ✅ Focus integration tests on critical paths
- ✅ Include API tests for complete user workflows
- ✅ Test error handling and edge cases

### Automation
- ✅ Integrate tests into CI/CD pipeline
- ✅ Run tests on multiple Node.js versions
- ✅ Generate and track coverage reports
- ✅ Use automated API testing with Postman/Newman

### Maintenance
- ✅ Keep tests up-to-date with code changes
- ✅ Refactor test utilities to avoid duplication
- ✅ Review and update test data regularly
- ✅ Monitor test performance and optimize slow tests