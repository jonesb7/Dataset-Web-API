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

### /health/detailed
- **GET** - Detailed health information

### /hello
- **GET** - Retrieve hello message using GET method
- **POST** - Create or submit hello message using POST method
- **PUT** - Create or replace hello message using PUT method
- **PATCH** - Partially update hello message using PATCH method
- **DELETE** - Remove hello message using DELETE method

### /parameters/query
- **GET** - Demonstrate query parameter usage

### /parameters/path/{name}
- **GET** - Demonstrate path parameter usage

### /parameters/body
- **POST** - Demonstrate request body parameter usage

### /parameters/headers
- **GET** - Demonstrate header parameter usage

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
