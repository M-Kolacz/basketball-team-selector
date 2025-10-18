# Server Action Implementation Plan: getPlayers

## 1. Server Action Overview

The `getPlayers` server action retrieves a list of all players from the database
with role-based field filtering. Admin users receive full player details
including skill tier and positions, while regular users receive only basic
information (id, name, created_at).

## 2. Input Details

- **Function Name**: `getPlayers`
- **File Location**: `src/actions/players.ts`
- **Input Validation**: Zod schema `GetPlayersOptionsSchema`

```typescript
const GetPlayersOptionsSchema = z
	.object({
		sort: z.enum(['name', 'skill_tier', 'created_at']).optional(),
		skill_tier: z.enum(['S', 'A', 'B', 'C', 'D']).optional(),
		position: z.enum(['PG', 'SG', 'SF', 'PF', 'C']).optional(),
	})
	.optional()
```

## 3. Used Types

### DTOs (from `src/types/dto.ts`)

```typescript
// Admin response - full player details
type PlayerAdminDto = Pick<
	Player,
	'id' | 'name' | 'skillTier' | 'positions' | 'createdAt' | 'updatedAt'
>

// User response - limited player details
type PlayerUserDto = Pick<Player, 'id' | 'name' | 'createdAt'>
```

### Validation Schema (new - in `src/lib/validations/player.ts`)

```typescript
export const GetPlayersOptionsSchema = z
	.object({
		sort: z.enum(['name', 'skill_tier', 'created_at']).optional(),
		skill_tier: z.enum(['S', 'A', 'B', 'C', 'D']).optional(),
		position: z.enum(['PG', 'SG', 'SF', 'PF', 'C']).optional(),
	})
	.optional()

export type GetPlayersOptions = z.infer<typeof GetPlayersOptionsSchema>
```

### Service Layer Types (new method in `src/services/player.service.ts`)

```typescript
export type ListAllPlayersOptions = {
	sort?: 'name' | 'skillTier' | 'createdAt'
	skillTier?: SkillTier
	position?: Position
	isAdmin: boolean
}
```

## 4. Output Details

### Success Response (Admin)

```typescript
{
  success: true,
  players: Array<{
    id: string
    name: string
    skill_tier?: 'S' | 'A' | 'B' | 'C' | 'D'
    positions?: Array<'PG' | 'SG' | 'SF' | 'PF' | 'C'>
    created_at: Date
    updated_at: Date
  }>
}
```

### Success Response (User)

```typescript
{
  success: true,
  players: Array<{
    id: string
    name: string
    created_at: Date
  }>
}
```

### Error Response (Expected Errors)

```typescript
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR' | 'UNAUTHORIZED',
    message: string,
    fields?: Record<string, string[]>  // For validation errors
  }
}
```

### Thrown Errors (Unexpected Errors)

Unexpected errors (database failures, etc.) are thrown and handled by Next.js
error boundaries.

## 5. Data Flow

1. **Authentication Check**: Retrieve current user from session/JWT using auth
   utility
2. **Authorization Check**: If no user, return `UNAUTHORIZED` error
3. **Role Determination**: Check if user role is 'admin'
4. **Parameter Transformation**:
   - Filter out admin-only parameters (skill_tier, position) if user is not
     admin
5. **Service Call**: Invoke `listAllPlayers` service method
6. **Response Formatting**: Return success response with players array
7. **Error Handling**: Catch validation errors and return formatted error
   response

### Service Layer Data Flow

1. **Query Building**: Construct Prisma where clause
2. **Field Selection**: Select fields based on user role
3. **Database Query**: Execute single findMany query with where, select
4. **Result Mapping**: Map database results to appropriate DTO format
5. **Return**: Return array of players

## 6. Security Considerations

### Authentication & Authorization

- **Authentication Required**: User must be authenticated to call this action
- **Return UNAUTHORIZED**: If user not authenticated, return
  `{ success: false, error: { code: 'UNAUTHORIZED', ... } }`
- **Role-Based Field Filtering**: Return different fields based on user role

### Data Protection

- **Field-Level Security**: Non-admin users receive only id, name, and
  created_at
- **No Sensitive Data Exposure**: Error messages don't expose internal
  implementation details

## 7. Error Handling

### Expected Errors (Return Format)

| Error Code         | Trigger Condition        | HTTP Equivalent | Message                    | Fields                |
| ------------------ | ------------------------ | --------------- | -------------------------- | --------------------- |
| `UNAUTHORIZED`     | User not authenticated   | 401             | "Authentication required"  | -                     |
| `VALIDATION_ERROR` | Invalid input parameters | 400             | "Invalid input parameters" | Field-specific errors |

### Validation Error Examples

```typescript
// Invalid sort field
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid input parameters',
    fields: {
      sort: ["Invalid enum value. Expected 'name' | 'skill_tier' | 'created_at'"]
    }
  }
}

// Invalid skill_tier value
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid input parameters',
    fields: {
      skill_tier: ["Invalid enum value. Expected 'S' | 'A' | 'B' | 'C' | 'D'"]
    }
  }
}
```

### Unexpected Errors (Thrown)

- **Database Connection Failures**: Prisma connection errors
- **Query Execution Errors**: Unexpected Prisma query failures
- **Service Layer Errors**: Unexpected errors from player service

These are thrown and logged by Next.js, returning generic 500 errors to client.

## 9. Implementation Steps

### Step 1: Create Validation Schema

**File**: `src/lib/validations/player.ts`

- Add `GetPlayersOptionsSchema` Zod schema
- Export inferred type `GetPlayersOptions`

### Step 2: Create Service Method

**File**: `src/services/player.service.ts`

- Create `listAllPlayers` function with `ListAllPlayersOptions` parameter
- Build where clause conditionally based on `isAdmin` flag
- Build select clause based on `isAdmin` flag
- Execute Prisma query with where, select
- Return array of players typed as `PlayerAdminDto[]` or `PlayerUserDto[]`

### Step 3: Implement Server Action

**File**: `src/actions/players.ts`

- Add `'use server'` directive at top of file
- Import necessary types, schemas, and services
- Implement `getPlayers` async function:
  - Get current user via auth utility
  - Check authentication, return UNAUTHORIZED if not authenticated
  - Validate input using `GetPlayersOptionsSchema`
  - Determine admin role
  - Transform sort field from snake_case to camelCase
  - Filter out admin-only parameters if not admin
  - Call `listAllPlayers` service
  - Return success response
  - Catch validation errors and return VALIDATION_ERROR
  - Throw unexpected errors

### Step 4: Add Auth Utility (if not exists)

**File**: `src/lib/auth.server.ts` (or appropriate auth module)

- Implement `getCurrentUser()` function to retrieve user from session/JWT
- Return user object with `{ id, username, role }` or null if not authenticated
- Update placeholder in `src/lib/actions/players.ts` (line 14-17)

### Step 5: Update Existing Implementation (if applicable)

**File**: `src/lib/actions/players.ts`

- Note: Current implementation includes pagination which spec doesn't require
- Either:
  - Rename current `getPlayersAction` to `getPlayersPaginated`
  - Implement new `getPlayers` per spec
- Or update existing action to match spec exactly
