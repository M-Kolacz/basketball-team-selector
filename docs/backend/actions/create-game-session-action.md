# Server Action Implementation Plan: createGameSessionAction

## 1. Server Action Overview

Creates a new game session with selected players for an upcoming basketball
game. Admin-only functionality that validates player selection (10-20 players),
ensures future date, and verifies player existence before creating the session.

## 2. Input Details

- **Function Name**: `createGameSessionAction`
- **File Location**: `src/lib/actions/game-sessions.ts`
- **Parameters**:
  - Required:
    - `prevState: unknown` - Previous form state (Conform pattern)
    - `formData: FormData` - Form data containing:
      - `gameDatetime: string` - ISO datetime string for game
      - `playerIds: string[]` - Array of player UUID strings (10-20 items)
  - Optional:
    - `description: string` - Optional description (max 500 chars)
- **Input Validation**: Zod schema with async transform for database checks

## 3. Used Types

### Prisma Models

```typescript
// GameSession model
model GameSession {
  id           String   @id @default(uuid())
  gameDatetime DateTime
  description  String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  propositions          Proposition[]
  selectedProposition   Proposition?  @relation("SelectedProposition", fields: [selectedPropositionId], references: [id])
  selectedPropositionId String?       @unique
  games                 Game[]
}

// Player model (for validation)
model Player {
  id        String     @id @default(uuid())
  name      String     @unique
  skillTier SkillTier  @default(B)
  positions Position[] @default([])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  teams Team[]
}
```

### Zod Schema

```typescript
// Base schema (already exists in validations/game-session.ts)
export const CreateGameSessionSchema = z.object({
	gameDatetime: z.string().datetime('Invalid datetime format'),
	description: z.string().max(500).optional(),
	playerIds: z.array(z.string().uuid()),
})

// Extended with async transform (to be implemented in action)
const CreateGameSessionSchemaWithValidation = (intent: string | null) =>
	CreateGameSessionSchema.transform(async (data, ctx) => {
		if (intent !== null) return { ...data }

		// Admin authorization
		const user = await getCurrentUser()
		if (!user || user.role !== 'admin') {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Unauthorized access',
			})
			return z.NEVER
		}

		// Future date validation
		const gameDate = new Date(data.gameDatetime)
		if (gameDate <= new Date()) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Game date must be in the future',
				path: ['gameDatetime'],
			})
			return z.NEVER
		}

		// Player count validation
		if (data.playerIds.length < 10) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Minimum 10 players required',
				path: ['playerIds'],
			})
			return z.NEVER
		}
		if (data.playerIds.length > 20) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Maximum 20 players allowed',
				path: ['playerIds'],
			})
			return z.NEVER
		}

		// Validate all players exist
		const players = await prisma.player.findMany({
			where: { id: { in: data.playerIds } },
		})
		if (players.length !== data.playerIds.length) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Some players do not exist',
				path: ['playerIds'],
			})
			return z.NEVER
		}

		return { ...data, players }
	})
```

### Type Inference

```typescript
export type CreateGameSessionCommand = z.infer<typeof CreateGameSessionSchema>
```

## 4. Output Details

### Success Case

Redirects to `/games` after successful creation. No explicit return value before
redirect.

```typescript
// After database operation and revalidation
redirect('/games')
```

### Error Cases

Returns Conform `SubmissionResult` for validation errors:

```typescript
{
	result: SubmissionResult
}
// Where SubmissionResult contains:
// - status: 'error'
// - error: { [field]: string[] } for field-level errors
// - error: string for form-level errors
```

### Unexpected Errors

Throws errors for server/database failures (handled by error boundaries):

```typescript
throw new Error('Database operation failed')
```

## 5. Data Flow

1. **Parse Input**: Extract and validate formData using `parseWithZod`
2. **Validation Phase** (async transform):
   - Skip validation if intent is not null (Conform validation mode)
   - Fetch current user via `getCurrentUser()`
   - Verify user is admin role
   - Parse gameDatetime string to Date object
   - Validate gameDatetime is in future
   - Validate playerIds array length (10-20)
   - Query database for all player IDs via `prisma.player.findMany()`
   - Verify all players exist (count matches)
3. **Submission Check**:
   - If validation failed, return `{ result: submission.reply() }`
   - Extract validated data from `submission.value`
4. **Database Operation**:
   - Create GameSession record via `prisma.gameSession.create()`
   - Include gameDatetime and description
   - Note: Player association happens later via proposition creation
5. **Cache Invalidation**:
   - Call `revalidatePath('/games')` to refresh game sessions list
6. **Redirect**:
   - Redirect to `/games` route

## 6. Security Considerations

### Authentication & Authorization

- Uses `getCurrentUser()` helper to fetch authenticated user from JWT session
- Verifies user exists and has `role === 'admin'`
- Returns form-level error "Unauthorized access" for non-admin users
- Authorization check happens during async transform before any database
  operations

### Input Validation

1. **Type Safety**:
   - Zod ensures gameDatetime is valid ISO datetime string
   - Zod ensures playerIds is array of valid UUIDs
   - Zod ensures description is string with max 500 chars

2. **Business Rules**:
   - GameDatetime must be future date (prevents backdating)
   - Player count must be 10-20 (game requirement)
   - All player IDs must exist in database (prevents orphaned references)

3. **SQL Injection Prevention**:
   - Prisma uses parameterized queries automatically
   - No raw SQL or string interpolation

### Data Integrity

- Player existence validated before session creation
- Transaction not explicitly needed (single create operation)
- If future enhancements add related data, wrap in `prisma.$transaction()`

## 7. Error Handling

### Expected Errors (Return SubmissionResult)

| Scenario                | Error Message                     | Path           | Code           |
| ----------------------- | --------------------------------- | -------------- | -------------- |
| Non-admin user          | "Unauthorized access"             | form-level     | custom         |
| Past/current date       | "Game date must be in the future" | `gameDatetime` | custom         |
| < 10 players            | "Minimum 10 players required"     | `playerIds`    | custom         |
| > 20 players            | "Maximum 20 players allowed"      | `playerIds`    | custom         |
| Non-existent players    | "Some players do not exist"       | `playerIds`    | custom         |
| Invalid datetime format | "Invalid datetime format"         | `gameDatetime` | invalid_string |
| Description > 500 chars | Zod default message               | `description`  | too_big        |
| Invalid UUID in array   | Zod default message               | `playerIds[i]` | invalid_string |

### Unexpected Errors (Throw)

- Database connection failures
- Prisma constraint violations
- JWT verification failures in `getCurrentUser()`
- Network timeouts

These are not caught and will bubble up to Next.js error boundaries.

## 8. Implementation Steps

1. **Add 'use server' directive** at top of file if not present

2. **Import dependencies**:

   ```typescript
   import { parseWithZod } from '@conform-to/zod'
   import { revalidatePath } from 'next/cache'
   import { redirect } from 'next/navigation'
   import z from 'zod'
   import { getCurrentUser } from '#app/lib/auth.server'
   import { prisma } from '#app/lib/db.server'
   import { CreateGameSessionSchema } from '#app/lib/validations/game-session'
   ```

3. **Implement server action function**:

   ```typescript
   export async function createGameSessionAction(
   	_prevState: unknown,
   	formData: FormData,
   )
   ```

4. **Parse and validate input** with async transform:

   ```typescript
   const submission = await parseWithZod(formData, {
   	schema: (intent) =>
   		CreateGameSessionSchema.transform(async (data, ctx) => {
   			// Skip validation during Conform intent checks
   			if (intent !== null) return { ...data }

   			// Implement all validation logic here
   			// (admin check, future date, player count, player existence)

   			return { ...data, players }
   		}),
   	async: true,
   })
   ```

5. **Check submission status**:

   ```typescript
   if (submission.status !== 'success') {
   	return { result: submission.reply() }
   }
   ```

6. **Extract validated data**:

   ```typescript
   const { gameDatetime, description } = submission.value
   ```

7. **Create game session in database**:

   ```typescript
   await prisma.gameSession.create({
   	data: {
   		gameDatetime: new Date(gameDatetime),
   		description: description ?? null,
   	},
   	select: {
   		id: true,
   	},
   })
   ```

8. **Revalidate cache**:

   ```typescript
   revalidatePath('/games')
   ```

9. **Redirect to success page**:
   ```typescript
   redirect('/games')
   ```

### Notes

- Players are NOT directly connected to GameSession in this action
- Player-team associations happen later via proposition creation
- The `players` field from validation transform is NOT used in database creation
- Future enhancement: Store player IDs in separate table if needed for history
- Consider adding try-catch around database operation if custom error handling
  needed
