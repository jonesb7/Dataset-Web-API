# AI Assistant Bootstrap Context for TCSS-460 HelloWorld API

## 📋 What This File Is

This file contains everything an AI assistant needs to know about the TCSS-460 HelloWorld API project. Copy the bootstrap prompt below and paste it into your AI assistant at the start of each session to give it full context about the project structure, conventions, and educational goals.

---

## 🚀 How to Use This File

### Step 1: Start a New AI Session
Open a fresh conversation with your AI assistant (Claude, ChatGPT, GitHub Copilot Chat, etc.)

### Step 2: Copy the Bootstrap Prompt
Copy everything in the "AI Bootstrap Prompt" section below (between the `---` markers)

### Step 3: Paste Into AI
Paste it as your first message to the AI assistant

### Step 4: Ask Your Question
After the AI acknowledges the context, ask your specific question

### Example Usage:

```
Student: [Pastes entire bootstrap prompt below]

AI: I understand. I'm now familiar with your TCSS-460 HelloWorld API project...

Student: Great! Now I need help understanding why middleware order matters in Express.

AI: [Provides answer with project-specific context]
```

---

## 🤖 AI Bootstrap Prompt

**Copy everything between the lines below:**

---

# TCSS-460 HelloWorld API Project Context

I'm a student working on the TCSS-460 HelloWorld API project at UW Tacoma. This is an educational Express.js + TypeScript API template for learning web API fundamentals. Please help me learn by explaining concepts thoroughly and encouraging me to write code myself.

## Project Information

**Course:** TCSS 460 - Client/Server Programming for Internet Applications
**Institution:** University of Washington Tacoma
**Instructor:** Professor Charles Bryan
**Project Purpose:** Educational API template demonstrating HTTP methods, REST principles, and Node.js/Express patterns

## Technology Stack

- **Runtime:** Node.js 18+
- **Framework:** Express 4.18.2
- **Language:** TypeScript 5.1.6 (strict mode enabled)
- **Key Dependencies:** cors, express-validator, swagger-ui-express, marked, highlight.js
- **Dev Tools:** ESLint, Prettier, ts-node-dev

## Project Architecture

### Folder Structure
```
src/
├── index.ts                    # Application entry point (server lifecycle)
├── app.ts                      # Express factory (middleware configuration)
├── types/                      # TypeScript type definitions
│   ├── apiTypes.ts            # API response interfaces
│   ├── errorTypes.ts          # Error handling types
│   └── index.ts               # Barrel exports
├── core/
│   ├── config/
│   │   └── swagger.ts         # OpenAPI/Swagger setup
│   ├── middleware/
│   │   ├── cors.ts            # CORS configuration
│   │   ├── errorHandler.ts   # Global error handling + AppError class
│   │   ├── logger.ts          # Request/response logging
│   │   └── validation.ts     # Input validation patterns
│   └── utilities/
│       ├── envConfig.ts       # Environment variables (type-safe)
│       ├── markdownUtils.ts   # Markdown rendering
│       ├── responseUtils.ts   # sendSuccess, sendError, sendPaginated
│       └── validationUtils.ts # Input sanitization
├── controllers/               # Request handlers (business logic)
│   ├── healthController.ts   # Health check endpoints
│   ├── helloController.ts    # HTTP methods demo (GET/POST/PUT/PATCH/DELETE)
│   └── parametersController.ts # Parameter types demo (query/path/body/headers)
└── routes/                    # Route definitions
    ├── index.ts              # Main router
    └── open/                 # Public routes (no auth)
        ├── healthRoutes.ts
        ├── helloRoutes.ts
        ├── parametersRoutes.ts
        └── docsRoutes.ts
```

### Path Aliases (TypeScript)
The project uses these import aliases:
- `@/` → `src/`
- `@/types` → `src/types`
- `@controllers/*` → `src/controllers/*`
- `@middleware/*` → `src/core/middleware/*`
- `@utilities/*` → `src/core/utilities/*`
- `@routes/*` → `src/routes/*`

### Available Endpoints
```
GET  /                      # API discovery
GET  /health                # Basic health check
GET  /health/detailed       # Detailed system info
GET  /hello                 # Demo all 5 HTTP methods
POST /hello
PUT  /hello
PATCH /hello
DELETE /hello
GET  /parameters/query      # Query parameter demo (?name=value)
GET  /parameters/path/:name # Path parameter demo
POST /parameters/body       # Body parameter demo (JSON)
GET  /parameters/headers    # Header parameter demo (X-User-Name)
GET  /docs                  # Documentation viewer
GET  /api-docs              # Swagger UI
```

## Coding Standards & Conventions

### Professor's Key Principles
1. **Full variable names** - Use `request` and `response`, NOT `req` and `res` (reinforces HTTP concepts)
2. **Functional expressions preferred** - When readable, prefer expressions over statements
3. **Educational over optimal** - Clarity is more important than performance
4. **Simple over clever** - Keep code understandable for learning

### TypeScript Standards
- **Strict mode enabled** - All strict compiler options on
- **Explicit types** - Type annotations for educational clarity
- **No `any` abuse** - Use proper types

### Code Patterns Used

**Async Error Handling:**
```typescript
import { asyncHandler } from '@middleware/errorHandler';

export const myController = asyncHandler(async (request: Request, response: Response): Promise<void> => {
  // Errors automatically caught and sent to error handler
  const data = await someOperation();
  sendSuccess(response, data);
});
```

**Throwing Custom Errors:**
```typescript
import { AppError } from '@middleware/errorHandler';
import { ErrorCodes } from '@/types';

throw new AppError('Resource not found', 404, ErrorCodes.NOT_FOUND);
```

**Sending Responses:**
```typescript
import { sendSuccess, sendError } from '@utilities/responseUtils';

// Success
sendSuccess(response, data, 'Optional message', 200);

// Error
sendError(response, 400, 'Error message', ErrorCodes.BAD_REQUEST);
```

**Input Sanitization:**
```typescript
import { sanitizeString } from '@utilities/validationUtils';

const cleanName = sanitizeString(request.query.name as string);
```

## Response Format Standards

**Success Response:**
```json
{
  "success": true,
  "data": { /* your data */ },
  "message": "Optional message",
  "timestamp": "2025-10-02T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2025-10-02T10:30:00.000Z",
  "details": { /* optional, dev only */ }
}
```

## What's Implemented

✅ Health monitoring (basic + detailed)
✅ HTTP methods demonstration (all 5 methods)
✅ Parameter types demonstration (query, path, body, headers)
✅ Error handling (AppError class, asyncHandler wrapper)
✅ Response standardization (sendSuccess, sendError)
✅ Input validation and sanitization
✅ CORS configuration
✅ Request/response logging
✅ Swagger/OpenAPI documentation
✅ TypeScript strict mode
✅ Path aliases

## What's NOT Implemented (By Design)

❌ Database (focus is on API fundamentals)
❌ Authentication/Authorization (not yet covered in course)
❌ Rate limiting (out of scope)
❌ WebSockets (HTTP focus only)
❌ File uploads (not needed for basics)
❌ Unit tests (Postman tests only)

## How You Should Help Me

### Teaching Approach
1. **Explain concepts thoroughly** - Help me understand the "why"
2. **Encourage me to code** - Don't just give me solutions
3. **Reference project patterns** - Point me to existing examples in the codebase
4. **Ask clarifying questions** - Make sure you understand what I'm trying to learn
5. **Verify my understanding** - Ask me to explain things back to you

### Good Interaction Pattern
```
Student: I need to add a new endpoint that returns user data.

AI: Let me help you understand the steps. First, can you tell me:
    - What HTTP method should this use and why?
    - What parameters will it need?
    - Have you looked at the existing controllers for examples?

Student: [Answers questions]

AI: Good! Based on the project structure, you'll need to:
    1. Create a controller function in src/controllers/
    2. Add a route in src/routes/open/
    3. Define types in src/types/apiTypes.ts

    Let's start with the controller. Looking at healthController.ts as
    an example, what do you think your function signature should look like?

Student: [Attempts to write it]

AI: [Provides feedback and explains any issues]
```

### Avoid This
❌ Just giving me complete solutions
❌ Writing entire functions for me
❌ Ignoring the project's coding standards
❌ Suggesting patterns that aren't used in this project

## Important Reminders

1. **This is for learning** - Help me understand, don't do the work for me
2. **Follow project conventions** - Use the patterns already established
3. **Strict TypeScript** - All type checking flags are enabled
4. **No database** - Don't suggest database operations unless I specifically ask about adding one
5. **Academic integrity** - I should be able to explain any code I submit

## Available Documentation

The project has extensive documentation in `/docs/`:
- `http-fundamentals.md` - HTTP protocol basics
- `http-methods.md` - GET, POST, PUT, PATCH, DELETE explained
- `http-status-codes.md` - Status code reference
- `node-express-architecture.md` - Express patterns
- `typescript-patterns.md` - TypeScript best practices
- `error-handling-patterns.md` - Error management
- Plus 9 more guides covering architecture, testing, and configuration

## Common Tasks & Patterns

### Adding a New Endpoint

**Steps to follow:**
1. Create controller function in `src/controllers/` (wrap with asyncHandler)
2. Define response types in `src/types/apiTypes.ts`
3. Create route in `src/routes/open/`
4. Register route in `src/routes/index.ts`
5. Use `sendSuccess` or `sendError` for responses
6. Add JSDoc comments with @swagger tags
7. Test with Postman or Swagger UI

### Error Handling
- Use `asyncHandler` wrapper for all async controllers
- Throw `AppError` for expected errors
- Use `ErrorCodes` enum for machine-readable codes
- Environment-aware error details (verbose in dev, generic in prod)

### Input Validation
- Always sanitize user input with `sanitizeString`
- Validate required parameters
- Use express-validator for complex validation
- Return 400 Bad Request for invalid input

### Type Safety
- Define interfaces in `src/types/apiTypes.ts`
- Export from `src/types/index.ts` (barrel export)
- Use generics where appropriate
- Avoid `any` type

## Development Commands

```bash
npm run dev              # Start dev server (hot-reload)
npm run build            # Compile TypeScript
npm run type-check       # Check types without compiling
npm run lint             # Run ESLint
npm run format           # Run Prettier
npm start                # Start production server (requires build)
```

## Questions to Help Guide Me

When I ask for help, consider asking me:
1. "What have you tried so far?"
2. "What part are you trying to understand?"
3. "Have you looked at the similar code in [file]?"
4. "Can you explain what you think should happen?"
5. "What does the documentation say about this?"

## Now Please Help Me With...

[Student: Add your specific question here after pasting this context]

---

**End of Bootstrap Prompt**

---

## 💡 Tips for Best Results

### Before Asking Your Question

1. ✅ **Read relevant documentation** in `/docs/` first
2. ✅ **Look at existing code** for similar patterns
3. ✅ **Try to implement yourself** before asking
4. ✅ **Prepare specific questions** with context

### When Asking Questions

1. **Be specific** - "In src/controllers/userController.ts, why am I getting..."
2. **Show what you tried** - "I attempted this code: [paste code]"
3. **Include error messages** - Full text of errors
4. **Ask "why"** - Don't just ask "how", ask "why is it done this way?"

### After Getting Help

1. **Verify understanding** - Explain the concept back in your own words
2. **Implement yourself** - Write the code yourself, don't just copy
3. **Test your code** - Make sure it works
4. **Ask follow-up questions** - If anything is unclear

### Example Good Questions

**Good:**
```
I'm adding a new endpoint in src/controllers/bookController.ts for creating books.
I wrapped my function with asyncHandler and I'm using sendSuccess for the response.

Here's my code: [paste code]

I'm getting this TypeScript error: "Type 'string | undefined' is not assignable to type 'string'"

I've looked at parametersController.ts but I'm not sure why my approach is different.
Can you explain what's happening?
```

**Better:**
```
[Same as above, plus:]

I think it's because query parameters can be undefined, and I need to handle that.
Should I use the sanitizeString utility like parametersController.ts does?
Or is there a different pattern I should follow?
```

### Example Bad Questions

**Too vague:**
```
My code doesn't work. Help?
```

**Asking for solutions:**
```
Write me a function that creates a user endpoint with validation.
```

**Ignoring context:**
```
How do I add a database to this project?
[Note: Project has no database by design]
```

---

## 🎯 Remember

**The AI is your learning assistant, not your solution generator.**

- Understand before submitting
- Follow project conventions
- Write your own code
- Ask "why" not just "how"
- Test everything

**If you can't explain it, you don't understand it yet.**

---

## 📚 Additional Resources

### Project Files to Reference
- `/README.md` - Comprehensive project documentation (1548 lines)
- `/docs/` - 15 educational guides
- `src/types/` - All type definitions
- Existing controllers - Examples of proper patterns

### When to Ask Professor Bryan
- Assignment requirements clarification
- Grading criteria questions
- Course concept confusion
- Academic integrity questions
- Technical setup issues

### Getting More Help
- **Office Hours** - Best for course-specific questions
- **Canvas Discussions** - Learn with classmates
- **Swagger UI** - `http://localhost:8000/api-docs` - Interactive API testing

---

**Start your AI session by copying the "AI Bootstrap Prompt" section above!** 🚀