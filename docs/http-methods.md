# HTTP Methods - The Building Blocks of Web Communication

Master the fundamental HTTP methods that power every web application, from simple websites to complex APIs. Learn when and how to use each method through practical examples from our TCSS-460 HelloWorld API.

## 🎯 What You'll Learn

By studying this guide, you'll understand:

- **What HTTP methods are** and their role in web communication
- **When to use each method** for different types of operations
- **Safe vs unsafe methods** and their implications
- **Idempotent vs non-idempotent** operations
- **Real-world applications** through our API examples

## 🧭 Learning Path

**📚 Study Path:**
1. [HTTP Fundamentals](/docs/http-fundamentals.md) - Foundation concepts
2. [HTTP History & Evolution](/docs/http-history-evolution.md) - How HTTP developed
3. [Client-Server Architecture](/docs/client-server-architecture.md) - Web architecture
4. [Request-Response Model](/docs/request-response-model.md) - Communication patterns
5. **HTTP Methods** (this document) - Request types and semantics
6. [HTTP Status Codes](/docs/http-status-codes.md) - Response indicators

**🔧 Practice:**
- Test all examples at [Swagger UI](http://localhost:8000/api-docs)
- Try each method with our HelloWorld API endpoints
- Experiment with different data in request bodies

**✋ Hands-On:**
- Examine `/src/routes/open/helloRoutes.ts` for method implementations
- Review `/src/controllers/helloController.ts` for method handlers
- Test parameter handling in `/src/routes/open/parametersRoutes.ts`

---

## What Are HTTP Methods?

**HTTP methods** (also called HTTP verbs) define the **type of action** you want to perform on a resource. They tell the server what you intend to do with the data at a specific URL.

### Think of HTTP Methods Like Actions in Real Life

Consider a library book system:

| Action | HTTP Method | What It Does |
|--------|-------------|--------------|
| **Look at** a book | `GET` | Read without changing anything |
| **Add** a new book | `POST` | Create something new |
| **Replace** a book entirely | `PUT` | Complete replacement |
| **Update** just the book's label | `PATCH` | Partial modification |
| **Remove** a book | `DELETE` | Take it away |
| **Check if** a book exists | `HEAD` | Verify without retrieving |
| **Ask what** you can do with a book | `OPTIONS` | Get available actions |

### Why HTTP Methods Matter

**🎯 Learning Objective:** Understand the semantic meaning behind each HTTP method

HTTP methods provide **semantic meaning** to requests:

- **Consistent behavior** across different APIs and applications
- **Clear intentions** - developers know what each request does
- **Cacheable operations** - browsers and proxies know what's safe to cache
- **Idempotent operations** - some methods can be safely repeated
- **Security considerations** - some methods are safer than others

---

## The Essential HTTP Methods

### GET - Retrieve Data Safely

**Purpose:** Retrieve information without causing side effects

```http
GET /hello HTTP/1.1
Host: localhost:8000
Accept: application/json
```

**Characteristics:**
- **Safe** - No side effects on the server
- **Idempotent** - Multiple requests have the same effect
- **Cacheable** - Responses can be cached by browsers/proxies
- **Visible** - Parameters appear in URL and browser history

**🔧 Try It:** [GET /hello](http://localhost:8000/api-docs/#/Hello/get_hello)

**Real Example from Our API:**
```javascript
// In /src/controllers/helloController.ts
export const getHello = asyncHandler(async (request: Request, response: Response): Promise<void> => {
    const helloData: HelloResponse = {
        message: 'Hello, World!',
        method: 'GET',
        description: 'GET is used for retrieving data. It\'s safe and idempotent - multiple requests have the same effect.',
        timestamp: new Date().toISOString()
    };

    sendSuccess(response, helloData, 'Hello message retrieved successfully');
});
```

**When to Use GET:**
- Retrieving user profiles: `GET /users/123`
- Fetching product lists: `GET /products?category=electronics`
- Getting search results: `GET /search?q=javascript`
- Loading web pages and resources

**Best Practices:**
- Use query parameters for filters and pagination
- Keep URLs under 2048 characters
- Never include sensitive data in URLs
- Design for caching when appropriate

---

### POST - Create and Submit Data

**Purpose:** Create new resources or submit data with side effects

```http
POST /hello HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "message": "Custom hello message"
}
```

**Characteristics:**
- **Not safe** - Can have side effects
- **Not idempotent** - Multiple requests may create multiple resources
- **Not cacheable** - Responses shouldn't be cached
- **Secure** - Data in request body, not URL

**🔧 Try It:** [POST /hello](http://localhost:8000/api-docs/#/Hello/post_hello)

**Real Example from Our API:**
```javascript
// In /src/controllers/helloController.ts
export const postHello = asyncHandler(async (request: Request, response: Response): Promise<void> => {
    const helloData: HelloResponse = {
        message: 'Hello, World!',
        method: 'POST',
        description: 'POST is used for creating resources or submitting data. It has side effects and is not idempotent.',
        timestamp: new Date().toISOString()
    };

    sendSuccess(response, helloData, 'Hello message created successfully', 201);
});
```

**When to Use POST:**
- Creating new users: `POST /users`
- Submitting forms: `POST /contact`
- Uploading files: `POST /uploads`
- Complex searches: `POST /search` (when query is too complex for GET)

**Best Practices:**
- Return 201 (Created) for successful resource creation
- Include location of new resource in response headers
- Validate all input data thoroughly
- Use request body for sensitive or complex data

---

### PUT - Create or Replace Completely

**Purpose:** Create a new resource or completely replace an existing one

```http
PUT /hello HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "message": "Replaced hello message"
}
```

**Characteristics:**
- **Not safe** - Can have side effects
- **Idempotent** - Multiple identical requests have the same effect
- **Not cacheable** - Responses shouldn't be cached
- **Complete replacement** - Replaces entire resource

**🔧 Try It:** [PUT /hello](http://localhost:8000/api-docs/#/Hello/put_hello)

**Real Example from Our API:**
```javascript
// In /src/controllers/helloController.ts
export const putHello = asyncHandler(async (request: Request, response: Response): Promise<void> => {
    const helloData: HelloResponse = {
        message: 'Hello, World!',
        method: 'PUT',
        description: 'PUT is used for creating or completely replacing resources. It\'s idempotent and replaces entire resources.',
        timestamp: new Date().toISOString()
    };

    sendSuccess(response, helloData, 'Hello message replaced successfully');
});
```

**When to Use PUT:**
- Updating entire user profile: `PUT /users/123`
- Replacing configuration: `PUT /settings`
- Uploading files to specific location: `PUT /files/document.pdf`

**Best Practices:**
- Send complete resource representation
- Return 200 (OK) for updates, 201 (Created) for new resources
- Ensure idempotency in implementation
- Validate that client can provide complete resource

---

### PATCH - Partial Updates

**Purpose:** Apply partial modifications to a resource

```http
PATCH /hello HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "message": "Partially updated message"
}
```

**Characteristics:**
- **Not safe** - Can have side effects
- **May be idempotent** - Depends on implementation
- **Not cacheable** - Responses shouldn't be cached
- **Partial modification** - Updates only specified fields

**🔧 Try It:** [PATCH /hello](http://localhost:8000/api-docs/#/Hello/patch_hello)

**Real Example from Our API:**
```javascript
// In /src/controllers/helloController.ts
export const patchHello = asyncHandler(async (request: Request, response: Response): Promise<void> => {
    const helloData: HelloResponse = {
        message: 'Hello, World!',
        method: 'PATCH',
        description: 'PATCH is used for partial updates to resources. It modifies specific fields rather than replacing entire resources.',
        timestamp: new Date().toISOString()
    };

    sendSuccess(response, helloData, 'Hello message updated successfully');
});
```

**When to Use PATCH:**
- Updating specific user fields: `PATCH /users/123` with `{"email": "new@email.com"}`
- Changing password only: `PATCH /users/123/password`
- Updating status: `PATCH /orders/456` with `{"status": "shipped"}`

**Best Practices:**
- Send only fields that need updating
- Define clear patch format (JSON Patch, merge patch, etc.)
- Validate partial data appropriately
- Return updated resource or relevant fields

---

### DELETE - Remove Resources

**Purpose:** Delete a specified resource

```http
DELETE /hello HTTP/1.1
Host: localhost:8000
```

**Characteristics:**
- **Not safe** - Has side effects (removes data)
- **Idempotent** - Multiple deletes have same effect
- **Not cacheable** - Responses shouldn't be cached
- **Resource removal** - Eliminates the resource

**🔧 Try It:** [DELETE /hello](http://localhost:8000/api-docs/#/Hello/delete_hello)

**Real Example from Our API:**
```javascript
// In /src/controllers/helloController.ts
export const deleteHello = asyncHandler(async (request: Request, response: Response): Promise<void> => {
    const helloData: HelloResponse = {
        message: 'Goodbye, World!',
        method: 'DELETE',
        description: 'DELETE is used for removing resources. It\'s idempotent - multiple deletions have the same effect.',
        timestamp: new Date().toISOString()
    };

    sendSuccess(response, helloData, 'Hello message deleted successfully');
});
```

**When to Use DELETE:**
- Removing user accounts: `DELETE /users/123`
- Deleting posts: `DELETE /posts/456`
- Clearing shopping cart: `DELETE /cart/items`

**Best Practices:**
- Return 200 (OK) with content or 204 (No Content)
- Consider soft deletes for important data
- Implement proper authorization checks
- Handle cascading deletes appropriately

---

### HEAD - Headers Only

**Purpose:** Retrieve response headers without the body

```http
HEAD /hello HTTP/1.1
Host: localhost:8000
```

**Characteristics:**
- **Safe** - No side effects
- **Idempotent** - Multiple requests have same effect
- **Cacheable** - Response headers can be cached
- **No body** - Returns headers only

**When to Use HEAD:**
- Checking if resource exists without downloading it
- Getting file size before download: `HEAD /files/large-file.zip`
- Verifying last modification time: `HEAD /documents/report.pdf`
- Testing endpoint availability

**Example Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 156
Last-Modified: Mon, 15 Jan 2024 10:30:00 GMT
```

**Best Practices:**
- Ensure HEAD returns same headers as GET would
- Use for existence checks and metadata retrieval
- Implement for resources that support GET

---

### OPTIONS - Discover Capabilities

**Purpose:** Retrieve communication options for a resource

```http
OPTIONS /hello HTTP/1.1
Host: localhost:8000
```

**Characteristics:**
- **Safe** - No side effects
- **Idempotent** - Multiple requests have same effect
- **Informational** - Describes available operations
- **CORS support** - Used in preflight requests

**Example Response:**
```http
HTTP/1.1 200 OK
Allow: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

**When to Use OPTIONS:**
- CORS preflight requests (automatic)
- API discovery and documentation
- Checking allowed methods before making requests
- Security and capability testing

**Best Practices:**
- Return accurate Allow header with supported methods
- Include CORS headers for web applications
- Keep response lightweight and informative

---

## Key Concepts Explained

### Safe Methods

**Definition:** Methods that don't modify server state

**Safe Methods:** `GET`, `HEAD`, `OPTIONS`

**Why It Matters:**
- Browsers can prefetch safe requests
- Proxies and caches can store responses
- Web crawlers safely index content
- No unintended side effects from repeated calls

**🎯 Learning Objective:** Understand the difference between safe and unsafe operations

```javascript
// Safe - Can be called repeatedly without issues
GET /users/123         // Always returns same user data
HEAD /files/report.pdf // Always returns same headers
OPTIONS /api/endpoint  // Always returns same capabilities

// Unsafe - May cause changes each time
POST /users           // Creates new user each time
DELETE /files/temp    // Removes file (once)
PUT /settings         // Updates configuration
```

### Idempotent Methods

**Definition:** Methods where multiple identical requests have the same effect as a single request

**Idempotent Methods:** `GET`, `HEAD`, `PUT`, `DELETE`, `OPTIONS`
**Non-Idempotent Methods:** `POST`, sometimes `PATCH`

**Why It Matters:**
- Network libraries can safely retry idempotent requests
- Reduces issues from network timeouts or duplicates
- Enables reliable distributed systems
- Simplifies error handling and recovery

**🎯 Learning Objective:** Design APIs with proper idempotency

```javascript
// Idempotent - Same result every time
GET /users/123           // Always returns same user
PUT /users/123           // Always results in same user state
DELETE /users/123        // User deleted (or already deleted)

// Non-Idempotent - Different results
POST /users              // Creates new user each time
POST /orders             // Places new order each time
PATCH /counter/increment // Increases counter each time
```

### Method Semantics and Proper Usage

**🎯 Learning Objective:** Choose the right method for each operation

| Operation | Correct Method | Why |
|-----------|----------------|-----|
| **Read data** | `GET` | Safe, cacheable, no side effects |
| **Create resource** | `POST` | Allows server to assign ID, not idempotent |
| **Replace resource** | `PUT` | Idempotent, client provides complete data |
| **Update partially** | `PATCH` | Efficient for small changes |
| **Remove resource** | `DELETE` | Clear intent, idempotent |
| **Check existence** | `HEAD` | Efficient, no unnecessary data transfer |
| **Discover options** | `OPTIONS` | Standard way to check capabilities |

---

## Real Examples from Our HelloWorld API

### Testing HTTP Methods

Our API provides a complete testing ground for HTTP methods:

**🔧 Interactive Testing:**
1. Open [Swagger UI](http://localhost:8000/api-docs)
2. Navigate to "Hello World Demonstrations"
3. Try each method with the `/hello` endpoint

**Code Examples:**

```bash
# GET - Retrieve hello message
curl -X GET http://localhost:8000/hello

# POST - Create hello message
curl -X POST http://localhost:8000/hello \
  -H "Content-Type: application/json" \
  -d '{"message": "Custom message"}'

# PUT - Replace hello message
curl -X PUT http://localhost:8000/hello \
  -H "Content-Type: application/json" \
  -d '{"message": "Replaced message"}'

# PATCH - Update hello message
curl -X PATCH http://localhost:8000/hello \
  -H "Content-Type: application/json" \
  -d '{"message": "Updated message"}'

# DELETE - Remove hello message
curl -X DELETE http://localhost:8000/hello

# HEAD - Get headers only
curl -I http://localhost:8000/hello

# OPTIONS - Check available methods
curl -X OPTIONS http://localhost:8000/hello
```

### Parameter Handling Examples

Our API also demonstrates parameter handling with different methods:

**Query Parameters (GET):**
```bash
curl "http://localhost:8000/parameters/query?name=Student"
```

**Path Parameters (GET):**
```bash
curl "http://localhost:8000/parameters/path/John"
```

**Request Body (POST):**
```bash
curl -X POST http://localhost:8000/parameters/body \
  -H "Content-Type: application/json" \
  -d '{"name": "Student"}'
```

**Header Parameters (GET):**
```bash
curl -H "X-User-Name: Student" \
  http://localhost:8000/parameters/headers
```

---

## Best Practices for HTTP Methods

### 1. Choose the Right Method

**✅ Do:**
- Use GET for reading data
- Use POST for creating when server assigns ID
- Use PUT for complete resource replacement
- Use PATCH for partial updates
- Use DELETE for resource removal

**❌ Don't:**
- Use GET for operations that change data
- Use POST when PUT or PATCH is more appropriate
- Mix method semantics (e.g., DELETE that creates resources)

### 2. Design for Idempotency

**✅ Do:**
```javascript
// Idempotent PUT - same result every time
PUT /users/123
{
  "name": "John Doe",
  "email": "john@example.com",
  "status": "active"
}

// Idempotent DELETE - deleting deleted resource is OK
DELETE /users/123 // Returns 204 or 404, both acceptable
```

**❌ Don't:**
```javascript
// Non-idempotent operation disguised as PUT
PUT /users/123/increment-login-count  // Wrong!

// Better alternatives:
POST /users/123/login                 // Correct for non-idempotent
PATCH /users/123 {"login_count": 5}   // Correct for setting specific value
```

### 3. Handle Methods Consistently

**✅ Do:**
- Return appropriate status codes (200, 201, 204, etc.)
- Include relevant headers (Location, Content-Type, etc.)
- Provide consistent response formats
- Implement proper error handling

**Example from Our API:**
```javascript
// Consistent response structure across all methods
{
  "success": true,
  "data": {
    "message": "Hello, World!",
    "method": "GET",
    "description": "Method explanation...",
    "timestamp": "2024-01-15T10:30:00.000Z"
  },
  "message": "Operation completed successfully"
}
```

### 4. Security Considerations

**Safe Methods (GET, HEAD, OPTIONS):**
- Can be cached by proxies
- Appear in browser history and logs
- Should not contain sensitive data in URLs
- Can be prefetched by browsers

**Unsafe Methods (POST, PUT, PATCH, DELETE):**
- Should include CSRF protection
- Require proper authentication/authorization
- Sensitive data goes in request body
- Should use HTTPS in production

---

## Common Mistakes and How to Avoid Them

### 1. Using GET for State Changes

**❌ Wrong:**
```javascript
GET /users/123/delete  // Deleting with GET!
GET /cart/add?item=456 // Adding items with GET!
```

**✅ Correct:**
```javascript
DELETE /users/123      // Proper deletion
POST /cart/items       // Proper creation
```

**Why It's Wrong:** GET should be safe and idempotent. Using it for state changes violates HTTP semantics and can cause issues with caching, prefetching, and web crawlers.

### 2. Confusing PUT and PATCH

**❌ Wrong:**
```javascript
// Using PUT for partial updates
PUT /users/123
{
  "email": "new@email.com"  // Only updating email, but PUT should replace entire resource
}
```

**✅ Correct:**
```javascript
// PUT with complete resource
PUT /users/123
{
  "name": "John Doe",
  "email": "new@email.com",
  "status": "active"
}

// PATCH for partial update
PATCH /users/123
{
  "email": "new@email.com"
}
```

### 3. Not Implementing Idempotency Properly

**❌ Wrong:**
```javascript
// Non-idempotent PUT
PUT /users/123/increment-score  // Changes result each time!
```

**✅ Correct:**
```javascript
// Idempotent PUT
PUT /users/123
{
  "score": 150  // Sets specific value, same result each time
}

// Or use POST for non-idempotent operations
POST /users/123/actions
{
  "type": "increment_score",
  "amount": 10
}
```

### 4. Ignoring Status Codes

**❌ Wrong:**
```javascript
// Returning 200 for everything
POST /users → 200 OK  // Should be 201 Created
DELETE /users/123 → 200 OK  // Could be 204 No Content
```

**✅ Correct:**
```javascript
POST /users → 201 Created
DELETE /users/123 → 204 No Content
GET /users/404 → 404 Not Found
PUT /users/123 → 200 OK (update) or 201 Created (new)
```

---

## Next Steps in Your Learning Journey

Now that you understand HTTP methods, continue with:

1. **[HTTP Status Codes](/docs/http-status-codes.md)** - Understanding response codes
2. **[Request-Response Model](/docs/request-response-model.md)** - Deep dive into communication
3. **[Node.js & Express Architecture](/docs/node-express-architecture.md)** - Server implementation patterns

**🔧 Immediate Practice:**
- Test all methods in our [API documentation](http://localhost:8000/api-docs)
- Try the "Hello World Demonstrations" and "Parameter Demonstrations"
- Notice how each method behaves differently

**✋ Hands-On Exploration:**
- Examine `/src/routes/open/helloRoutes.ts` for method routing
- Review `/src/controllers/helloController.ts` for method implementations
- Study `/src/routes/open/parametersRoutes.ts` for parameter handling patterns

**🎯 Build Your Understanding:**
- Practice with curl commands or Postman
- Try breaking the rules (use GET for creation) to see what happens
- Implement your own endpoints following these patterns

---

## Summary

HTTP methods are the **building blocks of web communication** that define:

- **What action** you want to perform (GET, POST, PUT, etc.)
- **How the server should behave** (safe, idempotent, cacheable)
- **What results to expect** (success, creation, deletion)
- **How to handle errors** consistently across different operations

Understanding HTTP methods is essential because they:

- **Provide semantic meaning** to API operations
- **Enable consistent behavior** across different systems
- **Support caching and optimization** strategies
- **Ensure proper security** considerations
- **Make APIs predictable** and easier to use

**🎯 Key Takeaway:** Choose HTTP methods based on what you're actually doing, not just what works. The semantic meaning matters for building maintainable, scalable, and interoperable web applications.

---

*Continue your learning with [HTTP Status Codes](/docs/http-status-codes.md) to understand how servers communicate the results of your HTTP method requests.*