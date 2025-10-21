# View Implementation Plan: Game Details

## 1. Overview

Game Details view displays complete game session info: final team compositions,
game scores, all AI propositions (3), and indicates which was selected. Admin
can record/edit scores (0-200 range). Regular users have read-only access.

## 2. View Routing

**Path**: `/games/[id]` **Dynamic segment**: `id` (game session UUID) **Page
file**: `src/app/games/[id]/page.tsx`

## 3. Component Structure

```
GameDetailsPage (Server Component)
├── GameDetailsHeader
├── GameScoresSection (Client - admin only)
│   └── GameScoreCard[] (multiple game results)
│       └── ScoreInputForm (Conform form)
├── SelectedTeamsSection
│   └── TeamCard[] (2 teams from selected proposition)
│       └── PlayerList
│           └── PlayerBadge[]
└── PropositionsHistorySection
    └── PropositionCard[] (3 propositions)
        ├── PropositionTypeBadge
        ├── TeamPreview[] (2 team previews)
        └── SelectedIndicator (conditional)
```

## 4. Component Details

### GameDetailsPage (Server Component)

- **Description**: Root page component, fetches game session data via server
  action, determines user role, renders layout
- **Main elements**: `<main>` container with responsive grid/flex layout,
  conditional sections based on user role
- **Child components**: GameDetailsHeader, GameScoresSection (admin only),
  SelectedTeamsSection, PropositionsHistorySection
- **Handled events**: None (server component)
- **Validation**: None (delegates to server action)
- **Types**: `GameDetailsViewModel`, `UserRole`
- **Props**: `{ params: { id: string } }` (Next.js page props)

### GameDetailsHeader

- **Description**: Displays game datetime, description, back navigation
- **Main elements**: `<header>`, `<h1>`, `<p>`, Back button (shadcn Button)
- **Child components**: Button (shadcn)
- **Handled events**: Back button click → router.back()
- **Validation**: None
- **Types**: `{ gameDatetime: Date, description: string | null }`
- **Props**: `{ gameDatetime: Date, description: string | null }`

### GameScoresSection (Client, Admin only)

- **Description**: Displays/edits scores for all games played in session. Each
  game has 2 teams with scores.
- **Main elements**: Section heading, grid of GameScoreCard components
- **Child components**: GameScoreCard[]
- **Handled events**: None (delegates to children)
- **Validation**: None (delegates to children)
- **Types**: `GameScoreViewModel[]`, `isEditable: boolean`
- **Props**:
  `{ games: GameScoreViewModel[], gameSessionId: string, isAdmin: boolean }`

### GameScoreCard

- **Description**: Single game result display/edit. Shows Team A vs Team B
  scores. Editable for admin, read-only for users.
- **Main elements**: Card (shadcn), game index, team scores, edit/save buttons
- **Child components**: Card, CardHeader, CardContent, ScoreInputForm
  (conditional)
- **Handled events**: Edit button → toggle edit mode, Save → submit form
- **Validation**: None (delegates to form)
- **Types**: `GameScoreViewModel`, `gameIndex: number`, `gameSessionId: string`
- **Props**:
  `{ game: GameScoreViewModel, gameIndex: number, gameSessionId: string, isAdmin: boolean }`

### ScoreInputForm (Client, Conform)

- **Description**: Form for editing single game scores (Team A & Team B). Uses
  Conform + Zod.
- **Main elements**: `<form>`, 2 Input fields (shadcn), Submit/Cancel buttons
- **Child components**: Form (shadcn Conform wrapper), Input, Button
- **Handled events**: Form submit → call updateGameScoreAction, Cancel → reset
  form
- **Validation**:
  - Both scores required
  - Score range: 0-200 (integer)
  - No negative values
  - Validates via Zod schema before submission
- **Types**: `UpdateGameScoreSchema` (Zod), form state from useForm
- **Props**:
  `{ gameSessionId: string, gameIndex: number, initialScores: { teamAScore: number, teamBScore: number }, onSuccess: () => void, onCancel: () => void }`

### SelectedTeamsSection

- **Description**: Displays 2 final teams from selected proposition. Read-only
  for all users.
- **Main elements**: Section heading "Final Teams", grid/flex layout for 2
  TeamCard components
- **Child components**: TeamCard[] (exactly 2)
- **Handled events**: None
- **Validation**: None
- **Types**: `TeamViewModel[]`
- **Props**: `{ teams: TeamViewModel[] }`

### TeamCard

- **Description**: Single team display with all players. Shows team label (A/B),
  player count.
- **Main elements**: Card (shadcn), CardHeader with team name, CardContent with
  PlayerList
- **Child components**: Card, PlayerList
- **Handled events**: None
- **Validation**: None
- **Types**: `TeamViewModel`, `teamLabel: string`
- **Props**: `{ team: TeamViewModel, teamLabel: 'Team A' | 'Team B' }`

### PlayerList

- **Description**: Grid/list of player badges. Displays name, skill tier,
  positions.
- **Main elements**: Grid container (`grid` or `flex flex-wrap`)
- **Child components**: PlayerBadge[]
- **Handled events**: None
- **Validation**: None
- **Types**: `PlayerViewModel[]`
- **Props**: `{ players: PlayerViewModel[] }`

### PlayerBadge

- **Description**: Single player info badge. Name, skill tier badge, position
  tags.
- **Main elements**: Container div, player name, Badge (shadcn) for skill,
  position tags
- **Child components**: Badge (shadcn)
- **Handled events**: None
- **Validation**: None
- **Types**: `PlayerViewModel`
- **Props**: `{ player: PlayerViewModel }`

### PropositionsHistorySection

- **Description**: Shows all 3 AI-generated propositions with indicator for
  selected one.
- **Main elements**: Section heading "AI Propositions", Accordion (shadcn) or
  grid of PropositionCard
- **Child components**: PropositionCard[] (3 cards)
- **Handled events**: Accordion toggle (if using Accordion)
- **Validation**: None
- **Types**: `PropositionViewModel[]`, `selectedPropositionId: string | null`
- **Props**:
  `{ propositions: PropositionViewModel[], selectedPropositionId: string | null }`

### PropositionCard

- **Description**: Single proposition display. Type badge, team previews (player
  count, avg skill), selected indicator.
- **Main elements**: Card (shadcn), PropositionTypeBadge, 2 TeamPreview
  components, SelectedIndicator
- **Child components**: Card, Badge, TeamPreview[], conditional
  SelectedIndicator (icon/badge)
- **Handled events**: None
- **Validation**: None
- **Types**: `PropositionViewModel`, `isSelected: boolean`
- **Props**: `{ proposition: PropositionViewModel, isSelected: boolean }`

### PropositionTypeBadge

- **Description**: Badge showing proposition type (position_focused,
  skill_balanced, general).
- **Main elements**: Badge (shadcn) with color variant based on type
- **Child components**: Badge
- **Handled events**: None
- **Validation**: None
- **Types**: `PropositionType`
- **Props**: `{ type: PropositionType }`

### TeamPreview

- **Description**: Compact team summary for proposition: player count, avg skill
  tier, position distribution.
- **Main elements**: Container div, player count text, skill indicator, position
  summary
- **Child components**: None (or small Badge components)
- **Handled events**: None
- **Validation**: None
- **Types**: `TeamViewModel`
- **Props**: `{ team: TeamViewModel, teamLabel: 'Team A' | 'Team B' }`

## 5. Types

### GameDetailsViewModel

```typescript
type GameDetailsViewModel = {
	id: string
	gameDatetime: Date
	description: string | null
	games: GameScoreViewModel[]
	selectedProposition: {
		id: string
		type: PropositionType
		teams: TeamViewModel[]
	} | null
	allPropositions: PropositionViewModel[]
}
```

### GameScoreViewModel

```typescript
type GameScoreViewModel = {
	teamAScore: number
	teamBScore: number
	teamAId: string
	teamBId: string
}
```

Extracted from `GameSession.games` JSON array. Each element represents one game
result.

### TeamViewModel

```typescript
type TeamViewModel = {
	id: string
	players: PlayerViewModel[]
}
```

### PlayerViewModel

```typescript
type PlayerViewModel = {
	id: string
	name: string
	skillTier: 'S' | 'A' | 'B' | 'C' | 'D'
	positions: ('PG' | 'SG' | 'SF' | 'PF' | 'C')[]
}
```

### PropositionViewModel

```typescript
type PropositionViewModel = {
	id: string
	type: 'position_focused' | 'skill_balanced' | 'general'
	teams: TeamViewModel[]
}
```

### UpdateGameScoreSchema (Zod)

```typescript
const UpdateGameScoreSchema = z.object({
	gameSessionId: z.string().uuid(),
	gameIndex: z.number().int().min(0),
	teamAScore: z.number().int().min(0).max(200),
	teamBScore: z.number().int().min(0).max(200),
})
```

## 6. State Management

### Server Component State

GameDetailsPage fetches data via `getGameSessionAction(id)` on server. No client
state needed for initial load.

### Client Component State

**GameScoreCard**:

- `isEditing: boolean` - toggles edit mode
- Form state managed by Conform `useForm` hook

**ScoreInputForm**:

- Conform form state: `const [form, fields] = useForm({ ... })`
- Validation via `parseWithZod` on submit
- Optimistic UI updates optional via `useOptimistic`

No custom hooks required. Use standard React hooks (`useState` for edit mode,
Conform's `useForm` for forms).

## 7. Server Action Integration

### getGameSessionAction

**Location**: `src/lib/actions/game-sessions.server.ts` **Input**:
`gameSessionId: string` (UUID) **Return**: `GameSessionWithDetails | null`
**Usage**: Called in GameDetailsPage server component

```typescript
const gameSession = await getGameSessionAction(params.id)
if (!gameSession) notFound()
```

**Error Handling**: Action throws on auth/validation errors. Use try-catch or
let Next.js error boundary handle. If returns `null`, show 404 via `notFound()`.

### updateGameScoreAction (To be created)

**Location**: `src/lib/actions/game-sessions.server.ts` **Input**:

```typescript
{
	gameSessionId: string
	gameIndex: number
	teamAScore: number
	teamBScore: number
}
```

**Return**: `void` or updated `GameSession` **Usage**: Called from
ScoreInputForm on submit

```typescript
const formData = new FormData(event.target)
await updateGameScoreAction(formData)
```

**Validation**:

- Admin role required (`requireAdminUser()`)
- Validate gameSessionId (UUID), gameIndex (int ≥ 0), scores (0-200)
- Verify gameIndex exists in `games` array
- Update `games[gameIndex]` JSON in database

**Error Handling**: Form displays errors via Conform. Server action throws
descriptive errors (caught by Conform error handling).

### getCurrentUser (existing)

**Location**: `src/lib/auth.server.ts` **Input**: None **Return**: `User | null`
**Usage**: Determine if user is admin to show GameScoresSection

```typescript
const currentUser = await getCurrentUser()
const isAdmin = currentUser?.role === 'admin'
```

## 8. User Interactions

### View Game Details (All Users)

1. Click game row in history → navigate to `/games/[id]`
2. Page loads, displays datetime, description, final teams, propositions
3. Selected proposition highlighted in propositions section

### Edit Game Scores (Admin Only)

1. Click "Edit" button on GameScoreCard
2. Input fields appear with current scores
3. Modify teamA/teamB scores (0-200)
4. Click "Save" → form validates, submits to `updateGameScoreAction`
5. On success: scores update, exit edit mode, show toast
6. On error: display field errors below inputs
7. Click "Cancel" → discard changes, exit edit mode

### View Propositions (All Users)

1. Scroll to "AI Propositions" section
2. See 3 proposition cards with type badges
3. Selected proposition shows checkmark/badge
4. Each card shows team previews (player count, skill distribution)

### Navigate Back

1. Click back button in header
2. Router navigates to `/games` (history list)

## 9. Conditions and Validation

### User Role Conditions

- **Admin**: Shows GameScoresSection with edit capability
- **Regular User**: Hides GameScoresSection or shows read-only scores
- **Check**: `currentUser?.role === 'admin'` in server component

### Data Existence Conditions

- **No selected proposition**: Show message "No teams finalized yet" instead of
  SelectedTeamsSection
- **Empty propositions**: Show message "No AI propositions generated"
- **Check**: `gameSession.selectedProposition !== null`,
  `propositions.length > 0`

### Score Validation (ScoreInputForm)

- **Required**: Both teamAScore and teamBScore must be provided
- **Range**: 0 ≤ score ≤ 200
- **Type**: Integer only (no decimals)
- **Schema**: Defined in `UpdateGameScoreSchema` (Zod)
- **Client-side**: Conform validates on blur/submit
- **Server-side**: Action validates via `parseWithZod` before DB update

### Game Index Validation (Server Action)

- **Exists**: `gameIndex` must be valid index in `games` array
- **Check**: `gameIndex >= 0 && gameIndex < games.length`
- **Error**: Throw "Invalid game index" if out of bounds

## 10. Error Handling

### Not Found (404)

- **Scenario**: Invalid game session ID or doesn't exist
- **Handling**: `getGameSessionAction` returns `null` → call `notFound()` in
  page
- **UI**: Next.js shows 404 page

### Unauthorized (401/403)

- **Scenario**: User not logged in or non-admin tries to edit scores
- **Handling**: Server action throws, Next.js redirects to login (handled by
  `requireAdminUser`)
- **UI**: Redirect or error toast

### Validation Errors (ScoreInputForm)

- **Scenario**: Invalid score input (negative, > 200, non-integer)
- **Handling**: Conform displays field errors from Zod schema
- **UI**: Red text below input field with error message

### Server Errors (500)

- **Scenario**: Database failure, network error
- **Handling**: Try-catch in server action, log error, throw generic message
- **UI**: Error boundary or toast notification "Failed to update scores"

### Empty Data States

- **No selected proposition**: Show Empty component with message
- **No propositions**: Show Empty component "No propositions generated"
- **No games/scores**: Hide GameScoresSection or show "No games recorded"

## 11. Implementation Steps

1. **Create route structure**
   - Create `src/app/games/[id]/page.tsx`
   - Add dynamic route parameter type

2. **Implement server page component**
   - Call `getGameSessionAction(params.id)`
   - Handle null response with `notFound()`
   - Get current user via `getCurrentUser()`
   - Determine `isAdmin` flag

3. **Create transform utility**
   - File: `src/app/games/[id]/utils/transform.ts`
   - Function:
     `transformToGameDetailsViewModel(session: GameSessionWithDetails): GameDetailsViewModel`
   - Parse `games` JSON to `GameScoreViewModel[]`
   - Extract selected proposition and all propositions

4. **Implement GameDetailsHeader component**
   - Client component (needs router for back button)
   - Format date with `date-fns`
   - Add back navigation

5. **Implement SelectedTeamsSection**
   - Conditional render based on `selectedProposition !== null`
   - Create TeamCard component
   - Create PlayerList and PlayerBadge components

6. **Implement PropositionsHistorySection**
   - Create PropositionCard component
   - Create PropositionTypeBadge with color mapping
   - Create TeamPreview with aggregated stats
   - Add SelectedIndicator (checkmark icon or badge)

7. **Create updateGameScoreAction**
   - File: `src/lib/actions/game-sessions.server.ts`
   - Validate with `UpdateGameScoreSchema`
   - Require admin via `requireAdminUser()`
   - Fetch game session, update `games[gameIndex]`
   - Use Prisma `update` with JSON manipulation
   - Handle errors (invalid index, DB errors)

8. **Implement GameScoresSection (admin only)**
   - Conditional render based on `isAdmin`
   - Create GameScoreCard component
   - Add edit mode toggle state

9. **Implement ScoreInputForm**
   - Use Conform with `useForm` hook
   - Create Zod schema `UpdateGameScoreSchema`
   - Add Input components for teamA/teamB scores
   - Handle submit with `updateGameScoreAction`
   - Show success toast with `sonner`
   - Handle errors via Conform field errors

10. **Add TypeScript types**
    - Create all ViewModel types in transform file or separate types file
    - Export for use in components

11. **Style components**
    - Use shadcn Card, Badge, Button, Input components
    - Responsive grid layouts (grid-cols-1 md:grid-cols-2)
    - Consistent spacing with Tailwind

12. **Add loading/error states**
    - Create `loading.tsx` for Suspense fallback
    - Create `error.tsx` for error boundary
    - Use Skeleton components in loading state
