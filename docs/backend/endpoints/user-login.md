# API Endpoint Implementation Plan: User Login

## 1. Endpoint Overview

This endpoint authenticates users by validating their credentials (username and
password) against the database and creates an authenticated session by issuing a
JWT token stored in an HTTP-only cookie. It supports both admin and regular user
authentication.

## 2. Request Details

- **HTTP Method:** POST
- **URL Structure:** `/api/auth/login`
- **Parameters:**
  - **Required:**
    - `username` (string, max 50 characters) - User's unique username
    - `password` (string) - User's password in plain text
  - **Optional:** None
- **Request Body:**
  ```json
  {
  	"username": "string",
  	"password": "string"
  }
  ```

## 3. Used Types

### DTOs (Data Transfer Objects)

From `src/types/dto.ts`:

- **`LoginCommandDto`** - Request payload validation

  ```typescript
  {
  	username: string
  	password: string
  }
  ```

- **`LoginResponseDto`** - Response structure

  ```typescript
  {
  	user: UserDto
  }
  ```

- **`UserDto`** - User data in response
  ```typescript
  {
  	id: string(UUID)
  	username: string
  	role: 'admin' | 'user'
  }
  ```

### Command Models

Create a Zod schema for validation:

```typescript
const LoginCommandSchema = z.object({
	username: z
		.string()
		.min(1, 'Username is required')
		.max(50, 'Username must be at most 50 characters'),
	password: z.string().min(1, 'Password is required'),
})
```

## 4. Response Details

### Success Response (200 OK)

```json
{
	"user": {
		"id": "550e8400-e29b-41d4-a716-446655440000",
		"username": "johndoe",
		"role": "user"
	}
}
```

**Additional:** JWT token set in HTTP-only cookie named `auth-token` (or
similar)

### Error Responses

**422 Unprocessable Entity** - Missing or invalid fields

```json
{
	"error": "Validation failed",
	"details": {
		"username": "Username is required",
		"password": "Password is required"
	}
}
```

**401 Unauthorized** - Invalid credentials

```json
{
	"error": "Invalid username or password"
}
```

**500 Internal Server Error** - Server-side errors

```json
{
	"error": "An unexpected error occurred"
}
```

## 5. Data Flow

1. **Request Validation**
   - Parse request body
   - Validate against Zod schema
   - Return 422 if validation fails

2. **User Lookup**
   - Query `users` table for username
   - Use Prisma to include password relation

   ```typescript
   prisma.user.findUnique({
   	where: { username },
   	include: { password: true },
   })
   ```

3. **Credential Verification**
   - Check if user exists (return 401 if not)
   - Check if password record exists
   - Compare provided password with hashed password using constant-time
     comparison
   - Use bcrypt for password verification

4. **JWT Token Generation**
   - Create JWT payload with user id, username, and role
   - Sign token with secret key from environment variables
   - Set expiration (e.g., 7 days or 24 hours)

5. **Cookie Setting**
   - Set JWT token in HTTP-only cookie
   - Configure cookie options:
     - `httpOnly: true` (prevent XSS)
     - `secure: true` (HTTPS only in production)
     - `sameSite: 'lax'` (CSRF protection)
     - `maxAge` (match JWT expiration)
     - `path: '/'`

6. **Response**
   - Return user data (id, username, role)
   - Exclude password from response

## 6. Security Considerations

### Authentication & Authorization

- **Password Storage:** Passwords must be hashed using bcrypt (cost factor
  10-12)
- **Constant-Time Comparison:** Use timing-safe password comparison to prevent
  timing attacks
- **Generic Error Messages:** Return same error message for "user not found" and
  "invalid password" to prevent user enumeration

### Input Validation

- Validate username length (max 50 characters per db schema)
- Sanitize inputs to prevent injection attacks (Prisma provides protection)
- Validate against Zod schema before processing

### JWT Token Security

- Store JWT secret in environment variables (never commit to repository)
- Use strong, randomly generated secret (min 256 bits)
- Set appropriate expiration time (balance security and UX)
- Include user id and role in token payload
- Consider including token version/jti for revocation capability

### Cookie Security

- Use `httpOnly` flag to prevent JavaScript access (XSS protection)
- Use `secure` flag in production to enforce HTTPS
- Use `sameSite: 'lax'` or `'strict'` for CSRF protection
- Set appropriate domain and path

## 7. Error Handling

### Validation Errors (422)

- **Trigger:** Missing username or password, invalid format
- **Response:** Detailed validation errors from Zod
- **Logging:** Log validation failures (low severity)

### Authentication Errors (401)

- **Trigger:** User not found or password mismatch
- **Response:** Generic "Invalid username or password" message
- **Logging:** Log failed authentication attempts with username and IP (security
  event)
- **Note:** Use same error message for both scenarios to prevent user
  enumeration

### Database Errors (500)

- **Trigger:** Database connection failure, query errors
- **Response:** Generic error message (don't expose internals)
- **Logging:** Log full error with stack trace (high severity)

### Token Generation Errors (500)

- **Trigger:** JWT signing failure, missing secret
- **Response:** Generic error message
- **Logging:** Log error details (critical severity)

### Error Response Format

```typescript
{
  error: string,          // User-friendly message
  details?: object        // Additional details (validation errors only)
}
```

## 8. Performance Considerations

### Potential Bottlenecks

- **Password Hashing Verification:** Bcrypt are intentionally slow (~100-300ms)
- **Database Query:** User lookup with password relation join
- **JWT Signing:** Minimal overhead but should use efficient algorithm (HS256 or
  RS256)

## 9. Implementation Steps

1. **Create Authentication Service** (`src/services/auth.service.ts`)
   - Create `verifyCredentials` function
   - Accept username and password as parameters
   - Query database for user with password relation
   - Verify password using bcrypt/argon2
   - Return user object (without password) or null

2. **Create JWT Utilities** (`src/lib/jwt.server.ts`)
   - Create `generateToken` function accepting user data
   - Create `verifyToken` function for token validation
   - Define token payload interface
   - Use `jsonwebtoken` or `jose` library
   - Load JWT secret from environment variables

3. **Create Cookie Utilities** (`src/lib/cookie.server.ts`)
   - Create `setAuthCookie` function
   - Define cookie configuration (httpOnly, secure, sameSite, etc.)
   - Create `clearAuthCookie` function for logout
   - Environment-aware secure flag (prod vs dev)

4. **Create Validation Schema** (`src/lib/validations/auth.ts`)
   - Define Zod schema for login command
   - Export `LoginCommandSchema`
   - Add custom error messages

5. **Implement Route Handler** (`src/app/api/auth/login/route.ts`)
   - Create POST handler function
   - Parse and validate request body using Zod
   - Call authentication service
   - Generate JWT token on success
   - Set authentication cookie
   - Return user data response
   - Handle all error cases with appropriate status codes

6. **Update Environment Variables** (`.env`)
   - Add `JWT_SECRET` variable
   - Add `JWT_EXPIRES_IN` variable (e.g., "7d")
   - Document required environment variables in `.env.example`

7. **Install Required Dependencies**
   - Install `bcryptjs` and `@types/bcryptjs` (if not already installed)
   - Install `jsonwebtoken` and `@types/jsonwebtoken` OR `jose`
   - Verify Zod is available (already in dependencies)

8. **Update `auth.server.ts`** (Optional)
   - Implement `getCurrentUser` function to verify JWT from cookie
   - Extract and verify token from request cookies
   - Return user data from valid token
