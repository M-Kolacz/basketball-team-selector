# API Endpoint Implementation Plan: User Registration

## 1. Endpoint Overview

This endpoint enables new users to create an account by providing a username and
password. The endpoint validates the input, ensures username uniqueness,
securely hashes the password using bcrypt, creates the user account. At the end
of the process user should be redirected to the login page. All new users are
assigned the default 'user' role.

## 2. Request Details

- **HTTP Method:** POST
- **URL Structure:** `/api/auth/register`
- **Parameters:**
  - **Required:**
    - `username` (string, max 50 characters) - User's desired unique username
    - `password` (string, min 8 characters) - User's password in plain text
    - `confirmPassword` (string, must match password) - Password confirmation
- **Request Body:**
  ```json
  {
  	"username": "string",
  	"password": "string",
  	"confirmPassword": "string"
  }
  ```

## 3. Used Types

### DTOs (Data Transfer Objects)

Add to `src/types/dto.ts`:

- **`RegisterCommandDto`** - Request payload structure

  ```typescript
  export type RegisterCommandDto = {
  	username: string
  	password: string
  	confirmPassword: string
  }
  ```

- **`RegisterResponseDto`** - Response structure

  ```typescript
  export type RegisterResponseDto = {
  	user: UserDto
  }
  ```

### Command Models

Create Zod schema in `src/lib/validations/auth.ts`:

```typescript
export const RegisterCommandSchema = z
	.object({
		username: z
			.string()
			.min(1, 'Username is required')
			.max(50, 'Username must be at most 50 characters')
			.trim(),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(100, 'Password must be at most 100 characters'),
		confirmPassword: z.string().min(1, 'Password confirmation is required'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

export type RegisterCommand = z.infer<typeof RegisterCommandSchema>
```

## 4. Response Details

### Success Response (201 Created)

```json
{
	"user": {
		"id": "550e8400-e29b-41d4-a716-446655440000",
		"username": "johndoe",
		"role": "user"
	}
}
```

**Additional:** JWT token set in HTTP-only cookie named `auth-token`

### Error Responses

**422 Unprocessable Entity** - Validation errors

```json
{
	"error": "Validation error",
	"message": "Invalid request body",
	"details": [
		{
			"path": ["password"],
			"message": "Password must be at least 8 characters"
		}
	]
}
```

**409 Conflict** - Username already exists

```json
{
	"error": "Username already exists",
	"message": "The username 'johndoe' is already taken. Please choose a different username."
}
```

**500 Internal Server Error** - Server-side errors

```json
{
	"error": "Internal server error",
	"message": "An unexpected error occurred while processing your request"
}
```

## 5. Data Flow

1. **Request Validation**
   - Parse request body as JSON
   - Validate against Zod schema (`RegisterCommandSchema`)
   - Check password matches confirmPassword
   - Return 422 if validation fails

2. **Username Uniqueness Check**
   - Query `users` table to check if username exists
   - Can be done implicitly via unique constraint or explicit check
   - Return 409 if username already taken

3. **Password Hashing**
   - Hash password using bcrypt with cost factor 10
   - Use existing `hashPassword` function from `auth.server.ts`
   - Never store or log plain-text password

4. **User Creation Transaction**
   - Create user and password records atomically
   - Use Prisma transaction to ensure data consistency
   - User record: username, role='user', timestamps
   - Password record: hash, user_id (foreign key)

   ```typescript
   await prisma.$transaction(async (tx) => {
   	const user = await tx.user.create({
   		data: {
   			username: validatedData.username,
   			role: 'user',
   		},
   	})

   	await tx.password.create({
   		data: {
   			hash: hashedPassword,
   			userId: user.id,
   		},
   	})

   	return user
   })
   ```

5. **JWT Token Generation**
   - Create JWT payload with user id
   - Sign token with secret key from environment variables
   - Set expiration (7 days or configured value)
   - Use existing `generateToken` function from `jwt.server.ts`

6. **Cookie Setting**
   - Set JWT token in HTTP-only cookie
   - Use existing `setAuthCookie` function from `cookie.server.ts`
   - Cookie options: httpOnly, secure (production), sameSite: 'lax', maxAge

7. **Response**
   - Redirect user to login page
   - Status 201 Created

## 6. Security Considerations

### Authentication & Authorization

- **Password Storage:** Hash passwords using bcrypt with cost factor 10
- **Default Role:** All registered users get 'user' role (admin users must be
  created through different means)
- **Password Requirements:** Minimum 8 characters (consider adding complexity
  requirements in future)

### Input Validation

- **Username Validation:**
  - Required, 1-50 characters (matches db VARCHAR(50))
  - Trim whitespace
  - Consider disallowing special characters if needed
- **Password Validation:**
  - Required, minimum 8 characters
  - Maximum 100 characters (prevent DoS via large inputs)
  - Confirmed via matching confirmPassword
- **SQL Injection:** Protected by Prisma parameterized queries
- **XSS Protection:** Input validation and proper output encoding

### Database Security

- **Unique Constraint:** Username uniqueness enforced at database level
- **Cascade Behavior:** Password record deleted if user deleted (ON DELETE
  CASCADE)
- **Transaction Safety:** User and password created atomically

### JWT Token Security

- Store JWT secret in environment variables
- Use strong, randomly generated secret (min 256 bits)
- Set appropriate expiration time (7 days default)
- Include minimal payload (only user id)

### Cookie Security

- Use `httpOnly` flag to prevent JavaScript access (XSS protection)
- Use `secure` flag in production to enforce HTTPS
- Use `sameSite: 'lax'` for CSRF protection
- Set appropriate maxAge matching JWT expiration

### User Enumeration

- 409 response reveals username existence (acceptable trade-off for UX)

## 7. Error Handling

### Validation Errors (422)

- **Triggers:**
  - Missing or empty username
  - Username exceeds 50 characters
  - Missing or empty password
  - Password less than 8 characters
  - Password exceeds 100 characters
  - Missing confirmPassword
  - Password and confirmPassword don't match
  - Invalid JSON format
- **Response:** Detailed validation errors from Zod with field paths
- **Logging:** Log validation failures (low severity)

### Conflict Errors (409)

- **Trigger:** Username already exists (Prisma unique constraint violation)
- **Response:** Clear message indicating username is taken
- **Logging:** Log username conflict attempts (info level)
- **Implementation:** Catch Prisma `P2002` error code (unique constraint
  violation)

### Database Errors (500)

- **Triggers:**
  - Database connection failure
  - Transaction failure
  - Query errors
- **Response:** Generic error message (don't expose internals)
- **Logging:** Log full error with stack trace (high severity)

### Password Hashing Errors (500)

- **Trigger:** Bcrypt hashing failure (rare)
- **Response:** Generic error message
- **Logging:** Log error details (critical severity)

### Token Generation Errors (500)

- **Trigger:** JWT signing failure, missing secret
- **Response:** Generic error message
- **Logging:** Log error details (critical severity)

### Cookie Setting Errors (500)

- **Trigger:** Failed to set authentication cookie
- **Response:** Generic error message
- **Logging:** Log error details (high severity)

### Error Response Format

```typescript
{
  error: string           // Error category
  message: string         // User-friendly message
  details?: object        // Validation errors only (422)
}
```

## 9. Implementation Steps

1. **Update DTO Types** (`src/types/dto.ts`)
   - Add `RegisterCommandDto` type
   - Add `RegisterResponseDto` type
   - Types for request payload and response structure

2. **Create Validation Schema** (`src/lib/validations/auth.ts`)
   - Add `RegisterCommandSchema` using Zod
   - Include username, password, confirmPassword fields
   - Add `.refine()` to validate password match
   - Add custom error messages
   - Export `RegisterCommand` type

3. **Create Registration Service** (`src/services/auth.server.ts`)
   - Add `registerUser` function
   - Accept username and plain-text password
   - Hash password using existing `hashPassword` function
   - Check for existing username (optional - can rely on unique constraint)
   - Create user and password records in transaction
   - Return created user object (without password)
   - Handle Prisma unique constraint errors

   ```typescript
   export async function registerUser(
   	username: string,
   	password: string,
   ): Promise<AuthenticatedUser> {
   	const hashedPassword = await hashPassword(password)

   	try {
   		const user = await prisma.$transaction(async (tx) => {
   			const newUser = await tx.user.create({
   				data: {
   					username,
   					role: 'user',
   				},
   			})

   			await tx.password.create({
   				data: {
   					hash: hashedPassword,
   					userId: newUser.id,
   				},
   			})

   			return newUser
   		})

   		return {
   			id: user.id,
   			username: user.username,
   			role: user.role,
   			createdAt: user.createdAt,
   			updatedAt: user.updatedAt,
   		}
   	} catch (error) {
   		if (error.code === 'P2002') {
   			throw new Error('Username already exists')
   		}
   		throw error
   	}
   }
   ```

4. **Implement Route Handler** (`src/app/api/auth/register/route.ts`)
   - Create POST handler function
   - Parse and validate request body using Zod
   - Call `registerUser` service function
   - Generate JWT token using existing `generateToken`
   - Set authentication cookie using existing `setAuthCookie`
   - Return user data with 201 status
   - Handle error cases:
     - ZodError → 422
     - "Username already exists" → 409
     - Other errors → 500

   ```typescript
   export async function POST(request: NextRequest) {
   	try {
   		const body = await request.json()
   		const validatedData = RegisterCommandSchema.parse(body)

   		const user = await registerUser(
   			validatedData.username,
   			validatedData.password,
   		)

   		const token = generateToken({
   			userId: user.id,
   		})

   		const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
   		await setAuthCookie(token, expiresIn)

   		return NextResponse.json(
   			{
   				user: {
   					id: user.id,
   					username: user.username,
   					role: user.role,
   				},
   			},
   			{ status: 201 },
   		)
   	} catch (error) {
   		// Handle ZodError, unique constraint, etc.
   	}
   }
   ```

5. **Error Handling Implementation**
   - Handle `ZodError` → return 422 with validation details
   - Handle "Username already exists" → return 409
   - Handle all other errors → return 500 with generic message
   - Log errors appropriately (console.error for now)

6. **Reuse Existing Utilities**
   - Use `hashPassword` from `auth.server.ts`
   - Use `generateToken` from `jwt.server.ts`
   - Use `setAuthCookie` from `cookie.server.ts`
   - Use Prisma client from `db.server.ts`
