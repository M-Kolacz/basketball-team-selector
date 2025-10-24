# Server Action Implementation Plan: updatePlayer

## 1. Server Action Overview

Updates an existing player's information in the database. Only administrators
can perform this operation. The action validates input data, checks for
permissions, ensures the player exists, and verifies name uniqueness if the name
is being changed.

## 2. Input Details

- **Function Name:** `updatePlayer`
- **File Location:** [src/actions/players.ts](src/actions/players.ts)
- **Directive:** `'use server'` (already present in file)
- **Parameters:**
  - `_prevState: unknown` - Previous state (required by server action signature,
    unused)
  - `formData: FormData` - Form data containing player updates

**FormData Fields:**

- `id: string` (required) - UUID of player to update
- `name?: string` (optional) - Updated player name (1-100 chars, trimmed)
- `skillTier?: "S" | "A" | "B" | "C" | "D"` (optional) - Updated skill tier
- `positions?: Array<"PG" | "SG" | "SF" | "PF" | "C">` (optional) - Updated
  positions array (min 1 if provided)

**Input Validation:** Create `UpdatePlayerSchema` in
[src/lib/validations/player.ts](src/lib/validations/player.ts):

```typescript
export const UpdatePlayerSchema = z.object({
	id: z.string().uuid('Invalid player ID format'),
	name: z
		.string()
		.min(1, 'Player name is required')
		.max(100, 'Player name must be at most 100 characters')
		.trim()
		.optional(),
	skillTier: z
		.enum(['S', 'A', 'B', 'C', 'D'], {
			message: 'Skill tier must be one of: S, A, B, C, D',
		})
		.optional(),
	positions: z
		.array(z.enum(['PG', 'SG', 'SF', 'PF', 'C']), {
			message: 'Position must be one of: PG, SG, SF, PF, C',
		})
		.min(1, 'At least one position must be selected')
		.optional(),
})
```

## 3. Used Types

**Existing Types** (from [src/types/dto.ts](src/types/dto.ts)):

- `UpdatePlayerCommandDto` (line 82) - `Partial<CreatePlayerCommandDto>`
- `PlayerAdminDto` (line 59-62) - Return type for admin player data

**New Service Function** (to add to
[src/services/player.service.ts](src/services/player.service.ts)):

```typescript
export async function updatePlayer(
	id: string,
	data: UpdatePlayerCommandDto,
): Promise<PlayerAdminDto>
```

**Zod Schema Type** (to add to
[src/lib/validations/player.ts](src/lib/validations/player.ts)):

```typescript
export type UpdatePlayerCommand = z.infer<typeof UpdatePlayerSchema>
```

## 4. Output Details

**Success Response:**

```typescript
{
	success: true
}
```

**Error Response (Conform format):**

```typescript
{
	result: {
		// Conform reply object with validation errors
		// Contains field-level errors and general errors
	}
}
```

**Error handling follows Conform pattern:**

- Field-level errors added via `ctx.addIssue()` with optional `path`
- Generic errors for auth failures ("Something went wrong")
- Specific field errors for business logic failures

## 5. Data Flow

1. Receive `formData` from client
2. Parse with `parseWithZod` using `UpdatePlayerSchema` with async transform
3. **During transform (if intent === null):**
   - Get current user via `getCurrentUser()`
   - Check user exists and has admin role
   - Fetch existing player by ID to verify existence
   - If name is being updated and differs from current, check name uniqueness
4. If validation fails, return `{ result: submission.reply() }`
5. If validation succeeds, extract validated data
6. Call `updatePlayer` service function with ID and update data
7. Return `{ success: true }`

**Database Interaction:**

- Read: `prisma.player.findUnique()` - check player existence and current name
- Read: `prisma.player.findUnique()` - check name uniqueness (if name changing)
- Write: `prisma.player.update()` - update player data

## 6. Security Considerations

**Authentication:**

- Check user is logged in via `getCurrentUser()`
- Return generic error if not authenticated

**Authorization:**

- Verify user has `admin` role
- Return generic error "Something went wrong" if unauthorized (same pattern as
  existing actions)

**Input Validation:**

- All inputs validated with Zod schema
- UUID format validation for player ID
- String length limits (1-100 chars for name)
- Enum validation for skillTier and positions
- Array minimum length validation for positions

**Data Integrity:**

- Verify player exists before update
- Check name uniqueness only if name is being changed and differs from current
- Only update fields explicitly provided (partial update)

**SQL Injection Prevention:**

- Prisma ORM parameterizes all queries

**CSRF Protection:**

- Next.js server actions include built-in CSRF protection

## 7. Error Handling

| Error Scenario        | Validation Method | Error Message                                                            | Error Path    |
| --------------------- | ----------------- | ------------------------------------------------------------------------ | ------------- |
| No authentication     | Zod custom issue  | "Something went wrong"                                                   | (none)        |
| Not admin role        | Zod custom issue  | "Something went wrong"                                                   | (none)        |
| Invalid UUID format   | Zod built-in      | "Invalid player ID format"                                               | ['id']        |
| Player not found      | Zod custom issue  | "Player not found"                                                       | ['id']        |
| Name already exists   | Zod custom issue  | "Player with this name already exists"                                   | ['name']      |
| Name too short/long   | Zod built-in      | "Player name is required" / "Player name must be at most 100 characters" | ['name']      |
| Invalid skill tier    | Zod built-in      | "Skill tier must be one of: S, A, B, C, D"                               | ['skillTier'] |
| Invalid positions     | Zod built-in      | "Position must be one of: PG, SG, SF, PF, C"                             | ['positions'] |
| Positions array empty | Zod built-in      | "At least one position must be selected"                                 | ['positions'] |
| Unexpected DB error   | Thrown exception  | (Let Next.js handle)                                                     | N/A           |

**Error Handling Pattern:**

- Expected errors: Return via Conform's `submission.reply()`
- Unexpected errors: Throw and let framework handle
- Generic auth errors to avoid information leakage

## 8. Performance Considerations

**Potential Bottlenecks:**

- Multiple database queries during validation (getCurrentUser, findUnique for
  player, findUnique for name check)
- Name uniqueness check only needed conditionally

**Optimization Strategies:**

- Only check name uniqueness if name field is provided AND differs from current
  value
- Use minimal `select` clauses to fetch only needed fields
- Leverage Prisma query optimization
- Database has automatic index on `players.name` (unique constraint)

**Expected Performance:**

- Validation: ~50-100ms (includes auth and DB checks)
- Update operation: ~20-50ms
- Total: ~100-200ms for typical update

## 9. Implementation Steps

1. **Create Zod Schema**
   ([src/lib/validations/player.ts](src/lib/validations/player.ts))
   - Add `UpdatePlayerSchema` with id (required) and optional update fields
   - Export `UpdatePlayerCommand` type

2. **Create Service Function**
   ([src/services/player.service.ts](src/services/player.service.ts))
   - Implement `updatePlayer(id: string, data: UpdatePlayerCommandDto)`
   - Use Prisma to update player with provided fields
   - Return updated player with admin fields (id, name, skillTier, positions,
     createdAt, updatedAt)

3. **Implement Server Action**
   ([src/actions/players.ts](src/actions/players.ts))
   - Import `UpdatePlayerSchema`
   - Create `updatePlayer` function with proper signature
   - Use `parseWithZod` with async transform:
     - Check authentication and authorization (admin role)
     - Verify player exists by ID, store current player data
     - If name is provided and differs from current, check uniqueness
     - Return validated data or add issues for errors
   - On validation failure, return `{ result: submission.reply() }`
   - On success, call service function
   - Return `{ success: true }`

4. **Testing Considerations**
   - Test with valid partial updates (name only, skillTier only, positions only)
   - Test with multiple fields updating simultaneously
   - Test name uniqueness validation
   - Test player not found scenario
   - Test unauthorized access (non-admin)
   - Test invalid UUID format
   - Test invalid enum values
   - Test empty positions array
