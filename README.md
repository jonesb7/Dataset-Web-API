# TCSS-460 HelloWorld API

> **University of Washington Tacoma**
>
> **School of Engineering and Technology**
>
> **Computer Science and Systems**
>
> **TCSS 460 A - Client/Server Programming for Internet Applications**
>
> **Autumn 2025**
>
> **Instructor:** Professor Charles Bryan
>
> **Email:** cfb3@uw.edu

---

## 🎯 Complete Beginner? Start Here!

**Never used Node.js or built an API before? Follow these 4 steps:**

### Step 1: Install Node.js
- Download and install from [nodejs.org](https://nodejs.org/) (version 18 or higher)
- Verify installation: Open terminal and run `node --version`

### Step 2: Run These Commands
```bash
cd TCSS-460-helloworld-api
npm install
cp .env.example .env
npm run dev
```

You should see:
```
🚀 HelloWorld API server running on port 8000
📚 Environment: development
🔗 Health check: http://localhost:8000/health
```

### Step 3: Test Your API
- **Open in browser:** [http://localhost:8000/api-docs](http://localhost:8000/api-docs)
- **Click "Try it out"** on the `GET /hello` endpoint
- **Click "Execute"**
- **🎉 You just used an API!**

### Step 4: Next Steps
1. Read [JSON Fundamentals](docs/json-fundamentals.md) - Understand the data format APIs use
2. Read [HTTP Fundamentals](docs/http-fundamentals.md) - Learn how web APIs work
3. Try other endpoints in Swagger UI
4. Read [Development Workflow](docs/development-workflow.md) - Understand what just happened

**Having trouble?** Check the [Troubleshooting Guide](docs/development-workflow.md#troubleshooting-guide)

---

## 📚 Course Project Overview

This project serves as the foundational template for **TCSS-460: Client/Server Programming for Internet Applications**. It demonstrates modern Express.js and TypeScript development patterns, providing students with a professional-grade starting point for learning web API development.

### **What You'll Learn**
- 🌐 **HTTP Protocol Fundamentals** - Request/Response model, methods, status codes
- 🚀 **Express.js Architecture** - Middleware patterns, routing, MVC design
- 📘 **TypeScript Development** - Type safety, modern JavaScript features
- 🔧 **API Design Patterns** - RESTful principles, error handling, validation
- 🧪 **Testing Strategies** - Automated testing with Postman/Newman
- 🛡️ **Security Practices** - CORS, input sanitization, error handling
- 📦 **Professional Workflow** - Git, linting, formatting, deployment

### **Key Features**
- ✅ **Modern TypeScript** - Strict type safety with path mapping
- ✅ **Express.js Best Practices** - Professional middleware architecture
- ✅ **HTTP Method Demonstrations** - GET, POST, PUT, PATCH, DELETE
- ✅ **Parameter Handling** - Query, path, body, and header parameters
- ✅ **Health Monitoring** - Basic and detailed health check endpoints
- ✅ **Error Handling** - Comprehensive error management system
- ✅ **CORS Configuration** - Production-ready cross-origin setup
- ✅ **Request Logging** - Development and production logging
- ✅ **Environment Configuration** - Type-safe environment management
- ✅ **API Testing** - Complete Postman collection with automated tests
- ✅ **Educational Documentation** - 13 comprehensive guides covering HTTP, Express, TypeScript, and more
- ✅ **Interactive API Documentation** - Swagger UI for hands-on testing

---

## 🚀 Quick Start

### Prerequisites

**Required:**
- **Node.js** 18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** 8.0.0 or higher (comes with Node.js)
- **Code Editor** with TypeScript support ([VS Code](https://code.visualstudio.com/) recommended)

**Optional:**
- **Postman** for API testing ([Download](https://www.postman.com/downloads/))
- **Git** for version control ([Download](https://git-scm.com/))

**Verify Prerequisites:**
```bash
node --version   # Should show v18.0.0 or higher
npm --version    # Should show 8.0.0 or higher
```

### Installation

**1. Clone or Download the Project**
```bash
# If using Git
git clone <repository-url>
cd TCSS-460-helloworld-api

# Or download ZIP and extract to your preferred location
```

**2. Install Dependencies**
```bash
npm install
```
This will install all required packages including Express, TypeScript, and development tools.

**3. Environment Setup**
```bash
# Copy the example environment file
cp .env.example .env

# The default configuration works for local development
# You can edit .env if you need to change the port or other settings
```

**4. Start Development Server**
```bash
npm run dev
```
You should see:
```
🚀 HelloWorld API server running on port 8000
📚 Environment: development
🔗 Health check: http://localhost:8000/health
📖 Documentation: http://localhost:8000/docs
```

### Verification

**Test the API is working:**

**Option 1: Browser**
- Open [http://localhost:8000/health](http://localhost:8000/health)
- You should see JSON response: `{"success":true,"data":{"status":"OK",...}}`

**Option 2: cURL (Command Line)**
```bash
curl http://localhost:8000/health
```

**Option 3: Interactive Documentation**
- Open [http://localhost:8000/api-docs](http://localhost:8000/api-docs)
- Try out the API endpoints directly in Swagger UI

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2025-09-30T10:30:00.000Z"
  },
  "message": "API is healthy",
  "timestamp": "2025-09-30T10:30:00.000Z"
}
```

✅ **If you see this response, your API is running correctly!**

---

## 🏃 How to Run the Project

### Development Mode (Recommended for Active Development)

```bash
npm run dev
```
- Starts server with **automatic restart** on file changes
- Runs on port 8000 (or PORT from .env)
- Hot-reload enabled (no manual restart needed)
- Detailed logging enabled
- TypeScript compilation on-the-fly

**When to use:** Daily development, making changes, learning

### Production Build

```bash
# Step 1: Compile TypeScript to JavaScript
npm run build

# Step 2: Start the production server
npm start
```
- Compiles TypeScript → JavaScript in `dist/` folder
- Runs optimized production code
- Minimal logging
- No hot-reload (manual restart required)

**When to use:** Testing production build, deployment preparation

### Type Checking (No Execution)

```bash
npm run type-check
```
- Checks TypeScript types without running the server
- Fast validation of code correctness
- Useful before committing code

**When to use:** Before git commits, verifying code correctness

### Build with Watch Mode

```bash
npm run build:watch
```
- Continuously compiles TypeScript as you make changes
- Useful for debugging compiled JavaScript

**When to use:** Debugging compilation issues

### Quality Assurance

```bash
# Check code style and potential errors
npm run lint

# Automatically fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check if code is properly formatted
npm run format:check
```

**When to use:** Before submitting assignments, maintaining code quality

### Complete Pre-Commit Check

```bash
npm run type-check && npm run lint && npm run format
```
Run all quality checks at once before committing code.

### Testing

```bash
# Run Postman collection tests (requires Newman)
npm run test:postman
```

**When to use:** Verifying API functionality, automated testing

---

## 📖 Documentation Guide

This project includes comprehensive educational documentation to help you understand web API development from the ground up.

### Interactive Documentation

**Access while server is running:**

| URL | Description |
|-----|-------------|
| [http://localhost:8000/api-docs](http://localhost:8000/api-docs) | **Swagger UI** - Interactive API documentation where you can test endpoints directly in your browser |
| [http://localhost:8000/docs](http://localhost:8000/docs) | **Documentation Viewer** - Browse and read all educational guides in rendered markdown |
| [http://localhost:8000/](http://localhost:8000/) | **API Discovery** - JSON response listing all available endpoints |

### Educational Guides (13 Documents)

All guides are located in the `docs/` directory and cover everything from HTTP basics to advanced patterns.

#### **HTTP Foundations** (5 documents)

Essential understanding of the HTTP protocol:

1. **`http-fundamentals.md`** 📡
   - HTTP protocol basics and structure
   - Headers, methods, status codes overview
   - Request/response anatomy
   - **Start here if new to HTTP**

2. **`http-history-evolution.md`** 📜
   - Evolution from HTTP/0.9 to HTTP/3
   - Why protocols changed over time
   - Modern HTTP/2 and HTTP/3 features

3. **`http-methods.md`** 🔧
   - Deep dive into GET, POST, PUT, PATCH, DELETE
   - When to use each method
   - Idempotency and safety concepts
   - Real-world examples

4. **`http-status-codes.md`** 🎯
   - Complete guide to HTTP status codes (1xx-5xx)
   - What each code means
   - When to use which code
   - Client vs server errors

5. **`request-response-model.md`** 🔄
   - Detailed HTTP request/response cycle
   - Headers, bodies, and metadata
   - How data flows in web APIs

#### **Architecture & Design** (4 documents)

Building well-structured applications:

6. **`client-server-architecture.md`** 🏗️
   - Client-server model fundamentals
   - Separation of concerns
   - API architectural patterns

7. **`node-express-architecture.md`** ⚙️
   - Express.js MVC patterns
   - Middleware pipeline explained
   - Routing architecture
   - **Essential for understanding this project's structure**

8. **`typescript-patterns.md`** 📘
   - TypeScript best practices for APIs
   - Type definitions and interfaces
   - Generic types and utility types
   - Path mapping and module organization

9. **`error-handling-patterns.md`** 🚨
   - Robust error management strategies
   - Operational vs programming errors
   - Error response standardization
   - Global error handlers

#### **Development & Operations** (3 documents)

Professional development practices:

10. **`environment-configuration.md`** 🔧
    - Environment setup and management
    - Configuration best practices
    - Development vs production settings
    - Deployment considerations

11. **`testing-strategies.md`** 🧪
    - API testing methodologies
    - Unit, integration, and E2E testing
    - Postman collection usage
    - Automated testing with Newman

12. **`API_DOCUMENTATION.md`** 📋
    - API reference and usage guide
    - Endpoint specifications
    - Request/response examples

13. **`README.md`** (docs folder) 📚
    - Overview of documentation structure
    - Learning path recommendations

### Recommended Learning Path

**For Complete Beginners:**
1. Start with `http-fundamentals.md` - Understand the basics
2. Read `request-response-model.md` - How APIs communicate
3. Study `http-methods.md` - The building blocks
4. Review `http-status-codes.md` - API responses
5. Explore `node-express-architecture.md` - This project's structure
6. Practice with interactive Swagger UI
7. Dive into other topics as needed

**For Students with HTTP Knowledge:**
1. `node-express-architecture.md` - Express patterns
2. `typescript-patterns.md` - TypeScript in APIs
3. `error-handling-patterns.md` - Professional error handling
4. `testing-strategies.md` - Quality assurance
5. Experiment with the API endpoints

**For Advanced Students:**
- All documents are reference materials
- Focus on `environment-configuration.md` for deployment
- Study error handling and testing patterns
- Extend the API with new features

---

## 📁 Project Structure

```
TCSS-460-helloworld-api/
│
├── src/                                # Source code (TypeScript)
│   │
│   ├── index.ts                        # Application entry point
│   │                                   # - Server startup and lifecycle management
│   │                                   # - Graceful shutdown handlers
│   │                                   # - Process error handlers
│   │
│   ├── app.ts                          # Express application factory
│   │                                   # - Middleware stack configuration
│   │                                   # - Route registration
│   │                                   # - CORS and security setup
│   │
│   ├── types/                          # TypeScript type definitions (3 files)
│   │   ├── index.ts                   # Barrel exports for clean imports
│   │   ├── apiTypes.ts                # API response interfaces
│   │   └── errorTypes.ts              # Error handling types
│   │
│   ├── core/                           # Core infrastructure
│   │   │
│   │   ├── config/                    # Configuration (1 file)
│   │   │   └── swagger.ts             # OpenAPI/Swagger documentation setup
│   │   │
│   │   ├── middleware/                # Express middleware (4 files)
│   │   │   ├── cors.ts                # CORS policy configuration
│   │   │   ├── errorHandler.ts        # Global error handling
│   │   │   ├── logger.ts              # Request/response logging
│   │   │   └── validation.ts          # Input validation patterns
│   │   │
│   │   └── utilities/                 # Helper functions (4 files)
│   │       ├── envConfig.ts           # Environment variable management
│   │       ├── markdownUtils.ts       # Markdown rendering for docs
│   │       ├── responseUtils.ts       # Standardized API responses
│   │       └── validationUtils.ts     # Input sanitization utilities
│   │
│   ├── controllers/                   # Request handlers (4 files)
│   │   ├── index.ts                   # Barrel exports
│   │   ├── healthController.ts        # Health monitoring endpoints
│   │   ├── helloController.ts         # HTTP methods demonstration
│   │   └── parametersController.ts    # Parameter types demonstration
│   │
│   └── routes/                        # Route definitions
│       ├── index.ts                   # Main router configuration
│       └── open/                      # Public routes (no authentication)
│           ├── index.ts               # Route aggregation
│           ├── docsRoutes.ts          # Documentation viewer endpoints
│           ├── healthRoutes.ts        # Health check routes
│           ├── helloRoutes.ts         # Hello World demo routes
│           └── parametersRoutes.ts    # Parameter demo routes
│
├── docs/                              # Educational documentation (13 files)
│   ├── http-fundamentals.md          # HTTP protocol basics
│   ├── http-history-evolution.md     # HTTP version history
│   ├── http-methods.md               # HTTP methods deep dive
│   ├── http-status-codes.md          # Status codes reference
│   ├── request-response-model.md     # Request/response cycle
│   ├── client-server-architecture.md # Architectural patterns
│   ├── node-express-architecture.md  # Express.js patterns
│   ├── typescript-patterns.md        # TypeScript best practices
│   ├── error-handling-patterns.md    # Error management
│   ├── environment-configuration.md  # Environment setup
│   ├── testing-strategies.md         # Testing approaches
│   ├── API_DOCUMENTATION.md          # API reference
│   ├── README.md                     # Documentation index
│   └── openapi.json                  # OpenAPI specification
│
├── testing/                          # Test suites
│   └── postman/                      # Postman collection
│       ├── HelloWorld-API.postman_collection.json
│       ├── HelloWorld-Environment.postman_environment.json
│       └── README.md                 # Testing guide
│
├── ai/                               # AI assistant instructions
│   └── instructions.md               # Development guidelines for AI
│
├── dist/                             # Compiled JavaScript (generated by build)
├── node_modules/                     # Dependencies (generated by npm install)
│
├── .env.example                      # Environment variables template
├── .eslintrc.js                      # ESLint configuration
├── .gitignore                        # Git ignore rules
├── package.json                      # Project metadata & scripts
├── package-lock.json                 # Locked dependency versions
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # This file
```

### What Goes Where?

**Adding a new endpoint?**
1. Create controller in `src/controllers/`
2. Create routes in `src/routes/open/`
3. Register routes in `src/routes/index.ts`

**Adding types?**
- Add to `src/types/apiTypes.ts` or `src/types/errorTypes.ts`
- Export from `src/types/index.ts`

**Adding middleware?**
- Create in `src/core/middleware/`
- Register in `src/app.ts`

**Adding utilities?**
- Create in `src/core/utilities/`
- Use throughout your controllers

**Adding documentation?**
- Add markdown files to `docs/`
- Link from `docs/README.md`

---

## 📡 API Endpoints

### Health Monitoring

**Basic Health Check**
```bash
GET /health

# Example:
curl http://localhost:8000/health

# Response:
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2025-09-30T10:30:00.000Z"
  },
  "message": "API is healthy",
  "timestamp": "2025-09-30T10:30:00.000Z"
}
```

**Detailed Health Check**
```bash
GET /health/detailed

# Example:
curl http://localhost:8000/health/detailed

# Response:
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2025-09-30T10:30:00.000Z",
    "details": {
      "uptime": 123456,
      "memory": {
        "used": 45678912,
        "total": 67891234
      },
      "version": "1.0.0",
      "environment": "development"
    }
  },
  "message": "Detailed health information",
  "timestamp": "2025-09-30T10:30:00.000Z"
}
```

### HTTP Methods Demonstration

All five major HTTP methods demonstrated on the same endpoint:

**GET - Retrieve Data**
```bash
GET /hello

curl http://localhost:8000/hello

# Response:
{
  "success": true,
  "data": {
    "message": "Hello, World!",
    "method": "GET",
    "description": "GET is used for retrieving data. It's safe and idempotent.",
    "timestamp": "2025-09-30T10:30:00.000Z"
  },
  "message": "Hello message retrieved successfully",
  "timestamp": "2025-09-30T10:30:00.000Z"
}
```

**POST - Create Data**
```bash
POST /hello

curl -X POST http://localhost:8000/hello

# Response: (Status 201 Created)
{
  "success": true,
  "data": {
    "message": "Hello, World!",
    "method": "POST",
    "description": "POST is used for creating resources or submitting data.",
    "timestamp": "2025-09-30T10:30:00.000Z"
  },
  "message": "Hello message created successfully",
  "timestamp": "2025-09-30T10:30:00.000Z"
}
```

**PUT - Replace Data**
```bash
PUT /hello

curl -X PUT http://localhost:8000/hello
```

**PATCH - Update Data**
```bash
PATCH /hello

curl -X PATCH http://localhost:8000/hello
```

**DELETE - Remove Data**
```bash
DELETE /hello

curl -X DELETE http://localhost:8000/hello
```

### Parameters Demonstration

**Query Parameters**
```bash
GET /parameters/query?name=John

# Example:
curl "http://localhost:8000/parameters/query?name=John"

# Response:
{
  "success": true,
  "data": {
    "message": "Hello, John!",
    "parameterType": "query",
    "parameterValue": "John",
    "validation": {
      "applied": ["required", "length(1-50)", "sanitized"],
      "sanitized": false
    },
    "description": "Query parameters are ideal for optional filters, pagination...",
    "timestamp": "2025-09-30T10:30:00.000Z"
  },
  "message": "Query parameter processed successfully",
  "timestamp": "2025-09-30T10:30:00.000Z"
}
```

**Path Parameters**
```bash
GET /parameters/path/{name}

# Example:
curl http://localhost:8000/parameters/path/Alice

# Response:
{
  "success": true,
  "data": {
    "message": "Hello, Alice!",
    "parameterType": "path",
    "parameterValue": "Alice",
    "validation": {
      "applied": ["required", "length(1-30)", "alphanumeric", "sanitized"],
      "sanitized": false
    },
    "description": "Path parameters identify specific resources...",
    "timestamp": "2025-09-30T10:30:00.000Z"
  }
}
```

**Request Body Parameters**
```bash
POST /parameters/body
Content-Type: application/json

# Example:
curl -X POST http://localhost:8000/parameters/body \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob"}'

# Response:
{
  "success": true,
  "data": {
    "message": "Hello, Bob!",
    "parameterType": "body",
    "parameterValue": "Bob",
    "validation": {
      "applied": ["required", "length(1-100)", "json-format", "sanitized"],
      "sanitized": false
    },
    "description": "Request body is ideal for complex data structures...",
    "timestamp": "2025-09-30T10:30:00.000Z"
  }
}
```

**Header Parameters**
```bash
GET /parameters/headers
X-User-Name: Charlie

# Example:
curl http://localhost:8000/parameters/headers \
  -H "X-User-Name: Charlie"

# Response:
{
  "success": true,
  "data": {
    "message": "Hello, Charlie!",
    "parameterType": "header",
    "parameterValue": "Charlie",
    "validation": {
      "applied": ["required", "length(1-50)", "header-format", "sanitized"],
      "sanitized": false
    },
    "description": "Headers carry metadata about requests...",
    "timestamp": "2025-09-30T10:30:00.000Z"
  }
}
```

### Documentation Endpoints

**API Discovery**
```bash
GET /

curl http://localhost:8000/

# Returns: JSON with all available endpoints and their descriptions
```

**Documentation Viewer**
```bash
GET /docs

# Opens: Interactive documentation browser

GET /docs/{filename}

# Example:
curl http://localhost:8000/docs/http-methods.md
# Returns: Rendered markdown documentation
```

**Swagger UI**
```bash
GET /api-docs

# Opens: Interactive Swagger UI for testing all endpoints
```

### Response Structure

**All successful responses follow this format:**
```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "message": "Optional success message",
  "timestamp": "2025-09-30T10:30:00.000Z"
}
```

**All error responses follow this format:**
```json
{
  "success": false,
  "message": "Human-readable error description",
  "code": "ERROR_CODE",
  "timestamp": "2025-09-30T10:30:00.000Z",
  "details": { /* optional error details (development only) */ }
}
```

---

## 🛠️ Development Workflow

### Recommended IDE Setup (VS Code)

**Essential Extensions:**
- **ESLint** - Real-time linting and error detection
- **Prettier - Code formatter** - Automatic code formatting
- **TypeScript Importer** - Auto-import TypeScript types
- **REST Client** - Test APIs without leaving VS Code
- **Thunder Client** - Alternative to Postman (lightweight)

**Install all at once:**
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension pmneo.tsimporter
code --install-extension humao.rest-client
code --install-extension rangav.vscode-thunder-client
```

### Daily Development Workflow

**1. Start Your Day**
```bash
# Pull latest changes (if using Git)
git pull

# Install any new dependencies
npm install

# Start development server
npm run dev
```

**2. Make Changes**
- Edit TypeScript files in `src/`
- Server automatically restarts on file save
- Check terminal for compilation errors
- Test endpoints in browser or Postman

**3. Test Your Changes**
```bash
# Check TypeScript types
npm run type-check

# Run linter
npm run lint

# Format code
npm run format

# Test endpoints
curl http://localhost:8000/your-endpoint
```

**4. Before Committing (Git)**
```bash
# Run all quality checks
npm run type-check && npm run lint && npm run format

# Build to verify production compilation
npm run build

# Commit your changes
git add .
git commit -m "Descriptive commit message"
git push
```

### Debugging Tips

**TypeScript Errors:**
- Run `npm run type-check` to see all type errors
- Check `tsconfig.json` for configuration
- Ensure imports use correct path aliases (`@/`, `@middleware/*`)

**Server Won't Start:**
- Check if port 8000 is in use: `lsof -i :8000` (Mac/Linux)
- Change PORT in `.env` file
- Verify Node.js version: `node --version`

**Module Not Found:**
- Run `npm install` to install dependencies
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

**CORS Errors:**
- Check `CORS_ORIGINS` in `.env`
- Add your frontend URL to allowed origins
- Review `src/core/middleware/cors.ts`

---

## 🔧 Configuration

### Environment Variables

The `.env` file controls server behavior. Copy from `.env.example` to get started.

**Available Configuration:**

```bash
# Server Configuration
PORT=8000                              # Port number for the API server
NODE_ENV=development                   # Environment: development | staging | production

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
# Comma-separated list of allowed origins for cross-origin requests

# Request Configuration
BODY_LIMIT=10mb                        # Maximum request body size
ENABLE_LOGGING=true                    # Enable/disable request logging

# API Configuration
API_VERSION=1.0.0                      # Current API version (shown in health checks)
```

**Environment-Specific Settings:**

**Development (default):**
```bash
NODE_ENV=development
ENABLE_LOGGING=true
BODY_LIMIT=10mb
```
- Verbose logging with request/response details
- Detailed error messages with stack traces
- Hot-reload enabled
- CORS allows localhost origins

**Production:**
```bash
NODE_ENV=production
ENABLE_LOGGING=false
BODY_LIMIT=1mb
CORS_ORIGINS=https://yourdomain.com
```
- Minimal logging (errors only)
- Generic error messages (no stack traces)
- Optimized performance
- Strict CORS policy

### TypeScript Configuration

The project uses strict TypeScript for maximum type safety:

**Key Features:**
- **Path Mapping** - Clean imports with `@/` aliases
- **Strict Type Checking** - All strict options enabled
- **ES2022 Target** - Modern JavaScript features
- **Source Maps** - Debug compiled JavaScript

**Import Examples:**
```typescript
// Clean imports using path aliases
import { ApiResponse, ErrorCodes } from '@/types';
import { sendSuccess } from '@utilities/responseUtils';
import { getHealth } from '@controllers/healthController';
import { corsMiddleware } from '@middleware/cors';

// Instead of messy relative imports like:
// import { ApiResponse } from '../../../types';
```

---

## 🧪 Testing

### Testing with Postman

**Complete API test collection included in `testing/postman/`**

**Setup:**

1. **Install Postman** (if not already installed)
   - Download: [https://www.postman.com/downloads/](https://www.postman.com/downloads/)

2. **Import Collection**
   - Open Postman
   - Click **Import** button
   - Select `testing/postman/HelloWorld-API.postman_collection.json`

3. **Import Environment**
   - Click **Import** button again
   - Select `testing/postman/HelloWorld-Environment.postman_environment.json`
   - Select "HelloWorld-Environment" from environment dropdown

4. **Run Tests**
   - Click **Run Collection** to run all tests
   - Or click individual requests to test one at a time

**Test Categories:**

✅ **Health Checks**
- Basic health endpoint validation
- Detailed health response structure
- Response time verification

✅ **HTTP Methods**
- GET, POST, PUT, PATCH, DELETE demonstrations
- Response format validation
- Status code verification

✅ **Parameters**
- Query parameter handling
- Path parameter extraction
- Request body parsing
- Header parameter reading

✅ **Error Handling**
- 404 Not Found responses
- Invalid request handling
- Malformed JSON detection

✅ **CORS Testing**
- Cross-origin request validation
- Preflight request handling

✅ **Performance**
- Response time benchmarks
- Response size validation

### Automated Testing with Newman

**Newman is the command-line collection runner for Postman.**

**Install Newman:**
```bash
npm install -g newman
```

**Run Tests:**
```bash
# Run all tests in collection
npm run test:postman

# Or run manually:
newman run testing/postman/HelloWorld-API.postman_collection.json \
  -e testing/postman/HelloWorld-Environment.postman_environment.json
```

**CI/CD Integration:**
- Newman can be integrated into GitHub Actions, GitLab CI, etc.
- Automated testing on every commit
- See `testing/postman/README.md` for details

### Testing in Browser

**Simple endpoint testing:**

1. Start the server: `npm run dev`
2. Open browser and navigate to:
   - [http://localhost:8000/health](http://localhost:8000/health)
   - [http://localhost:8000/hello](http://localhost:8000/hello)
   - [http://localhost:8000/api-docs](http://localhost:8000/api-docs)

3. For POST/PUT/PATCH/DELETE, use Swagger UI or Postman

### Testing with cURL

**Command-line testing examples:**

```bash
# GET request
curl http://localhost:8000/health

# POST request with JSON body
curl -X POST http://localhost:8000/parameters/body \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'

# Request with custom header
curl http://localhost:8000/parameters/headers \
  -H "X-User-Name: TestUser"

# Verbose output (see full request/response)
curl -v http://localhost:8000/health
```

---

## 🚨 Troubleshooting

### Common Issues and Solutions

**Issue: Port 8000 already in use**
```
Error: listen EADDRINUSE: address already in use :::8000
```
**Solutions:**
```bash
# Option 1: Find and kill the process using port 8000
# macOS/Linux:
lsof -ti :8000 | xargs kill -9

# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Option 2: Change the port in .env
# Edit .env and change PORT=8000 to PORT=3000 (or any available port)
```

**Issue: Module not found errors**
```
Error: Cannot find module 'express'
```
**Solution:**
```bash
# Reinstall dependencies
npm install

# If that doesn't work, clean install:
rm -rf node_modules package-lock.json
npm install
```

**Issue: TypeScript compilation errors**
```
Error: Cannot find name 'Request'
```
**Solution:**
```bash
# Run type check to see all errors
npm run type-check

# Ensure @types packages are installed
npm install --save-dev @types/node @types/express

# Check tsconfig.json is present and valid
```

**Issue: CORS errors in browser**
```
Access to fetch at 'http://localhost:8000' has been blocked by CORS policy
```
**Solution:**
```bash
# Add your frontend URL to .env
CORS_ORIGINS=http://localhost:3000,http://localhost:8000

# Restart server after changing .env
```

**Issue: Changes not reflecting**
**Solution:**
```bash
# Make sure you're running in dev mode (auto-restart)
npm run dev

# If in production mode, rebuild:
npm run build && npm start

# Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)
```

**Issue: JSON syntax errors**
```
SyntaxError: Unexpected token in JSON at position X
```
**Solution:**
- Validate JSON using [jsonlint.com](https://jsonlint.com/)
- Check for trailing commas, missing quotes
- Ensure Content-Type header is `application/json`

**Issue: npm install fails**
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Update npm
npm install -g npm@latest

# Try again
npm install
```

### Getting Help

1. **Check Documentation**
   - Read relevant docs in `docs/` folder
   - Check Swagger UI at `/api-docs`

2. **Check Logs**
   - Terminal output shows detailed error messages
   - Look for stack traces in development mode

3. **Ask Professor Bryan**
   - Office hours
   - Email: cfb3@uw.edu
   - Canvas discussion forum

4. **Online Resources**
   - [Express.js Documentation](https://expressjs.com/)
   - [TypeScript Documentation](https://www.typescriptlang.org/docs/)
   - [Node.js Documentation](https://nodejs.org/docs/)

---

## 🛡️ Security Considerations

This project includes basic security practices appropriate for learning:

### Implemented Security Features

**1. CORS (Cross-Origin Resource Sharing)**
- Configurable allowed origins in `.env`
- Prevents unauthorized frontend access
- Located in `src/core/middleware/cors.ts`

**2. Input Validation & Sanitization**
- All user inputs are sanitized
- Length validation on strings
- Type checking on parameters
- See `src/core/utilities/validationUtils.ts`

**3. Error Handling**
- Prevents information leakage
- Generic error messages in production
- Detailed errors only in development
- See `src/core/middleware/errorHandler.ts`

**4. Environment Variable Protection**
- `.env` file not committed to Git
- Sensitive configuration kept separate
- `.env.example` template provided

**5. Request Size Limits**
- Body size limited to prevent abuse
- Configurable via `BODY_LIMIT` in `.env`

### Security Best Practices for Students

**DO:**
- ✅ Validate all user inputs
- ✅ Sanitize data before processing
- ✅ Use environment variables for config
- ✅ Keep dependencies updated
- ✅ Use HTTPS in production

**DON'T:**
- ❌ Commit `.env` files
- ❌ Store passwords in code
- ❌ Trust user input without validation
- ❌ Expose detailed errors in production
- ❌ Ignore security warnings

### Future Security Enhancements

As you advance in the course, you may add:
- Authentication (JWT, OAuth)
- Rate limiting
- Request throttling
- SQL injection prevention (when adding database)
- XSS protection
- CSRF tokens

---

## 📚 Additional Resources

### Official Documentation

**Core Technologies:**
- [Express.js Documentation](https://expressjs.com/) - Official Express guide
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Complete TypeScript reference
- [Node.js Documentation](https://nodejs.org/docs/) - Node.js API reference
- [npm Documentation](https://docs.npmjs.com/) - Package management

**HTTP & REST:**
- [MDN HTTP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP) - Comprehensive HTTP guide
- [REST API Tutorial](https://restfulapi.net/) - RESTful design principles
- [HTTP Status Codes](https://httpstatuses.com/) - Interactive status code reference

**Tools:**
- [Postman Learning Center](https://learning.postman.com/) - API testing tutorials
- [VS Code Documentation](https://code.visualstudio.com/docs) - Editor features and shortcuts

### Recommended Books

**For Beginners:**
- "Node.js Design Patterns" by Mario Casciaro
- "Learning TypeScript" by Josh Goldberg
- "REST API Design Rulebook" by Mark Masse

**For Advanced Students:**
- "Web Scalability for Startup Engineers" by Artur Ejsmont
- "Building Microservices" by Sam Newman

### Online Courses & Tutorials

**Free Resources:**
- [freeCodeCamp](https://www.freecodecamp.org/) - Full-stack web development
- [The Odin Project](https://www.theodinproject.com/) - Backend development path
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices) - Production patterns

**Video Tutorials:**
- [Traversy Media](https://www.youtube.com/@TraversyMedia) - Express.js and Node tutorials
- [Net Ninja](https://www.youtube.com/@NetNinja) - TypeScript and Node courses

### UW Tacoma Resources

**Course Materials:**
- Canvas course page for TCSS-460
- Office hours schedule
- Assignment submission guidelines

**Support:**
- SET Computer Labs
- UW Tacoma Library computing resources
- Student Tech Support

---

## 🎓 Academic Integrity

### Collaboration Policy

**Allowed:**
- ✅ Discussing concepts and approaches with classmates
- ✅ Helping others debug general issues
- ✅ Sharing knowledge about tools and documentation
- ✅ Using official documentation and course materials
- ✅ Asking questions in office hours

**Not Allowed:**
- ❌ Copying code from other students
- ❌ Sharing assignment solutions
- ❌ Using code from previous quarters without permission
- ❌ Submitting AI-generated code without understanding it
- ❌ Having someone else write your code

### Using This Template

This HelloWorld API template is:
- ✅ **Provided for learning** - Study, understand, and modify
- ✅ **Assignment starter** - Use as foundation for assignments
- ✅ **Final project base** - Extend for your project

When using this template:
- **Understand every line** - Don't just copy and paste
- **Cite when appropriate** - Acknowledge template origins in assignments
- **Add your own work** - Extend with original features
- **Follow assignment guidelines** - Some assignments may restrict template use

### Citation Format

If required to cite this template:
```
Based on TCSS-460 HelloWorld API Template
University of Washington Tacoma, Autumn 2025
Professor Charles Bryan
```

### Questions About Academic Integrity?

**Contact:**
- Professor Charles Bryan: cfb3@uw.edu
- Review UW's [Academic Integrity Policy](https://www.washington.edu/cssc/for-students/academic-misconduct/)

---

## 🤝 Contributing

### For Students: Improving the Template

Found a bug? Have a suggestion? Contributions are welcome!

**Before Contributing:**
1. Check if issue already exists
2. Discuss with Professor Bryan
3. Follow project code style

**How to Contribute:**

1. **Report Issues**
   - Describe the problem clearly
   - Include steps to reproduce
   - Share error messages

2. **Suggest Improvements**
   - Explain the benefit
   - Provide examples
   - Consider backward compatibility

3. **Submit Code Changes**
   ```bash
   # Create a new branch
   git checkout -b feature/your-improvement

   # Make your changes
   # Test thoroughly

   # Commit with clear message
   git commit -m "Add: feature description"

   # Push and create pull request
   git push origin feature/your-improvement
   ```

### Code Style Guidelines

**TypeScript:**
- Use full variable names (`request` not `req`)
- Prefer functional expressions when readable
- Add JSDoc comments for functions
- Use interfaces for complex types

**Structure:**
- Controllers handle business logic
- Routes define endpoints
- Middleware processes requests
- Utilities provide helpers

**Documentation:**
- Update README for new features
- Add inline comments for complex logic
- Create docs for major concepts

### Review Process

1. Code submitted for review
2. Professor Bryan or TA reviews
3. Feedback provided
4. Changes made if needed
5. Merged when approved

---

## 📄 License

MIT License - This project is free to use for educational purposes.

---

## 📞 Contact & Support

### Course Instructor

**Professor Charles Bryan**
- **Email:** cfb3@uw.edu
- **Office Hours:** (Posted on Canvas)
- **Course:** TCSS 460 A - Client/Server Programming for Internet Applications
- **Quarter:** Autumn 2025

### Institution

**University of Washington Tacoma**
**School of Engineering and Technology**
**Computer Science and Systems Division**

Campus Address:
1900 Commerce Street
Tacoma, WA 98402-3100

### Getting Help

**For Course-Related Questions:**
1. Check this README and documentation in `docs/`
2. Search Canvas discussion forum
3. Attend office hours
4. Email Professor Bryan

**For Technical Issues:**
1. Check Troubleshooting section above
2. Review official documentation
3. Post on Canvas discussion (help others too!)
4. Email with specific error details

**For Assignment Questions:**
- Refer to assignment instructions on Canvas
- Clarify requirements in office hours
- Don't wait until the last minute!

---

## 🎯 Learning Objectives Recap

By working with this project, you will learn:

### **HTTP Fundamentals**
- Request/Response model
- HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Status codes and their meanings
- Headers and how to use them

### **Express.js & Node.js**
- MVC architecture pattern
- Middleware pipeline
- Routing and controllers
- Error handling strategies

### **TypeScript**
- Type safety in APIs
- Interfaces and types
- Modern JavaScript (ES2022)
- Path mapping and modules

### **Professional Practices**
- Code organization and structure
- Environment configuration
- Testing methodologies
- Documentation standards
- Version control with Git

### **API Design**
- RESTful principles
- Response standardization
- Error handling patterns
- Security considerations

### **Development Workflow**
- Linting and formatting
- Type checking
- Automated testing
- Deployment preparation

---

## 🚀 Next Steps

**Now that your environment is set up:**

1. **✅ Explore the API**
   - Open [http://localhost:8000/api-docs](http://localhost:8000/api-docs)
   - Try different endpoints in Swagger UI
   - Observe request/response patterns

2. **📖 Read the Documentation**
   - Start with `docs/http-fundamentals.md`
   - Follow the recommended learning path
   - Take notes on key concepts

3. **🔧 Experiment**
   - Modify existing endpoints
   - Add console.log to understand flow
   - Break things and fix them (learning!)

4. **🧪 Test Your Understanding**
   - Run Postman collection
   - Try cURL commands
   - Predict responses before making requests

5. **💡 Build Something**
   - Add a new endpoint
   - Implement new features
   - Apply concepts to assignments

6. **🤔 Ask Questions**
   - No question is too small
   - Attend office hours
   - Engage with classmates

---

**Ready to build amazing web APIs? Let's get started! 🎓**

---

**Built with ❤️ for TCSS-460 students at UW Tacoma**
