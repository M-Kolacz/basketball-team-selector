# API Endpoint Implementation Plan: GET /api/users

## 1. Endpoint Overview

This endpoint retrieves a paginated list of all users in the system. It is
restricted to admin users only and supports sorting by username or creation
date. The endpoint returns user information excluding password data, along with
pagination metadata to enable client-side pagination controls.

**Key Features:**

- Admin-only access
- Pagination support with configurable page size
- Sorting by username or creation date
- Excludes sensitive password information from response

## 2. Request Details

- **HTTP Method:** GET
- **URL Structure:** `/api/users`
- **Parameters:**
  - **Optional Query Parameters:**
    - `page` (number): Page number to retrieve (default: 1, minimum: 1)
    - `limit` (number): Number of items per page (default: 20, minimum: 1,
      maximum: 100)
    - `sort` (string): Field to sort by - either `username` or `created_at`
      (default: `username`)
  - **Required:** None (all parameters have default values)
- **Request Body:** None (GET request)
- **Headers:**
  - Authentication cookie (session-based)

**Example Request:**

```
GET /api/users?page=2&limit=10&sort=created_at
```

## 3. Used Types

Based on [dto.ts](src/types/dto.ts), the following types are used:

### Response DTOs

```typescript
// From dto.ts:33-36
export type UsersListResponseDto = {
	users: UserWithTimestampsDto[]
	pagination: PaginationDto
}

// From dto.ts:31
export type UserWithTimestampsDto = Omit<User, 'password'>

// From dto.ts:13-18
export type PaginationDto = {
	page: number
	limit: number
	total: number
	totalPages: number
}
```

### Query Parameter Validation Schema

```typescript
// To be created in route handler or validation utility
type UsersListQueryParams = {
	page?: number
	limit?: number
	sort?: 'username' | 'created_at'
}
```

## 4. Response Details

### Success Response (200 OK)

```json
{
	"users": [
		{
			"id": "550e8400-e29b-41d4-a716-446655440000",
			"username": "johndoe",
			"role": "admin",
			"createdAt": "2025-01-15T10:30:00Z",
			"updatedAt": "2025-01-15T10:30:00Z"
		},
		{
			"id": "660e8400-e29b-41d4-a716-446655440001",
			"username": "janedoe",
			"role": "user",
			"createdAt": "2025-01-14T08:20:00Z",
			"updatedAt": "2025-01-14T08:20:00Z"
		}
	],
	"pagination": {
		"page": 1,
		"limit": 20,
		"total": 50,
		"totalPages": 3
	}
}
```

### Error Responses

**401 Unauthorized** - User not authenticated

```json
{
	"error": "Authentication required",
	"message": "You must be logged in to access this resource"
}
```

**403 Forbidden** - User lacks admin privileges

```json
{
	"error": "Insufficient permissions",
	"message": "Admin access required to list users"
}
```

**400 Bad Request** - Invalid query parameters

```json
{
	"error": "Invalid request parameters",
	"message": "Validation failed: page must be greater than 0"
}
```

**500 Internal Server Error** - Server-side error

```json
{
	"error": "Internal server error",
	"message": "An unexpected error occurred while processing your request"
}
```

## 5. Data Flow

```
1. Client Request
   ↓
2. Next.js API Route Handler (/api/users/route.ts)
   ↓
3. Authentication Check (Middleware or in-handler)
   - Verify user session/token exists
   - Return 401 if not authenticated
   ↓
4. Authorization Check
   - Verify user.role === 'admin'
   - Return 403 if not admin
   ↓
5. Input Validation
   - Parse and validate query parameters
   - Apply defaults (page=1, limit=20, sort=username)
   - Return 400 if validation fails
   ↓
6. User Service Call (user.service.ts)
   - listUsers(page, limit, sort)
   ↓
7. Database Queries (via Prisma)
   a. Count total users: prisma.user.count()
   b. Fetch paginated users: prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort]: 'asc' },
        select: { id, username, role, createdAt, updatedAt }
      })
   ↓
8. Transform to DTOs
   - Map database results to UserWithTimestampsDto[]
   - Calculate totalPages = Math.ceil(total / limit)
   - Build PaginationDto object
   ↓
9. Return Response
   - Status: 200 OK
   - Body: UsersListResponseDto
```

## 6. Security Considerations

### Authentication

- **Requirement:** User must be authenticated before accessing this endpoint
- **Implementation:** Check for valid session cookie
- **Location:** Middleware or early in route handler
- **Response:** Return 401 if authentication fails

### Authorization

- **Requirement:** Only users with `role: 'admin'` can access this endpoint
- **Implementation:** After authentication, verify
  `user.role === UserRole.admin`
- **Location:** Route handler before service call
- **Response:** Return 403 if user is not admin

### Data Protection

- **Password Exclusion:** Never return password hash in response
- **Implementation:** Use Prisma `select` to explicitly exclude password
  relation
- **Verification:** TypeScript types enforce UserWithTimestampsDto which omits
  password

### Input Validation

- **Query Parameters:**
  - `page`: Must be positive integer >= 1
  - `limit`: Must be positive integer, enforce max value (100) to prevent DoS
  - `sort`: Must be one of allowed values ('username' | 'created_at')
- **Implementation:** Use Zod schema or manual validation
- **SQL Injection:** Prisma ORM provides automatic protection

### Rate Limiting (Optional but Recommended)

- Implement rate limiting to prevent abuse
- Consider per-user or per-IP limits
- Stricter limits for non-admin endpoints if exposed

## 7. Error Handling

### Client Errors (4xx)

| Scenario                     | Status Code | Error Response                          | Resolution                     |
| ---------------------------- | ----------- | --------------------------------------- | ------------------------------ |
| No authentication            | 401         | `{ error: "Authentication required" }`  | User must log in               |
| Not admin role               | 403         | `{ error: "Insufficient permissions" }` | Only admins can access         |
| Invalid page (< 1)           | 400         | `{ error: "Invalid page number" }`      | Provide valid page >= 1        |
| Invalid limit (< 1 or > 100) | 400         | `{ error: "Invalid limit value" }`      | Provide limit between 1-100    |
| Invalid sort value           | 400         | `{ error: "Invalid sort field" }`       | Use 'username' or 'created_at' |

### Server Errors (5xx)

| Scenario                  | Status Code | Logging                         | User Response                        |
| ------------------------- | ----------- | ------------------------------- | ------------------------------------ |
| Database connection error | 500         | Log full error with stack trace | `{ error: "Internal server error" }` |
| Prisma query error        | 500         | Log error details and query     | `{ error: "Internal server error" }` |
| Unexpected exception      | 500         | Log full error with context     | `{ error: "Internal server error" }` |

### Error Handling Implementation

```typescript
try {
	// Route handler logic
} catch (error) {
	console.error('Error listing users:', error)

	if (error instanceof PrismaClientKnownRequestError) {
		// Handle specific Prisma errors
		return NextResponse.json(
			{ error: 'Database error', message: 'Unable to retrieve users' },
			{ status: 500 },
		)
	}

	return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}
```

## 8. Performance Considerations

### Database Performance

- **Indexes:** Ensure indexes exist on `username` and `createdAt` fields for
  efficient sorting (Prisma auto-creates index on unique `username`)
- **Query Optimization:** Use `select` instead of fetching entire user object to
  reduce data transfer
- **Separate Queries:** Run count and findMany as separate queries (required by
  Prisma)

### Pagination Strategy

- **Skip/Take Method:** Use Prisma's skip/take for pagination
- **Max Limit:** Enforce maximum limit (100) to prevent excessive data retrieval
- **Empty Pages:** Handle requests for pages beyond available data gracefully

## 9. Implementation Steps

### Step 1: Create User Service

**File:** `src/services/user.service.ts`

```typescript
import { prisma } from '#app/lib/db.server'
import type {
	UsersListResponseDto,
	UserWithTimestampsDto,
} from '#app/types/dto'

export type ListUsersOptions = {
	page: number
	limit: number
	sort: 'username' | 'created_at'
}

export async function listUsers(
	options: ListUsersOptions,
): Promise<UsersListResponseDto> {
	const { page, limit, sort } = options
	const skip = (page - 1) * limit

	// Map sort field to Prisma model field
	const orderByField = sort === 'created_at' ? 'createdAt' : 'username'

	// Execute queries in parallel
	const [users, total] = await Promise.all([
		prisma.user.findMany({
			skip,
			take: limit,
			orderBy: { [orderByField]: 'asc' },
			select: {
				id: true,
				username: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
		}),
		prisma.user.count(),
	])

	const totalPages = Math.ceil(total / limit)

	return {
		users: users as UserWithTimestampsDto[],
		pagination: {
			page,
			limit,
			total,
			totalPages,
		},
	}
}
```

### Step 2: Create Query Parameter Validation

**File:** `src/lib/validators/user.validators.ts`

```typescript
import { z } from 'zod'

export const usersListQuerySchema = z.object({
	page: z
		.string()
		.optional()
		.default('1')
		.transform(Number)
		.pipe(z.number().int().min(1)),
	limit: z
		.string()
		.optional()
		.default('20')
		.transform(Number)
		.pipe(z.number().int().min(1).max(100)),
	sort: z.enum(['username', 'created_at']).optional().default('username'),
})

export type UsersListQuery = z.infer<typeof usersListQuerySchema>
```

### Step 3: Create Authentication/Authorization Utilities

**File:** `src/lib/auth.server.ts` (if not exists)

```typescript
import { NextRequest } from 'next/server'
import type { User } from '#app/lib/db.server'

export async function getCurrentUser(
	request: NextRequest,
): Promise<User | null> {
	// Implement based on your auth strategy
	// This is a placeholder - actual implementation depends on auth setup
	// Could use session cookies, JWT tokens, etc.
	throw new Error('getCurrentUser not implemented')
}

export function requireAuth(user: User | null): asserts user is User {
	if (!user) {
		throw new AuthenticationError('Authentication required')
	}
}

export function requireAdmin(user: User): void {
	if (user.role !== 'admin') {
		throw new AuthorizationError('Admin access required')
	}
}

export class AuthenticationError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'AuthenticationError'
	}
}

export class AuthorizationError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'AuthorizationError'
	}
}
```

### Step 4: Create API Route Handler

**File:** `src/app/api/users/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import {
	getCurrentUser,
	requireAuth,
	requireAdmin,
	AuthenticationError,
	AuthorizationError,
} from '#app/lib/auth.server'
import { usersListQuerySchema } from '#app/lib/validators/user.validators'
import { listUsers } from '#app/services/user.service'

export async function GET(request: NextRequest) {
	try {
		// 1. Authenticate user
		const user = await getCurrentUser(request)
		requireAuth(user)

		// 2. Authorize admin access
		requireAdmin(user)

		// 3. Parse and validate query parameters
		const { searchParams } = new URL(request.url)
		const queryParams = {
			page: searchParams.get('page') ?? undefined,
			limit: searchParams.get('limit') ?? undefined,
			sort: searchParams.get('sort') ?? undefined,
		}

		const validatedQuery = usersListQuerySchema.parse(queryParams)

		// 4. Call service to retrieve users
		const result = await listUsers({
			page: validatedQuery.page,
			limit: validatedQuery.limit,
			sort: validatedQuery.sort,
		})

		// 5. Return successful response
		return NextResponse.json(result, { status: 200 })
	} catch (error) {
		// Handle authentication errors
		if (error instanceof AuthenticationError) {
			return NextResponse.json(
				{
					error: 'Authentication required',
					message: error.message,
				},
				{ status: 401 },
			)
		}

		// Handle authorization errors
		if (error instanceof AuthorizationError) {
			return NextResponse.json(
				{
					error: 'Insufficient permissions',
					message: error.message,
				},
				{ status: 403 },
			)
		}

		// Handle validation errors
		if (error instanceof ZodError) {
			return NextResponse.json(
				{
					error: 'Invalid request parameters',
					message: error.errors[0]?.message ?? 'Validation failed',
				},
				{ status: 400 },
			)
		}

		// Handle unexpected errors
		console.error('Error listing users:', error)
		return NextResponse.json(
			{
				error: 'Internal server error',
				message: 'An unexpected error occurred',
			},
			{ status: 500 },
		)
	}
}
```

## Summary

This implementation plan provides a complete roadmap for implementing the GET
/api/users endpoint following Next.js 15 best practices, proper TypeScript
typing, comprehensive error handling, and security considerations. The endpoint
will be properly tested, performant, and maintainable.
