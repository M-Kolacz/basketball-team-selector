# Server Action Implementation Plan: recordGameResultAction

## 1. Server Action Overview

The `recordGameResultAction` is an admin-only server action that records game scores for a basketball game session. It supports two modes:
- **Create Mode**: Creates a new game with associated team scores
- **Update Mode**: Updates scores for an existing game

The action validates that all teams belong to the selected proposition, ensures admin authorization, and maintains referential integrity through database transactions.

## 2. Input Details

- **Function Name**: `recordGameResultAction`
- **File Location**: `src/lib/actions/games.ts`
- **Function Signature**: `async function recordGameResultAction(prevState: unknown, formData: FormData)`
- **Parameters**:
  - **Required**:
    - `gameSessionId`: UUID string - The game session to record results for
    - `scores`: Array (minimum 2) of objects containing:
      - `teamId`: UUID string - Team identifier
      - `points`: Number (0-300) - Team's score
  - **Optional**:
    - `gameId`: UUID string - If provided, updates existing game instead of creating new
- **Input Validation**:
  - Zod schema with async transform for authorization and database validation
  - Conform integration with `parseWithZod`
  - Intent handling for progressive validation

## 3. Used Types

### Prisma Models

```prisma
// From schema.prisma
model Game {
  id             String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  gameSessionId  String    @map("game_session_id") @db.Uuid
  gameSession    GameSession @relation(fields: [gameSessionId], references: [id], onDelete: Cascade)
  scores         Score[]
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz(6)
}

model Score {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  points    Int
  gameId    String   @map("game_id") @db.Uuid
  teamId    String   @map("team_id") @db.Uuid
  game      Game     @relation(fields: [gameId], references: [id], onDelete: Cascade)
  team      Team     @relation(fields: [teamId], references: [id])
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
}

model GameSession {
  id                      String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  gameDatetime            DateTime     @map("game_datetime") @db.Timestamptz(6)
  description             String?      @db.Text
  selectedPropositionId   String?      @unique @map("selected_proposition_id") @db.Uuid
  selectedProposition     Proposition? @relation("SelectedProposition", fields: [selectedPropositionId], references: [id], onDelete: SetNull)
  games                   Game[]
  propositions            Proposition[] @relation("GameSessionPropositions")
}
```

### Zod Schemas

```typescript
// File: src/lib/validations/games.ts
import { z } from 'zod'
import { prisma } from '#app/lib/db.server'
import { getCurrentUser } from '#app/lib/auth.server'

export const GameResultSchema = z
  .object({
    gameSessionId: z.string().uuid('Invalid game session ID'),
    gameId: z.string().uuid('Invalid game ID').optional(),
    scores: z
      .array(
        z.object({
          teamId: z.string().uuid('Invalid team ID'),
          points: z.coerce
            .number({
              required_error: 'Score is required',
              invalid_type_error: 'Score must be a number',
            })
            .int('Score must be a whole number')
            .min(0, 'Score cannot be negative')
            .max(300, 'Score cannot exceed 300'),
        })
      )
      .min(2, 'At least 2 team scores required'),
  })
  .transform(async (data, ctx) => {
    // Skip validation for intent submissions (Conform pattern)
    if (ctx.meta?.intent !== null) return data

    // Admin authorization check
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Unauthorized access',
      })
      return z.NEVER
    }

    // Validate game session exists with selected proposition
    const gameSession = await prisma.gameSession.findUnique({
      where: { id: data.gameSessionId },
      include: {
        selectedProposition: {
          include: { teams: true },
        },
      },
    })

    if (!gameSession) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Game session not found',
        path: ['gameSessionId'],
      })
      return z.NEVER
    }

    if (!gameSession.selectedProposition) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'No proposition selected for this game session',
        path: ['gameSessionId'],
      })
      return z.NEVER
    }

    // Validate all teams belong to selected proposition
    const propositionTeamIds = gameSession.selectedProposition.teams.map(t => t.id)
    const invalidTeams = data.scores.filter(s => !propositionTeamIds.includes(s.teamId))

    if (invalidTeams.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Some teams do not belong to the selected proposition',
        path: ['scores'],
      })
      return z.NEVER
    }

    // If updating, validate game exists and belongs to session
    if (data.gameId) {
      const existingGame = await prisma.game.findUnique({
        where: { id: data.gameId },
        select: { gameSessionId: true },
      })

      if (!existingGame) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Game not found',
          path: ['gameId'],
        })
        return z.NEVER
      }

      if (existingGame.gameSessionId !== data.gameSessionId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Game does not belong to this game session',
          path: ['gameId'],
        })
        return z.NEVER
      }
    }

    return { ...data, gameSession }
  })

export type GameResultInput = z.input<typeof GameResultSchema>
export type GameResultOutput = z.output<typeof GameResultSchema>
```

## 4. Output Details

### Success Response

**Create Mode**:
```typescript
redirect(`/games/${gameSessionId}`)
```

**Update Mode**:
```typescript
redirect(`/games/${gameSessionId}`)
```

### Error Response

```typescript
{
  result: {
    status: 'error',
    initialValue: GameResultInput,
    error: {
      // Form-level errors
      '': ['Error message'],
      // Field-level errors
      gameSessionId?: ['Error message'],
      gameId?: ['Error message'],
      scores?: ['Error message'],
      'scores[0].teamId'?: ['Error message'],
      'scores[0].points'?: ['Error message'],
    }
  }
}
```

## 5. Data Flow

### Create Mode Flow

1. **Input Reception**: Receive `formData` with gameSessionId and scores array
2. **Parse & Validate**: Use `parseWithZod` with `GameResultSchema`
3. **Transform Validation**:
   - Check user is authenticated admin
   - Verify game session exists with selected proposition
   - Validate all team IDs belong to proposition
4. **Database Transaction**:
   - Create new `Game` record with gameSessionId
   - Create multiple `Score` records linked to new game
5. **Revalidation**: Invalidate cache for `/games/[id]` route
6. **Redirect**: Navigate to game session detail page

### Update Mode Flow

1. **Input Reception**: Receive `formData` with gameSessionId, gameId, and scores array
2. **Parse & Validate**: Use `parseWithZod` with `GameResultSchema`
3. **Transform Validation**:
   - Check user is authenticated admin
   - Verify game session exists with selected proposition
   - Verify game exists and belongs to session
   - Validate all team IDs belong to proposition
4. **Database Transaction**:
   - Delete existing `Score` records for the game
   - Create new `Score` records with updated values
5. **Revalidation**: Invalidate cache for `/games/[id]` route
6. **Redirect**: Navigate to game session detail page

### Database Interactions

```typescript
// Create Mode - Prisma Transaction
await prisma.$transaction([
  prisma.game.create({
    data: {
      gameSessionId: validatedData.gameSessionId,
      scores: {
        create: validatedData.scores.map(score => ({
          teamId: score.teamId,
          points: score.points,
        })),
      },
    },
  }),
])

// Update Mode - Prisma Transaction
await prisma.$transaction([
  prisma.score.deleteMany({
    where: { gameId: validatedData.gameId },
  }),
  prisma.score.createMany({
    data: validatedData.scores.map(score => ({
      gameId: validatedData.gameId,
      teamId: score.teamId,
      points: score.points,
    })),
  }),
])
```

## 6. Security Considerations

### Authentication & Authorization

- **Admin Check**: Validate user role is 'admin' in Zod transform
- **Session Validation**: Use `getCurrentUser()` from auth.server.ts
- **Failure Mode**: Return form error via `ctx.addIssue`, do not reveal unauthorized access reason

### Input Validation

- **UUID Validation**: All IDs validated as proper UUID format
- **Score Range**: Points constrained to 0-300 range
- **Minimum Teams**: At least 2 teams required for valid game
- **Type Coercion**: Use `z.coerce.number()` for numeric inputs from FormData

### Data Integrity

- **Referential Integrity**:
  - Verify game session exists before creating game
  - Verify teams belong to selected proposition
  - Verify game belongs to session (update mode)
- **Transaction Safety**: Use Prisma transactions for atomic create/update operations
- **Cascade Behavior**: Rely on DB cascade rules for score deletion on game delete

### Authorization Checks

1. User must be authenticated (getCurrentUser returns non-null)
2. User role must be 'admin'
3. Game session must exist and have selected proposition
4. All teams must belong to selected proposition
5. Game must belong to session (update mode)

## 7. Error Handling

### Expected Errors (Return SubmissionResult)

| Error Condition | Error Message | Path | HTTP Status |
|----------------|---------------|------|-------------|
| Not authenticated/admin | "Unauthorized access" | Root | N/A (form error) |
| Game session not found | "Game session not found" | `['gameSessionId']` | N/A (form error) |
| No selected proposition | "No proposition selected for this game session" | `['gameSessionId']` | N/A (form error) |
| Teams not in proposition | "Some teams do not belong to the selected proposition" | `['scores']` | N/A (form error) |
| Game not found (update) | "Game not found" | `['gameId']` | N/A (form error) |
| Game/session mismatch | "Game does not belong to this game session" | `['gameId']` | N/A (form error) |
| Invalid UUID | "Invalid [field] ID" | Field-specific | N/A (form error) |
| Score < 0 | "Score cannot be negative" | `['scores[i].points']` | N/A (form error) |
| Score > 300 | "Score cannot exceed 300" | `['scores[i].points']` | N/A (form error) |
| < 2 teams | "At least 2 team scores required" | `['scores']` | N/A (form error) |

### Unexpected Errors (Throw)

- Database connection failures
- Prisma transaction failures
- getCurrentUser() failures
- Unexpected null/undefined values

These should propagate as thrown errors and be caught by Next.js error boundaries.

## 8. Implementation Steps

1. **Create Validation Schema** (`src/lib/validations/games.ts`):
   - Define `GameResultSchema` with base validation
   - Add async transform for authorization and DB validation
   - Export input/output types

2. **Create Server Action** (`src/lib/actions/games.ts`):
   - Add `'use server'` directive at top of file
   - Define `recordGameResultAction` function
   - Parse FormData with `parseWithZod(formData, { schema: GameResultSchema })`
   - Handle submission status checks

3. **Implement Create Logic**:
   - Check if `gameId` is absent
   - Use Prisma transaction to create game + scores atomically
   - Handle nested create for scores relation

4. **Implement Update Logic**:
   - Check if `gameId` is present
   - Use Prisma transaction to delete old scores and create new ones
   - Ensure atomic operation

5. **Add Revalidation**:
   - Import `revalidatePath` from 'next/cache'
   - Call `revalidatePath(`/games/${gameSessionId}`)` before redirect
   - Ensure cache invalidation occurs before navigation

6. **Error Handling**:
   - Return `{ result }` for validation errors
   - Wrap unexpected errors with try-catch if needed
   - Let database errors propagate for error boundary handling

7. **Testing Considerations**:
   - Unit tests for schema validation (Vitest)
   - Mock Prisma client for isolated testing
   - E2E tests for full flow (Playwright)
   - Test both create and update paths
   - Test authorization failures
   - Test invalid team IDs

8. **Type Safety**:
   - Export and use `GameResultInput` and `GameResultOutput` types
   - Ensure return type is `Promise<{ result: SubmissionResult } | void>`
   - Use Prisma generated types for database operations
