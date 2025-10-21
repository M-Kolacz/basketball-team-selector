# View Implementation Plan: Game History

## 1. Overview

Game History view displays all past basketball games in descending order by
date. Shows date, team compositions, and scores for completed games. Clicking a
game row navigates to detailed game view. Accessible to all authenticated users
(admin/user roles).

## 2. View Routing

- **Path**: `/games`
- **File**: `src/app/games/page.tsx` (already exists, needs implementation)
- **Access**: Authenticated users (handled by server action redirect)

## 3. Component Structure

```
GamesPage (Server Component)
└── GameHistoryList (Client Component)
    └── Table (Shadcn UI)
        ├── TableHeader
        │   └── TableRow
        │       ├── TableHead (Date)
        │       ├── TableHead (Games Count)
        │       └── TableHead (Summary)
        └── TableBody
            └── GameHistoryRow[] (Client Component)
                └── TableRow (clickable)
                    ├── TableCell (formatted datetime)
                    ├── TableCell (number of games)
                    └── TableCell (games summary with scores)
```

Please to remember to maximize usage of Shadcn UI components. All components are
avaiable at @src/components/ui/\*.

## 4. Component Details

### GamesPage (Server Component)

- **Description**: Root page component, fetches data via server action, passes
  to client component
- **Main elements**:
  - `<main>` container
  - `GameHistoryList` client component
- **Handled events**: None (server component)
- **Validation**: None required at this level
- **Types**: `GameSessionWithRelations[]` from server action
- **Props**: None (root page)

### GameHistoryList (Client Component)

- **Description**: Container for game history table, handles empty state,
  renders responsive table
- **Main elements**:
  - Header section with title and description
  - `Empty` component (Shadcn UI) when no games
  - `Table` component with header and body
- **Handled events**: None directly
- **Validation**: Check if games array is empty
- **Types**: `GameHistoryViewModel[]`
- **Props**:
  ```typescript
  interface GameHistoryListProps {
  	games: GameHistoryViewModel[]
  }
  ```

### GameHistoryRow (Client Component)

- **Description**: Single clickable table row displaying game session
  information
- **Main elements**:
  - `TableRow` (with hover and click states)
  - `TableCell` for date (formatted with `format` from `date-fns`)
  - `TableCell` for games count (e.g., "3 games played")
  - `TableCell` for summary (e.g., "Game 1: TeamA (15) vs TeamB (10), Game 2:
    TeamC (12) vs TeamD (11)")
- **Handled events**:
  - `onClick`: Navigate to `/games/{gameId}` using `useRouter` from
    `next/navigation`
- **Validation**:
  - Check `selectedProposition` exists before rendering games
  - Handle empty games array
  - Handle games with incomplete teams/scores
- **Types**: `GameHistoryViewModel`
- **Props**:
  ```typescript
  interface GameHistoryRowProps {
  	game: GameHistoryViewModel
  }
  ```

## 5. Types

### GameHistoryViewModel

Transform `GameSessionWithRelations` from server action into view-optimized
structure:

```typescript
export type GameWithTeams = {
	teams: Array<{
		teamId: string
		playerNames: string[]
		score: number | null
	}>
}

export type GameHistoryViewModel = {
	id: string
	gameDatetime: Date
	description: string | null
	games: GameWithTeams[] // Array of games played in this session
	hasSelectedProposition: boolean
}
```

**Field breakdown**:

- `id`: GameSession UUID for navigation
- `gameDatetime`: Date object for formatting
- `description`: Optional game description
- `games`: Array of games, each containing teams array with teamId, playerNames,
  and score
- `hasSelectedProposition`: Boolean flag if selectedProposition exists

**games JSONB structure**:

```typescript
// Expected format in database
;[
	[
		{ score: 15, teamId: 'uuid-1' },
		{ score: 10, teamId: 'uuid-2' },
	],
	[
		{ score: 15, teamId: 'uuid-1' },
		{ score: 10, teamId: 'uuid-2' },
	],
]
```

### Transformation Function

```typescript
function transformToViewModel(
	session: GameSessionWithRelations,
): GameHistoryViewModel {
	const hasProposition = session.selectedProposition !== null
	const teamsMap = new Map(
		session.selectedProposition?.teams.map((team) => [
			team.id,
			team.players.map((p) => p.name),
		]) ?? [],
	)

	const gamesArray = Array.isArray(session.games) ? session.games : []

	const games: GameWithTeams[] = gamesArray.map((game) => ({
		teams: (game.teams ?? []).map((teamData) => ({
			teamId: teamData.teamId,
			playerNames: teamsMap.get(teamData.teamId) ?? [],
			score: teamData.score ?? null,
		})),
	}))

	return {
		id: session.id,
		gameDatetime: session.gameDatetime,
		description: session.description,
		games,
		hasSelectedProposition: hasProposition,
	}
}
```

## 6. State Management

No complex state management required. Use simple client component props.

**Local state needed**:

- None for list display
- Router for navigation (via `useRouter` hook from `next/navigation`)

**No custom hook required** - transformation logic can be utility function in
component file or separate utils file.

## 7. Server Action Integration

### getAllGameSessionsAction

**Import**:

```typescript
import { getAllGameSessionsAction } from '#app/lib/actions/game-sessions'
import type { GameSessionWithRelations } from '#app/lib/actions/game-sessions'
```

**Usage in GamesPage**:

```typescript
export default async function GamesPage() {
  const gameSessions = await getAllGameSessionsAction()
  const viewModels = gameSessions.map(transformToViewModel)

  return <GameHistoryList games={viewModels} />
}
```

**Input parameters**: None

**Return type**: `Promise<GameSessionWithRelations[]>`

**Error handling**: Server action throws errors, caught by Next.js error
boundary. No try-catch needed in page component.

## 8. User Interactions

### View Game List

- **Action**: User loads `/games` route
- **Outcome**: Table displays all games sorted by date (descending)
- **Implementation**: Server component fetches data on page load

### Click Game Row

- **Action**: User clicks any table row
- **Outcome**: Navigate to `/games/{gameId}` detail page
- **Implementation**:
  ```typescript
  const router = useRouter()
  const handleRowClick = () => {
  	router.push(`/games/${game.id}`)
  }
  ```
- **Visual feedback**: Row hover state via Shadcn Table styles

### Empty State

- **Action**: No games exist in database
- **Outcome**: Display Empty component with message "No games found"
- **Implementation**: Conditional render based on array length

## 9. Conditions and Validation

### Display Conditions

**GameHistoryList level**:

- If `games.length === 0`: Show Empty component
- If `games.length > 0`: Show Table

**GameHistoryRow level**:

- If `!hasSelectedProposition`: Display "No teams selected" in games count, "—"
  in summary
- If `games.length === 0`: Display "No games recorded"
- Always display date (required field)

**Date formatting**:

- Use absolute datetime format: `"MMM d, yyyy 'at' h:mm a"` (e.g., "Jan 15, 2025
  at 7:30 PM")
- Use `format` from `date-fns` library

**Games summary display**:

- Iterate through games array, for each game:
  - Display "Game N: " prefix
  - For each team in game, show first 3 player names joined by ", "
  - If > 3 players, add "+ X more"
  - Show score in parentheses: "(15)" or "(?)" if null
  - Join teams with " vs "
  - Join multiple games with ", "
- Example: "Game 1: John, Mike, Sarah +2 (15) vs Tom, Alex, Chris +2 (10), Game
  2: ..."
- Truncate entire summary at 100 chars with "..." if too long

## 10. Error Handling

### Server Action Errors

Server action throws errors, handled by Next.js error boundary. Consider adding
`error.tsx` in `/games` directory:

```typescript
'use client'

export default function GamesError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>Failed to load games</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### Edge Cases

**Missing selectedProposition**:

- Display placeholder text in games count/summary cells
- Don't prevent row rendering
- Row still clickable to view details

**Missing team in proposition**:

- If teamId not found in teamsMap, display "Unknown Team"
- Don't crash on missing team data

## 11. Implementation Steps

1. **Create transformation utility** (`src/app/games/utils/transform.ts`)
   - Implement `transformToViewModel` function
   - Add type export for `GameHistoryViewModel`
   - Add helper for team display formatting

2. **Create GameHistoryRow component**
   (`src/app/games/components/GameHistoryRow.tsx`)
   - Implement clickable TableRow
   - Add date formatting with `date-fns`
   - Add games count display (e.g., "3 games")
   - Add games summary generator:
     - Iterate games array
     - For each game, iterate teams
     - Show first 3 players per team + count
     - Format: "Game N: Team1 (score) vs Team2 (score)"
     - Truncate at 100 chars total
   - Add router navigation on click
   - Style: cursor-pointer, hover states

3. **Create GameHistoryList component**
   (`src/app/games/components/GameHistoryList.tsx`)
   - Accept `games` prop
   - Implement empty state check
   - Render Table with headers: Date, Games Count, Summary
   - Map game sessions to GameHistoryRow components
   - Add responsive container classes

4. **Update GamesPage** (`src/app/games/page.tsx`)
   - Remove console.log
   - Add transformation call
   - Pass transformed data to GameHistoryList
   - Add proper layout container

5. **Add date-fns dependency** (if not installed)
   - `npm install date-fns`

6. **Create error boundary** (`src/app/games/error.tsx`)
   - Implement error UI
   - Add reset functionality
