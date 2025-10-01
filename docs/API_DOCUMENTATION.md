# TCSS-460 HelloWorld API Documentation


Educational REST API demonstrating modern Node.js/Express/TypeScript patterns for TCSS-460.

This API showcases:
- HTTP method semantics (GET, POST, PUT, PATCH, DELETE)
- Request parameter types (query, path, body, headers)
- Input validation and sanitization
- Standardized response formats
- Error handling patterns
- API documentation with OpenAPI/Swagger

**Learning Objectives:**
- Understand RESTful API design principles
- Practice HTTP protocol fundamentals
- Implement proper input validation
- Create consistent API responses
- Document APIs for maintainability
        

## API Information

- **Version:** 1.0.0
- **Base URL:** http://localhost:8000
- **Documentation:** [Swagger UI](/api-docs)

## Available Endpoints

### /health
- **GET** - Basic health check
- **OPTIONS** - CORS preflight request

**Example Request:**
```bash
GET /health
```

**Success Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2025-09-30T12:00:00.000Z"
}
```

**CORS Preflight Request:**
```bash
OPTIONS /health
Origin: http://localhost:3000
```

**Preflight Response (204 No Content):**
```
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, X-API-Version
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

**CORS Configuration:**
- Allowed origins configured via `CORS_ORIGINS` environment variable
- Supports credentials (cookies, authorization headers)
- Preflight requests return 204 No Content
- Unauthorized origins receive 403 Forbidden

---

### /health/detailed
- **GET** - Detailed health information

### /hello
- **GET** - Retrieve hello message using GET method
- **POST** - Create or submit hello message using POST method
- **PUT** - Create or replace hello message using PUT method
- **PATCH** - Partially update hello message using PATCH method
- **DELETE** - Remove hello message using DELETE method

### /parameters/query
- **GET** - Demonstrate query parameter usage with validation and sanitization

**Query Parameters:**
- `name` (optional): String value to be validated and sanitized

**Example Request:**
```bash
GET /parameters/query?name=John
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully processed query parameter: John",
  "data": {
    "name": "John",
    "sanitized": true,
    "source": "query parameter"
  },
  "validation": [
    "query parameter extraction",
    "input sanitization"
  ]
}
```

**Validation Process:**
- Extracts query parameters from request URL
- Sanitizes input to prevent XSS attacks
- Sets `sanitized: true` when sanitization is applied
- Returns educational message mentioning "query parameter"

---

### /parameters/path/{name}
- **GET** - Demonstrate path parameter usage with validation and sanitization

**Path Parameters:**
- `name` (required): String value embedded in URL path

**Example Request:**
```bash
GET /parameters/path/John
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully processed path parameter: John",
  "data": {
    "name": "John",
    "sanitized": true,
    "source": "path parameter"
  },
  "validation": [
    "path parameter extraction",
    "input sanitization"
  ]
}
```

**Special Characters Handling:**

When special characters are included in the path parameter, they should be URL-encoded:

**Example Request:**
```bash
GET /parameters/path/John%20Doe%20%3Cscript%3E
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully processed path parameter: John Doe &lt;script&gt;",
  "data": {
    "name": "John Doe &lt;script&gt;",
    "sanitized": true,
    "source": "path parameter",
    "original": "John Doe <script>"
  },
  "validation": [
    "path parameter extraction",
    "URL decoding",
    "input sanitization",
    "special character handling"
  ]
}
```

**Validation Process:**
- Extracts path parameters from URL
- Decodes URL-encoded characters
- Sanitizes input to prevent XSS attacks (e.g., `<script>` becomes `&lt;script&gt;`)
- Sets `sanitized: true` when sanitization is applied
- Returns educational message mentioning "path parameter"

---

### /parameters/body
- **POST** - Demonstrate request body parameter usage with JSON validation

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John",
  "email": "john@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully processed request body parameters",
  "data": {
    "name": "John",
    "email": "john@example.com",
    "sanitized": true,
    "source": "request body"
  },
  "validation": [
    "JSON parsing",
    "request body extraction",
    "input sanitization"
  ]
}
```

**Validation Process:**
- Validates Content-Type is application/json
- Parses JSON request body
- Extracts body parameters
- Sanitizes all string inputs to prevent XSS attacks
- Sets `sanitized: true` when sanitization is applied
- Returns educational message mentioning "request body"
- Includes "JSON parsing" in validation array

**Error Response - Invalid JSON (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid JSON in request body",
  "error": "Unexpected token..."
}
```

---

### /parameters/headers
- **GET** - Demonstrate header parameter usage with validation

**Request Headers:**
```
X-Custom-Header: CustomValue
X-User-Agent: MyApp/1.0
```

**Example Request:**
```bash
GET /parameters/headers
X-Custom-Header: CustomValue
X-User-Agent: MyApp/1.0
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully processed header parameters",
  "data": {
    "customHeader": "CustomValue",
    "userAgent": "MyApp/1.0",
    "sanitized": true,
    "source": "header"
  },
  "validation": [
    "header extraction",
    "input sanitization"
  ]
}
```

**Validation Process:**
- Extracts custom headers from request
- Normalizes header names (converts to camelCase)
- Sanitizes header values to prevent injection attacks
- Sets `sanitized: true` when sanitization is applied
- Returns educational message mentioning "header"
- Includes "header extraction" in validation array

## Getting Started

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit the interactive documentation:
   ```
   http://localhost:8000/api-docs
   ```

3. Test endpoints using the "Try it out" feature in Swagger UI

## Educational Resources

This API demonstrates:
- RESTful API design principles
- HTTP method semantics (GET, POST, PUT, PATCH, DELETE)
- Request parameter types (query, path, body, headers)
- Input validation and sanitization
- Standardized response formats
- Error handling patterns
- API documentation with OpenAPI/Swagger

## Contact

For questions about this educational API, please contact the TCSS-460 course staff.
