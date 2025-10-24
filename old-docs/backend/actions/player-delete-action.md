# Server Action Implementation Plan: deletePlayer

## 1. Server Action Overview

The `deletePlayer` server action removes a basketball player from the system.
This is an admin-only operation that validates the player ID, verifies the
player exists, checks for any dependencies, and permanently deletes the player
from the database. The action follows a defensive security model by validating
inputs, enforcing authorization, and handling cascade deletion scenarios.

## 2. Input Details

- **Function Name**: `deletePlayer`
- **File Location**: `src/actions/players.ts`
- **Signature**: `deletePlayer(_prevState: unknown, formData: FormData)`
- **Parameters**:
  - `_prevState`: unknown (required by server action signature, unused)
  - `formData`: FormData (contains player ID)
- **FormData Fields**:
  - **Required**:
    - `id`: string (UUID format) - Player ID to delete
- **Input Validation**: Zod schema `DeletePlayerSchema` in
  `src/lib/validations/player.ts`

```typescript
export const DeletePlayerSchema = z.object({
	id: z.string().uuid('Invalid player ID format'),
})
```

## 3. Used Types

**New Zod Schema** (to add to `src/lib/validations/player.ts`):

```typescript
export const DeletePlayerSchema = z.object({
	id: z.string().uuid('Invalid player ID format'),
})

export type DeletePlayerCommand = z.infer<typeof DeletePlayerSchema>
```

**New Service Function** (to add to `src/services/player.service.ts`):

```typescript
export async function deletePlayer(id: string): Promise<void>
```

**Return Type** (server action):

```typescript
// Success
{
	success: true
}

// Error (via conform)
{
	result: SubmissionResult
}
```

## 4. Output Details

**Success Response**:

```typescript
{
	success: true
}
```

**Error Response** (handled by `@conform-to/zod`):

The action returns `{ result: submission.reply() }` which contains field-level
validation errors and custom errors added via `ctx.addIssue()`.

**Error Scenarios in Transform**:

- User not authenticated → Custom issue "Something went wrong"
- User not admin → Custom issue "Something went wrong"
- Player not found → Custom issue "Player not found"
- Player in use (foreign key) → Custom issue "Cannot delete player assigned to
  teams"

**Thrown Errors** (unexpected):

- Database connection errors
- Unexpected Prisma errors
- JWT verification errors

## 5. Data Flow

1. **FormData Parsing**: Extract and validate player ID using `parseWithZod`
   with `DeletePlayerSchema`
2. **Authentication Check**: Retrieve current user via `getCurrentUser()` in
   schema transform
3. **Authorization Check**: Verify user has `admin` role
4. **Existence Check**: Verify player exists in database
5. **Service Call**: Invoke `deletePlayer()` service function
6. **Database Operation**: Service uses Prisma to delete player (cascades to
   `_PlayerToTeam`)
7. **Response Formation**: Return success response
8. **Error Handling**: Catch foreign key violations and other errors

```
Client → deletePlayer (action)
  → parseWithZod (FormData extraction)
    → Schema transform (when intent === null):
      → getCurrentUser (auth check)
      → Role check (admin)
      → prisma.player.findUnique (existence check)
  → deletePlayer (service)
    → prisma.player.delete (cascade deletes join table entries)
  → Return { success: true }
```

## 6. Security Considerations

1. **Authentication**: Verify user is logged in via JWT session cookie
2. **Authorization**: Enforce admin-only access (role check in schema transform)
3. **Input Validation**:
   - Zod schema validates UUID format
   - Prevents invalid IDs from reaching database layer
4. **SQL Injection Prevention**: Prisma ORM handles parameterization
   automatically
5. **Cascade Safety**: Database handles cascade deletion of join table entries
   via `ON DELETE CASCADE`
6. **Existence Verification**: Check player exists before attempting deletion
7. **Foreign Key Protection**: Catch `P2003` errors if player is referenced by
   non-cascading relations

## 7. Error Handling

| Error Scenario                 | Detection Method               | Message                                  | Action               |
| ------------------------------ | ------------------------------ | ---------------------------------------- | -------------------- |
| User not authenticated         | `!currentUser`                 | "Something went wrong"                   | Add custom Zod issue |
| User not admin                 | `currentUser.role !== 'admin'` | "Something went wrong"                   | Add custom Zod issue |
| Invalid UUID format            | Zod validation                 | "Invalid player ID format"               | Zod field error      |
| Player not found               | `!player` after findUnique     | "Player not found"                       | Add custom Zod issue |
| Player in foreign key relation | `error.code === 'P2003'`       | "Cannot delete player assigned to teams" | Add custom Zod issue |
| Database connection error      | Prisma error (not P2003/P2025) | N/A                                      | Rethrow error        |
| Unexpected errors              | Any other error                | N/A                                      | Rethrow error        |

**Prisma Error Codes**:

- `P2025`: Record not found (shouldn't occur due to pre-check)
- `P2003`: Foreign key constraint violation (player still referenced)

**Error Detection Strategy**:

- Pre-check player existence in schema transform
- Catch Prisma errors in service layer and rethrow
- Handle foreign key violations in schema transform
- Use `ctx.addIssue()` for expected errors
- Return `z.NEVER` to abort validation

## 8. Performance Considerations

**Database Operations**:

- 1 SELECT query (existence check in transform)
- 1 DELETE query (in service)
- Automatic cascade deletion in `_PlayerToTeam` join table

**Potential Bottlenecks**:

- Two database round-trips (findUnique + delete)
- Join table cascade deletion (minimal overhead)

**Optimization Strategies**:

- Could combine into single `deleteMany` with where clause (loses existence
  check clarity)
- Current approach preferred for explicit error handling
- Prisma automatically handles cascade deletion efficiently
- Foreign key indexes already exist (Prisma default)

**Performance Notes**:

- Expected operation time: <100ms under normal load
- Join table cascade is automatic and efficient
- No N+1 query issues
- Database triggers update related timestamps automatically

## 9. Implementation Steps

### Step 1: Create Zod Validation Schema

Add to `src/lib/validations/player.ts`:

```typescript
export const DeletePlayerSchema = z.object({
	id: z.string().uuid('Invalid player ID format'),
})

export type DeletePlayerCommand = z.infer<typeof DeletePlayerSchema>
```

### Step 2: Add Service Function

Add to `src/services/player.service.ts`:

```typescript
export async function deletePlayer(id: string): Promise<void> {
	await prisma.player.delete({
		where: { id },
	})
}
```

**Note**: The service function is simple because:

- Existence check is done in the action's schema transform
- Cascade deletion is handled automatically by database
- Foreign key errors bubble up to be caught in transform

### Step 3: Implement Server Action

Add to `src/actions/players.ts`:

```typescript
export async function deletePlayer(_prevState: unknown, formData: FormData) {
	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			DeletePlayerSchema.transform(async (data, ctx) => {
				if (intent !== null) return { ...data }

				// 1. Authentication check
				const currentUser = await getCurrentUser()

				if (!currentUser || currentUser.role !== 'admin') {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Something went wrong',
					})
					return z.NEVER
				}

				// 2. Existence check
				const player = await prisma.player.findUnique({
					where: { id: data.id },
					select: { id: true },
				})

				if (!player) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Player not found',
						path: ['id'],
					})
					return z.NEVER
				}

				return { ...data }
			}),
		async: true,
	})

	if (submission.status !== 'success') {
		return { result: submission.reply() }
	}

	// 3. Delete player via service
	try {
		await deletePlayerService(submission.value.id)
	} catch (error) {
		// Handle foreign key constraint violations (shouldn't occur with cascade)
		if (error.code === 'P2003') {
			return {
				result: submission.reply({
					formErrors: ['Cannot delete player assigned to teams'],
				}),
			}
		}

		// Rethrow unexpected errors
		throw error
	}

	return { success: true }
}
```

### Step 4: Add Imports

Update imports in `src/actions/players.ts`:

```typescript
import { getCurrentUser } from '#app/services/auth.server'
import { deletePlayer as deletePlayerService } from '#app/services/player.service'
import { DeletePlayerSchema } from '#app/lib/validations/player'
```

### Step 5: Update Service Imports

Ensure imports in `src/services/player.service.ts` include:

```typescript
import { prisma } from '#app/lib/db.server'
```

## Additional Notes

### Cascade Behavior

According to the database schema documentation:

- `_PlayerToTeam` join table has `ON DELETE CASCADE` for both `player_id` and
  `team_id`
- When a player is deleted, all team associations are automatically removed
- This is safe because teams can exist without players

### Why Pre-check Existence?

The implementation checks if the player exists before attempting deletion for
better UX:

- Provides clear "Player not found" error message
- Distinguishes between authorization and not-found errors
- Follows pattern established in `createPlayer`

### Alternative Approach

Could skip the existence check and catch `P2025` error from delete:

```typescript
// Not recommended - less clear error handling
try {
	await deletePlayerService(submission.value.id)
} catch (error) {
	if (error.code === 'P2025') {
		return {
			result: submission.reply({
				fieldErrors: { id: ['Player not found'] },
			}),
		}
	}
	throw error
}
```

Current approach is preferred because:

- More explicit and easier to understand
- Separates authorization from not-found errors
- Consistent with `createPlayer` pattern
