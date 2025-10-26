# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an educational TypeScript/Express.js REST API project for TCSS-460 at UW Tacoma. The API serves movie dataset information from both a PostgreSQL database (Neon Cloud) and CSV files, demonstrating modern API development patterns with strict TypeScript configuration.

## Common Development Commands

### Development
```bash
npm run dev              # Start dev server with hot-reload (port 8000)
npm run build            # Compile TypeScript to dist/
npm start                # Run production build from dist/
npm run type-check       # Check types without running server
```

### Code Quality
```bash
npm run lint             # Check code style with ESLint
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Prettier
npm run format:check     # Check if code is formatted
```

### Database & Seeding
```bash
npm run seed             # Seed movie data from CSV to PostgreSQL
```

### Documentation
```bash
npm run docs:generate    # Generate OpenAPI spec
npm run docs:serve       # Serve docs (same as dev)
```

## Architecture Overview

### Request Flow
1. **Entry Point**: `src/index.ts` - Server lifecycle management with graceful shutdown
2. **App Factory**: `src/app.ts` - Express app configuration with middleware stack
3. **Middleware Pipeline**: CORS → Body Parsing → Logging → Routes → Error Handler
4. **Routes**: Route definitions in `src/routes/open/`
5. **Controllers**: Business logic handlers in `src/controllers/`
6. **Services**: Data access layer in `src/services/` (PostgreSQL queries)
7. **Database**: PostgreSQL connection pool in `src/db/pool.ts`

### Dual Data Source Architecture

**Important**: This project uses TWO data sources:

1. **PostgreSQL (Primary)** - Neon Cloud hosted database
   - Service layer: `src/services/movies.service.ts`
   - Routes: `/api/movies` (most endpoints)
   - Connection: `src/db/pool.ts` with connection pooling
   - Schema: `sql/schema_and_load.sql` (normalized relational schema with junction tables)

2. **CSV Files (Legacy)** - File-based storage
   - Controller: `src/controllers/movieController.ts` (insertMovie, deleteMovie)
   - Routes: `/api/movies/insert` and `/api/movies/delete/:id`
   - Data: `data/movies_last30years.csv`

**When adding new features**: Determine which data source is appropriate. Database operations should use the service layer pattern. CSV operations are legacy and should eventually migrate to PostgreSQL.

### Database Schema

The PostgreSQL schema is a normalized relational design:

- **Core Tables**: `movie`, `person`, `genre`, `collection`, `studio`, `role`
- **Junction Tables**: `movie_genre`, `movie_cast`, `movie_crew` (many-to-many relationships)
- **Key Pattern**: Uses `string_to_array()` to convert comma-separated genre TEXT to arrays in queries
- **Date Handling**: Robust year extraction using `LEFT(release_date::text, 4)::int`

See `project_files/er_diagram.md` for full ER diagram and `sql/schema_and_load.sql` for schema DDL.

### TypeScript Path Mapping

The project uses path aliases for clean imports:

```typescript
@/types          → src/types
@controllers/*   → src/controllers/*
@middleware/*    → src/core/middleware/*
@utilities/*     → src/core/utilities/*
@routes/*        → src/routes/*
```

**Always use these aliases** instead of relative imports. This is configured in `tsconfig.json` and requires `tsconfig-paths/register` for runtime.

### Middleware Stack Order (Critical)

The middleware order in `src/app.ts` must be maintained:

1. **Trust Proxy** - For deployment behind load balancers
2. **CORS** - Security policy (`src/core/middleware/cors.ts`)
3. **Body Parsing** - JSON and URL-encoded (10MB limit)
4. **Logging** - Request/response logging (`src/core/middleware/logger.ts`)
5. **Swagger Docs** - API documentation at `/api-docs`
6. **Routes** - Application routes
7. **Error Handler** - Global error handling (must be last)

### Environment Configuration

Required environment variables (see `.env.example`):

- `NEON_DATABASE_URL` or `DATABASE_URL` - PostgreSQL connection string (required)
- `PORT` - Server port (default: 8000)
- `NODE_ENV` - Environment mode (development/production)
- `CORS_ORIGINS` - Comma-separated allowed origins
- `BODY_LIMIT` - Max request body size
- `ENABLE_LOGGING` - Enable request logging
- `API_VERSION` - API version for health checks

**Database Connection**: The pool auto-detects SSL requirement based on connection string (non-localhost = SSL enabled).

## Key Patterns & Conventions

### API Response Format

All successful responses use a standardized format from `src/core/utilities/responseUtils.ts`:

```typescript
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "message": "Optional success message",
  "timestamp": "ISO-8601 timestamp"
}
```

Error responses:
```typescript
{
  "success": false,
  "message": "Human-readable error",
  "code": "ERROR_CODE",
  "timestamp": "ISO-8601 timestamp",
  "details": { /* only in development */ }
}
```

### Pagination Pattern

List endpoints use cursor-based pagination:

```typescript
{
  page: number,      // Current page (1-indexed)
  pageSize: number,  // Items per page (max 100)
  // Optional filters
  year?: string,
  title?: string,
  genre?: string
}
```

Implemented with `LIMIT` and `OFFSET` in SQL queries.

### Error Handling

- **Operational Errors**: Caught and formatted with proper HTTP status codes
- **Programming Errors**: Logged and return generic 500 errors in production
- **Global Handler**: `src/core/middleware/errorHandler.ts` catches all errors
- **Validation**: Use express-validator in routes, utilities in `src/core/utilities/validationUtils.ts`

### TypeScript Strict Mode

This project uses **maximum strictness** (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, etc.):

- All optional properties must be explicitly handled
- Array/object access may return undefined - always check
- No implicit any types allowed
- Function return types must be explicit

**When adding code**: Ensure full type coverage. Use `npm run type-check` frequently.

### File Organization

```
src/
├── index.ts                 # Entry point
├── app.ts                   # Express app factory
├── types/                   # Type definitions
│   ├── apiTypes.ts         # API response interfaces
│   └── errorTypes.ts       # Error types
├── core/                    # Infrastructure
│   ├── config/             # Configuration
│   ├── middleware/         # Express middleware
│   └── utilities/          # Helper functions
├── controllers/            # Request handlers
├── routes/                 # Route definitions
│   └── open/              # Public routes (no auth)
├── services/              # Data access layer (DB queries)
└── db/                    # Database connection
```

**Adding new features**:
1. Types in `src/types/`
2. Service functions in `src/services/` for DB access
3. Controllers in `src/controllers/` for business logic
4. Routes in `src/routes/open/`
5. Register routes in `src/routes/index.ts` or `src/app.ts`

## Swagger/OpenAPI Documentation

- Spec file: `project_files/api.yaml` (YAML format)
- Loaded dynamically in `src/app.ts` using `fs` and `yaml` parser
- Served at `/api-docs` via swagger-ui-express
- Root `/` redirects to `/api-docs`

**When adding endpoints**: Update `project_files/api.yaml` with OpenAPI 3.0 spec.

## Testing Approach

- No unit tests currently configured (`npm test` exits 0)
- Postman collection available in `testing/postman/`
- Newman for automated API testing
- Manual testing via Swagger UI at `/api-docs`

## Database Migration Notes

This project is transitioning from CSV-based storage to PostgreSQL:

- **New features**: Use PostgreSQL via `src/services/movies.service.ts`
- **Legacy endpoints**: `/insert` and `/delete/:id` still use CSV
- **Seeding**: `scripts/seedMovies.ts` migrates CSV data to PostgreSQL
- **Schema**: `sql/schema_and_load.sql` contains full DDL and data migration queries

## Deployment Considerations

The app is configured for deployment on platforms like Render:

- Swagger YAML loaded from filesystem (works on Render)
- SSL auto-detection for database connections
- Trust proxy enabled for load balancers
- `postinstall` script runs build automatically
- Health check endpoints at `/health` and `/health/detailed`

## Common Development Tasks

### Adding a New Movie Endpoint

1. Add service function in `src/services/movies.service.ts` with SQL query
2. Create controller in `src/controllers/` or add to existing
3. Add route in `src/routes/open/movies.routes.ts`
4. Update `project_files/api.yaml` with OpenAPI spec
5. Test via `/api-docs` Swagger UI
6. Run `npm run type-check && npm run lint`

### Working with the Database

- Connection pool: `src/db/pool.ts` (exported as `pool`)
- Query pattern: `await pool.query(sql, params)`
- Parameterized queries: Use `$1, $2, ...` placeholders
- Type safety: Define return types for query results
- Transactions: Use `pool.connect()` for multi-statement transactions

### Debugging Type Errors

1. Run `npm run type-check` to see all errors
2. Check path aliases are correctly configured
3. Ensure imports use `@/` prefixes
4. Remember: optional properties may be undefined
5. Array access always returns `T | undefined` with strict mode

### Environment Setup for New Developers

1. Clone repository
2. `npm install`
3. Copy `.env.example` to `.env`
4. Set `NEON_DATABASE_URL` with PostgreSQL connection string
5. `npm run dev`
6. Visit `http://localhost:8000/api-docs`

## Important Notes

- **Never commit `.env`** - Contains database credentials
- **Database connection required** - App will fail startup without valid `NEON_DATABASE_URL`
- **Port conflicts**: Change `PORT` in `.env` if 8000 is in use
- **CSV operations are legacy** - Prefer PostgreSQL for new features
- **Middleware order matters** - Error handler must be last in `app.ts`
- **Path aliases require runtime registration** - Use `-r tsconfig-paths/register` with ts-node
