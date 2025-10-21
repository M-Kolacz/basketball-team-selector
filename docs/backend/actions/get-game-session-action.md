# Server Action Implementation Plan: getGameSessionAction

## 1. Server Action Overview

The `getGameSessionAction` is a read-only server action that retrieves a single
game session by its unique identifier. It returns the complete game session data
including the selected proposition with all associated teams and their players.
This action is used to display detailed information about a specific game
session, including team compositions and game results.

## 2. Input Details

- **Function Name**: `getGameSessionAction`
- **File Location**: `src/lib/actions/game-sessions.server.ts`
- **Parameters**:
  - **Required**:
    - `gameSessionId`: string (UUID format)
  - **Optional**: None
- **Input Validation**:
  ```typescript
  const GetGameSessionSchema = z.object({
  	gameSessionId: z.string().uuid('Invalid game session ID'),
  })
  ```

## 3. Used Types

### Zod Schema

```typescript
const GetGameSessionSchema = z.object({
	gameSessionId: z.string().uuid('Invalid game session ID'),
})
```

### Prisma Query Result Type

```typescript
type GameSessionWithDetails = Prisma.GameSessionGetPayload<{
	include: {
		selectedProposition: {
			include: {
				teams: {
					include: {
						players: true
					}
				}
			}
		}
	}
}>
```

### Return Type

```typescript
GameSessionWithDetails | null
```

## 4. Output Details

### Success Cases

**Game Session Found:**

```typescript
{
  id: string,
  gameDatetime: Date,
  description: string | null,
  games: JsonValue, // JSONB array of game results
  selectedPropositionId: string | null,
  createdAt: Date,
  updatedAt: Date,
  selectedProposition: {
    id: string,
    gameSessionId: string,
    type: 'position_focused' | 'skill_balanced' | 'general',
    createdAt: Date,
    teams: Array<{
      id: string,
      createdAt: Date,
      updatedAt: Date,
      players: Array<{
        id: string,
        name: string,
        skillTier: 'S' | 'A' | 'B' | 'C' | 'D',
        positions: Array<'PG' | 'SG' | 'SF' | 'PF' | 'C'>,
        createdAt: Date,
        updatedAt: Date
      }>
    }>
  } | null
}
```

**Game Session Not Found:**

```typescript
null
```

### Error Cases

**Validation Error (Invalid UUID):**

```typescript
// Throws ZodError
throw new Error('Invalid game session ID')
```

**Unauthorized Access:**

```typescript
throw new Error('Unauthorized: Admin access required')
```

**Database/Server Error:**

```typescript
throw new Error('Failed to retrieve game session')
```

## 5. Data Flow

1. **Input Reception**: Receive `gameSessionId` parameter
2. **Authentication Check**: Verify user session exists and has admin role using
   `requireAdminUser()` helper from [auth.server.ts](src/lib/auth.server.ts)
3. **Input Validation**: Parse and validate `gameSessionId` using
   `GetGameSessionSchema`
4. **Database Query**: Execute Prisma `findUnique` query with nested includes:
   - Include `selectedProposition`
   - Within proposition, include `teams`
   - Within teams, include `players`
5. **Return Result**: Return the complete game session object or null if not
   found

## 6. Security Considerations

### Authentication

- Use `requireAdminUser()` from [auth.server.ts](src/lib/auth.server.ts) to
  verify JWT session
- Throw error if user is not authenticated or not an admin
- Perform auth check before any database operations

### Authorization

- Only admin users should access game session details
- Based on project context (single admin managing games), this is admin-only
  functionality

### Input Validation

- Validate UUID format using Zod schema to prevent:
  - SQL injection attempts
  - Invalid database queries
  - Malformed input causing server errors
- Use `parse()` method which throws on validation failure

### Data Exposure

- No sensitive data in game sessions (only game-related information)
- Do not expose internal error details to client
- Generic error messages for security-related failures

## 7. Error Handling

### Error Categories

**Validation Errors:**

- Invalid UUID format
- **Response**: Throw error with message "Invalid game session ID"
- **HTTP Status**: 400 (handled by Next.js)

**Authentication/Authorization Errors:**

- No valid session
- User is not admin
- **Response**: Throw error with message "Unauthorized: Admin access required"
- **HTTP Status**: 401/403 (handled by Next.js)

**Not Found:**

- Game session doesn't exist
- **Response**: Return `null` (not an error per specification)

**Database/Server Errors:**

- Database connection failure
- Prisma query errors
- **Response**: Log error details, throw generic error "Failed to retrieve game
  session"
- **HTTP Status**: 500 (handled by Next.js)

### Error Handling Pattern

```typescript
try {
	// Auth check
	// Validation
	// Database query
	return result
} catch (error) {
	if (error instanceof ZodError) {
		throw new Error('Invalid game session ID')
	}
	console.error('Error in getGameSessionAction:', error)
	throw new Error('Failed to retrieve game session')
}
```

## 8. Implementation Steps

1. **Create file structure**
   - Create `src/lib/actions/game-sessions.server.ts` if it doesn't exist
   - Add `'use server'` directive at the top of the file

2. **Import dependencies**

   ```typescript
   import { z } from 'zod'
   import { Prisma } from '#app/generated/prisma'
   import { prisma } from '#app/lib/db.server'
   import { requireAdminUser } from '#app/lib/auth.server'
   ```

3. **Define validation schema**

   ```typescript
   const GetGameSessionSchema = z.object({
   	gameSessionId: z.string().uuid('Invalid game session ID'),
   })
   ```

4. **Define return type**

   ```typescript
   type GameSessionWithDetails = Prisma.GameSessionGetPayload<{
   	include: {
   		selectedProposition: {
   			include: {
   				teams: {
   					include: {
   						players: true
   					}
   				}
   			}
   		}
   	}
   }>
   ```

5. **Implement server action function**
   - Mark function as async
   - Add JSDoc documentation
   - Accept `gameSessionId` parameter

6. **Add authentication check**
   - Call `await requireAdminUser()` at the beginning
   - This will throw if user is not authenticated or not admin

7. **Validate input**
   - Parse `gameSessionId` using `GetGameSessionSchema.parse({ gameSessionId })`
   - Extract validated `gameSessionId` from parsed result

8. **Execute database query**
   - Use `prisma.gameSession.findUnique()` with the exact include structure from
     specification
   - Include nested relations: `selectedProposition` → `teams` → `players`

9. **Return result**
   - Return the query result (will be `GameSessionWithDetails | null`)

10. **Wrap in try-catch block**
    - Catch and handle ZodError separately
    - Log unexpected errors to console
    - Throw generic error for database/server failures

11. **Add type exports**
    - Export `GameSessionWithDetails` type for use in components
    - Export the action function

12. **Test the implementation**
    - Test with valid UUID (existing game session)
    - Test with valid UUID (non-existent game session)
    - Test with invalid UUID format
    - Test without authentication
    - Test with non-admin user
