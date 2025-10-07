# TCSS-460 HelloWorld API - Educational Documentation

Welcome to the comprehensive educational documentation for the TCSS-460 HelloWorld API project. This documentation is designed to help students understand fundamental web development, API design, and software engineering concepts through practical examples.

## 📚 Documentation Structure

### Core Documentation

- **[Complete API Reference](/docs/API_DOCUMENTATION.md)** - Detailed endpoint documentation with examples
- **[Interactive API Testing](http://localhost:8000/api-docs)** - Swagger UI for hands-on endpoint testing

### Quick Start Guide

1. **Start the API:** Ensure the development server is running (`npm run dev`)
2. **Begin with Fundamentals:** Start with [HTTP Fundamentals](/docs/http-fundamentals.md)
3. **Test Interactively:** Use [Swagger UI](http://localhost:8000/api-docs) to test endpoints
4. **Explore Code:** Review the practical implementations in the codebase

## 🎯 Learning Objectives & Resources

By studying this documentation alongside the codebase, students will gain:

### **HTTP & REST API Fundamentals**
- JSON data format for web APIs
- Understanding of HTTP methods and their semantic meanings
- RESTful API design principles and conventions
- Request/response cycles and parameter handling
- Client-server architecture and communication patterns

**📚 Study:** [JSON Fundamentals](/docs/json-fundamentals.md) → [HTTP Fundamentals](/docs/http-fundamentals.md) → [HTTP History & Evolution](/docs/http-history-evolution.md) → [Client-Server Architecture](/docs/client-server-architecture.md) → [Request-Response Model](/docs/request-response-model.md) → [HTTP Methods](/docs/http-methods.md) → [HTTP Status Codes](/docs/http-status-codes.md)
**🔧 Practice:** Try the [Interactive API Documentation](http://localhost:8000/api-docs)
**✋ Hands-On:** Test `GET /hello`, `POST /hello`, `PUT /hello`, `PATCH /hello`, `DELETE /hello`

### **API Documentation & Testing**
- Interactive API documentation with Swagger/OpenAPI
- API testing methodologies and tools
- Documentation-driven development practices

**📚 Study:** [Testing Strategies](/docs/testing-strategies.md)
**🔧 Practice:** Use [Swagger UI](http://localhost:8000/api-docs) to test all endpoints
**✋ Hands-On:** Test parameter endpoints: `GET /parameters/query?name=test`, `GET /parameters/path/yourname`

### **Backend Development Foundations**
- Node.js and Express.js application architecture
- Middleware patterns and request processing pipelines
- Input validation and error handling strategies
- TypeScript compilation and development workflow

**📚 Study:** [Node.js & Express Architecture](/docs/node-express-architecture.md), [Error Handling Patterns](/docs/error-handling-patterns.md), [Development Workflow](/docs/development-workflow.md)
**🔧 Practice:** Examine health check patterns: `GET /health` and `GET /health/detailed`
**✋ Hands-On:** Test validation with `POST /parameters/body` using JSON data

### **Professional Development Practices**
- TypeScript type safety and interface design
- Code organization and maintainability patterns
- Modern tooling and development workflows
- Module system and import/export patterns

**📚 Study:** [Import/Export Patterns](/docs/import-export-patterns.md), [TypeScript Patterns](/docs/typescript-patterns.md), [Environment Configuration](/docs/environment-configuration.md)
**🔧 Practice:** Examine barrel exports in `src/types/index.ts` and `src/controllers/index.ts`
**✋ Hands-On:** Create a new utility module and export it using named exports

## 🔗 Integration with Codebase

This project demonstrates key concepts through practical implementation:

```
/src/routes/open/helloRoutes.ts        → HTTP method demonstrations
/src/routes/open/parametersRoutes.ts   → Parameter handling examples
/src/routes/open/healthRoutes.ts       → API health check patterns
/src/routes/open/docsRoutes.ts         → Documentation serving
/src/core/utilities/validationUtils.ts → Input validation utilities
/src/core/config/swagger.ts           → OpenAPI specification
```

## 📖 How to Use This Documentation

1. **Start with the API Documentation** - Review available endpoints and their functionality
2. **Test with Swagger UI** - Use the interactive documentation at `/api-docs`
3. **Examine source code** - See how concepts are implemented in practice
4. **Run Postman tests** - Use the provided test collection for hands-on learning

## 🚀 Getting Started

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Explore the interactive documentation:**
   - [Swagger UI](http://localhost:8000/api-docs) - Test endpoints interactively
   - [API Documentation](http://localhost:8000/docs/API_DOCUMENTATION.md) - Comprehensive endpoint reference

3. **Test the API endpoints:**
   - Health check: `GET /health`
   - Hello World: `GET /hello`
   - Parameters demo: `GET /parameters/query?name=test`

## 📚 Browse All Educational Resources

**Quick Access:**
- **[Browse All Documentation Files](http://localhost:8000/docs)** - Complete list of educational materials
- **[Interactive API Testing](http://localhost:8000/api-docs)** - Swagger UI for hands-on learning
- **[Complete API Reference](http://localhost:8000/docs/API_DOCUMENTATION.md)** - Detailed endpoint documentation

**Fundamentals Series:**
- [JSON Fundamentals](http://localhost:8000/docs/json-fundamentals.md) - **START HERE** - Understanding JSON, the data format APIs use
- [HTTP Fundamentals](http://localhost:8000/docs/http-fundamentals.md) - Core HTTP concepts and introduction
- [HTTP History & Evolution](http://localhost:8000/docs/http-history-evolution.md) - How HTTP developed over time
- [Client-Server Architecture](http://localhost:8000/docs/client-server-architecture.md) - Architectural patterns
- [Request-Response Model](http://localhost:8000/docs/request-response-model.md) - Communication mechanics
- [HTTP Methods](http://localhost:8000/docs/http-methods.md) - GET, POST, PUT, DELETE explained
- [HTTP Status Codes](http://localhost:8000/docs/http-status-codes.md) - Response codes reference

**Development & Architecture:**
- [Development Workflow](http://localhost:8000/docs/development-workflow.md) - TypeScript compilation, build process, and tooling
- [Import/Export Patterns](http://localhost:8000/docs/import-export-patterns.md) - Module system, exports, and imports
- [Node.js & Express Architecture](http://localhost:8000/docs/node-express-architecture.md) - MVC patterns and middleware
- [TypeScript Patterns](http://localhost:8000/docs/typescript-patterns.md) - Type safety and patterns
- [Error Handling Patterns](http://localhost:8000/docs/error-handling-patterns.md) - Error management strategies
- [Testing Strategies](http://localhost:8000/docs/testing-strategies.md) - API testing approaches
- [Environment Configuration](http://localhost:8000/docs/environment-configuration.md) - Configuration management

---

*This documentation is part of the TCSS-460 coursework and demonstrates industry-standard practices for educational purposes.*