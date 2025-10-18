# Server Action Implementation Plan: getPlayersAction

## 1. Server Action Overview

The `getPlayersAction` is a query function that retrieves a paginated list of players with role-based filtering and data exposure. Admin users can filter by skill tier and position and receive full player details, while regular users receive only basic player information without filtering capabilities.

**Key Characteristics:**
- Query function (not a form action)
- Role-based data filtering
- Role-based response format
- Pagination support
- Optional filtering for admin users

## 2. Input Details

**Function Signature:**
```typescript
export async function getPlayersAction(
  params?: GetPlayersParams
): Promise<PlayersListAdminResponseDto | PlayersListUserResponseDto>
```

**Input Source:** Function parameters (not FormData)

**Parameters:**

- **Optional:**
  - `page`: number (default: 1) - Page number for pagination
  - `limit`: number (default: 50) - Number of items per page
  - `sort`: 'name' | 'skill_tier' | 'created_at' (default: 'name') - Sort field
  - `skillTier`: 'S' | 'A' | 'B' | 'C' | 'D' (admin only) - Filter by skill tier
  - `position`: 'PG' | 'SG' | 'SF' | 'PF' | 'C' (admin only) - Filter by position

**Validation Schema:**

Location: `src/lib/validations/player.ts`

```typescript
import { z } from 'zod'
import { SkillTier, Position } from '#app/lib/db.server'

export const playersListQuerySchema = z.object({
  page: z
    .number()
    .int()
    .min(1, 'Page must be greater than 0')
    .optional()
    .default(1),
  limit: z
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(50),
  sort: z
    .enum(['name', 'skill_tier', 'created_at'], {
      message: "Sort field must be 'name', 'skill_tier', or 'created_at'",
    })
    .optional()
    .default('name'),
  skillTier: z.nativeEnum(SkillTier).optional(),
  position: z.nativeEnum(Position).optional(),
})

export type PlayersListQuery = z.infer<typeof playersListQuerySchema>
```

## 3. Used Types

**DTO Types (already defined in `src/types/dto.ts`):**

```typescript
// Response DTOs
export type PlayerAdminDto = Pick<
  Player,
  'id' | 'name' | 'skillTier' | 'positions' | 'createdAt' | 'updatedAt'
>

export type PlayerUserDto = Pick<Player, 'id' | 'name' | 'createdAt'>

export type PlayersListAdminResponseDto = {
  players: PlayerAdminDto[]
  pagination: PaginationDto
}

export type PlayersListUserResponseDto = {
  players: PlayerUserDto[]
  pagination: PaginationDto
}

export type PaginationDto = {
  page: number
  limit: number
  total: number
  totalPages: number
}
```

**Service Types (to be created in `src/services/player.service.ts`):**

```typescript
export type ListPlayersOptions = {
  page: number
  limit: number
  sort: 'name' | 'skillTier' | 'createdAt'
  skillTier?: SkillTier
  position?: Position
  isAdmin: boolean
}
```

## 4. Return Type Details

**Success Response (Admin):**
```typescript
{
  players: [
    {
      id: string
      name: string
      skillTier: 'S' | 'A' | 'B' | 'C' | 'D'
      positions: ('PG' | 'SG' | 'SF' | 'PF' | 'C')[]
      createdAt: Date
      updatedAt: Date
    }
  ],
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

**Success Response (User):**
```typescript
{
  players: [
    {
      id: string
      name: string
      createdAt: Date
    }
  ],
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

**Error Response:**
Throws error for validation failures or database errors (caught by error boundaries)

## 5. Data Flow

1. **Authentication Check:**
   - Call `getUser()` to retrieve current user
   - Determine if user is admin: `isAdmin = user?.role === 'admin'`
   - No explicit authentication required (public query)

2. **Input Validation:**
   - Parse and validate input parameters using `playersListQuerySchema`
   - Transform sort field from snake_case to camelCase (skill_tier → skillTier, created_at → createdAt)
   - Apply default values for missing parameters

3. **Authorization Filter:**
   - If user is not admin and filters (skillTier, position) are provided:
     - Silently ignore filters (security measure)
     - Continue with query without filters

4. **Service Layer Call:**
   - Call `listPlayers()` service function with validated options
   - Pass `isAdmin` flag to determine response format

5. **Database Query:**
   - Build Prisma `where` clause based on filters (admin only)
   - Build Prisma `select` clause based on role:
     - Admin: All fields
     - User: Limited fields (id, name, createdAt)
   - Calculate `skip` and `take` for pagination
   - Transform sort field to Prisma orderBy format
   - Execute parallel queries: `findMany()` and `count()`

6. **Response Formatting:**
   - Calculate `totalPages` from total count
   - Format response with players array and pagination metadata
   - Return role-appropriate DTO

7. **No Revalidation Needed:**
   - Query operations don't require cache revalidation

## 6. Security Considerations

1. **Authentication:**
   - Not required for listing players (public data)
   - User context retrieved to determine role-based access

2. **Authorization:**
   - Admin-only filters enforced at service layer
   - Non-admin users cannot filter by skillTier or position
   - Silently ignore unauthorized filters (avoid information leakage)

3. **Data Exposure:**
   - Admin users receive full player details
   - Regular users receive limited player information
   - Sensitive fields (skillTier, positions, updatedAt) hidden from non-admins

4. **Input Sanitization:**
   - All inputs validated via Zod schema
   - Prisma provides SQL injection protection by default
   - Enum validation prevents invalid filter values

5. **Rate Limiting:**
   - Not implemented in MVP
   - Consider adding for production (e.g., 100 requests per minute)

## 7. Error Handling

**Potential Errors:**

1. **Validation Errors:**
   - Invalid page number (< 1): Zod validation error
   - Invalid limit (< 1 or > 100): Zod validation error
   - Invalid sort field: Zod enum validation error
   - Invalid skillTier enum: Zod validation error
   - Invalid position enum: Zod validation error
   - **Handling:** Throw error, caught by error boundary

2. **Database Errors:**
   - Connection failure: Prisma ClientError
   - Query timeout: Prisma timeout error
   - **Handling:** Throw error with generic message (don't expose internal details)

3. **Empty Results:**
   - No players found: Return empty array with pagination metadata
   - **Handling:** Not an error condition, return valid empty response

4. **Unexpected Errors:**
   - Unhandled exceptions: General Error
   - **Handling:** Log error, throw generic error message

**Error Response Pattern:**

Since this is a query function (not form action), errors are thrown and caught by error boundaries:

```typescript
try {
  const result = await getPlayersAction(params)
  return result
} catch (error) {
  // Caught by Next.js error boundary
  throw new Error('Failed to fetch players')
}
```

## 8. Performance Considerations

**Potential Bottlenecks:**

1. **Database Query Performance:**
   - Large player tables may slow pagination queries
   - Filter queries on non-indexed columns
   - **Optimization:**
     - Ensure indexes exist on sort fields (name, skill_tier, created_at)
     - Add GIN index for positions array filtering
     - Use `skip` and `take` for efficient pagination
     - Use `select` to minimize data transfer

2. **Count Query Performance:**
   - `count()` can be expensive on large tables
   - **Optimization:**
     - Run `findMany()` and `count()` in parallel with `Promise.all()`
     - Consider caching count for short periods
     - Use approximate count for very large tables

3. **Response Size:**
   - Large page sizes increase response payload
   - **Optimization:**
     - Cap limit at 100 items per page
     - Consider compression for large responses

**Caching Strategies:**

```typescript
import { unstable_cache } from 'next/cache'

export const getPlayersAction = unstable_cache(
  async (params?: GetPlayersParams) => {
    // Implementation
  },
  ['players-list'],
  {
    revalidate: 60, // Cache for 60 seconds
    tags: ['players'], // Tag for selective revalidation
  }
)
```

**Revalidation Strategies:**

- Revalidate after player mutations (create, update, delete)
- Use `revalidateTag('players')` after mutations
- Consider different cache durations for admin vs user responses

**Database Indexes (from db.md):**

```sql
-- Recommended indexes (add if not present)
CREATE INDEX idx_players_skill_tier ON players(skill_tier);
CREATE INDEX idx_players_positions ON players USING GIN(positions);
CREATE INDEX idx_players_created_at ON players(created_at DESC);
CREATE INDEX idx_players_name ON players(name); -- Likely exists due to UNIQUE constraint
```

## 9. Implementation Steps

### Step 1: Create Validation Schema
**File:** `src/lib/validations/player.ts`

- Import Zod and database types (SkillTier, Position)
- Define `playersListQuerySchema` with all parameters
- Add validation rules and default values
- Export schema and inferred type

### Step 2: Create Service Function
**File:** `src/services/player.service.ts`

- Import Prisma client and DTO types
- Define `ListPlayersOptions` type
- Implement `listPlayers()` function:
  - Build `where` clause based on filters (only if isAdmin)
  - Transform sort field to Prisma orderBy format (skill_tier → skillTier)
  - Build role-based `select` clause
  - Calculate `skip` and `take` for pagination
  - Execute parallel `findMany()` and `count()` queries
  - Calculate `totalPages`
  - Return role-appropriate DTO

### Step 3: Create Server Action
**File:** `src/lib/actions/players.ts`

- Add 'use server' directive at top of file
- Import validation schema, service function, and auth helpers
- Implement `getPlayersAction()`:
  - Get current user via `getUser()`
  - Determine if user is admin
  - Validate input parameters using Zod schema
  - Filter out admin-only parameters if user is not admin
  - Call `listPlayers()` service with validated options
  - Return result directly (no error wrapping needed)

### Step 4: Handle Errors
- Wrap service call in try-catch
- Log unexpected errors for monitoring
- Throw user-friendly error messages
- Let Next.js error boundaries handle thrown errors

### Step 5: Add Tests
**File:** `src/services/player.service.test.ts` and `src/lib/actions/players.test.ts`

- Test pagination logic (skip/take calculation)
- Test role-based field selection
- Test filter application (admin only)
- Test sort field transformation
- Test empty results handling
- Test validation errors
- Test unauthorized filter usage (non-admin)

### Step 6: Update Documentation
- Document function signature and usage examples
- Document role-based behavior
- Add JSDoc comments for IntelliSense

### Step 7: Integration
- Export action from `src/lib/actions/players.ts`
- Use in page components or API routes
- Add error boundaries in UI to catch errors
- Implement loading states for better UX

### Step 8: Performance Optimization
- Add database indexes if missing (see Performance Considerations)
- Consider adding caching with `unstable_cache`
- Monitor query performance in production
- Adjust cache duration based on usage patterns
