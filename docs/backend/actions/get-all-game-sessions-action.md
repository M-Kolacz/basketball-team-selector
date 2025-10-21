# Server Action Implementation Plan: getAllGameSessionsAction

## 1. Server Action Overview

The `getAllGameSessionsAction` is a read-only server action that retrieves all
game sessions from the database, ordered by game datetime in descending order
(most recent first). It includes nested relations to fetch the selected
proposition with its associated teams and players. This action is primarily used
for displaying a list of all games on the games page.

## 2. Input Details

- **Function Name:** `getAllGameSessionsAction`
- **File Location:** `src/lib/actions/game-sessions.ts`
- **Parameters:** None
- **Input Validation:** None required (no parameters)

## 3. Used Types

### Alternative Explicit Type Definition

```typescript
import type {
	GameSession,
	Proposition,
	Team,
	Player,
} from '#app/generated/prisma'

type GameSessionWithRelations = GameSession & {
	selectedProposition:
		| (Proposition & {
				teams: (Team & {
					players: Player[]
				})[]
		  })
		| null
}
```

## 4. Output Details

### Success Case

Returns an array of game session objects with nested relations:

```typescript
GameSessionWithRelations[]
```

Example structure:

```typescript
[
  {
    id: "uuid",
    gameDatetime: Date,
    description: "string" | null,
    games: JsonValue, // JSONB array of game results
    selectedPropositionId: "uuid" | null,
    createdAt: Date,
    updatedAt: Date,
    selectedProposition: {
      id: "uuid",
      gameSessionId: "uuid",
      type: "position_focused" | "skill_balanced" | "general",
      createdAt: Date,
      teams: [
        {
          id: "uuid",
          createdAt: Date,
          updatedAt: Date,
          players: [
            {
              id: "uuid",
              name: "string",
              skillTier: "S" | "A" | "B" | "C" | "D",
              positions: ["PG", "SG", ...],
              createdAt: Date,
              updatedAt: Date
            }
          ]
        }
      ]
    } | null
  }
]
```

### Error Cases

All errors are thrown (not returned as SubmissionResult):

```typescript
// Database errors
throw new Error('Failed to fetch game sessions')

// Unexpected errors
throw new Error('An unexpected error occurred')
```

## 5. Data Flow

1. **Action invoked** → Function called from UI component
2. **Database query** → Prisma executes `findMany` with nested includes
3. **Data retrieval** → PostgreSQL returns game sessions with joined data from:
   - `game_sessions` table
   - `propositions` table (via selectedPropositionId)
   - `_PropositionToTeam` join table
   - `teams` table
   - `_PlayerToTeam` join table
   - `players` table
4. **Result ordering** → Data sorted by `gameDatetime DESC`
5. **Return** → Typed array returned to caller

### Database Query Details

```typescript
const gameSessions = await prisma.gameSession.findMany({
	orderBy: { gameDatetime: 'desc' },
	include: {
		selectedProposition: {
			include: {
				teams: {
					include: {
						players: true,
					},
				},
			},
		},
	},
})
```

## 6. Security Considerations

### Authentication

**Recommendation:** Add authentication check to verify user is logged in before
allowing access.

```typescript
const userId = await requireUserId()
```

Use the `requireUserId()` helper from `src/lib/auth.server.ts` to ensure only
authenticated users can access game sessions.

### Authorization

- **Public access** (any authenticated user)

### Data Exposure

- Returns full player details (name, skill tier, positions)
- Includes game scores and history
- No sensitive data like passwords or JWT tokens exposed
- Consider if any fields should be excluded in future iterations

### Performance Considerations

- **No pagination:** Returns all records; could be performance issue with many
  games
- **Nested includes:** Multiple JOIN operations may be expensive
- **Recommendation:** Consider adding pagination parameters in future

## 7. Error Handling

### Error Handling Strategy

Since this is not a form action (no `prevState` parameter), use throw pattern:

```typescript
try {
	// Database operation
} catch (error) {
	console.error('Error fetching game sessions:', error)
	throw new Error('Failed to fetch game sessions')
}
```

### Error Scenarios

| Scenario                    | Handling          | Message                         |
| --------------------------- | ----------------- | ------------------------------- |
| Database connection failure | Catch, log, throw | "Failed to fetch game sessions" |
| Prisma query error          | Catch, log, throw | "Failed to fetch game sessions" |
| Unexpected error            | Catch, log, throw | "An unexpected error occurred"  |

### Logging

Include error details in console for debugging:

```typescript
console.error('Error fetching game sessions:', error)
```

## 8. Implementation Steps

### Step 1: Create File Structure

Create `src/lib/actions/game-sessions.ts` if it doesn't exist.

### Step 2: Add Server Directive and Imports

```typescript
'use server'

import { prisma } from '#app/lib/db.server'
// Optional: import { requireUserId } from '#app/lib/auth.server' for auth
```

### Step 3: Define Return Type

```typescript
type GameSessionWithRelations = Awaited<
	ReturnType<
		typeof prisma.gameSession.findMany<{
			orderBy: { gameDatetime: 'desc' }
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
	>
>[number]
```

Or use explicit type if preferred.

### Step 4: Implement Server Action

```typescript
export async function getAllGameSessionsAction(): Promise<
	GameSessionWithRelations[]
> {
	try {
		// Optional: Add authentication check
		// await requireUserId()

		const gameSessions = await prisma.gameSession.findMany({
			orderBy: { gameDatetime: 'desc' },
			include: {
				selectedProposition: {
					include: {
						teams: {
							include: {
								players: true,
							},
						},
					},
				},
			},
		})

		return gameSessions
	} catch (error) {
		console.error('Error fetching game sessions:', error)
		throw new Error('Failed to fetch game sessions')
	}
}
```

### Step 5: Export Action

Ensure the action is exported from the file for use in components.

### Step 6: Add Type Exports

If using explicit types, export them for use in components:

```typescript
export type { GameSessionWithRelations }
```

### Step 7: Usage in Components

Example usage in a React Server Component:

```typescript
import { getAllGameSessionsAction } from '#app/lib/actions/game-sessions'

export default async function GamesPage() {
  const gameSessions = await getAllGameSessionsAction()

  return (
    <div>
      {gameSessions.map(session => (
        <div key={session.id}>
          {/* Render game session */}
        </div>
      ))}
    </div>
  )
}
```

### Step 8: Future Enhancements

Consider these improvements for future iterations:

1. **Pagination:** Add skip/take parameters
2. **Filtering:** Add date range or status filters
3. **Caching:** Add Next.js cache configuration
4. **Authorization:** Add role-based access control if needed
5. **Performance:** Monitor query performance and add indexes
