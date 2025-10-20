# Server Actions Plan

## 1. Action Modules

### Core Modules Organization

- **Authentication**: `src/lib/actions/auth.ts`
  - Maps to: users, passwords tables
  - Handles: User registration, login, logout, session management
- **Players**: `src/lib/actions/players.ts`
  - Maps to: players table
  - Handles: CRUD operations for player management
- **Game Sessions**: `src/lib/actions/game-sessions.ts`
  - Maps to: game_sessions, propositions, teams tables
  - Handles: Game creation, player selection, team generation
- **Teams**: `src/lib/actions/teams.ts`
  - Maps to: teams, propositions tables,
  - Handles: Team composition, adjustments, finalization
- **AI Integration**: `src/lib/actions/ai-teams.ts`
  - External: Gemini API
  - Handles: AI-powered team generation logic

## 2. Server Actions

### Authentication Module (`src/lib/actions/auth.ts`)

#### signUpAction

```typescript
async function signUpAction(prevState: unknown, formData: FormData)
```

- **Purpose**: Register new user account
- **Input Parameters**:
  - prevState: unknown (required for Conform)
  - formData: Contains username, password, confirmPassword
- **Validation Schema**:

  ```typescript
  const SignUpSchema = z
  	.object({
  		username: z
  			.string()
  			.min(3, 'Username must be at least 3 characters')
  			.max(50, 'Username must not exceed 50 characters')
  			.regex(
  				/^[a-zA-Z0-9_-]+$/,
  				'Username can only contain letters, numbers, - and _',
  			),
  		password: z.string().min(8, 'Password must be at least 8 characters'),
  		confirmPassword: z.string(),
  	})
  	.transform(async (data, ctx) => {
  		if (intent !== null) return { ...data, user: null }

  		// Check password match
  		if (data.password !== data.confirmPassword) {
  			ctx.addIssue({
  				code: z.ZodIssueCode.custom,
  				message: "Passwords don't match",
  				path: ['confirmPassword'],
  			})
  			return z.NEVER
  		}

  		// Check username uniqueness
  		const existingUser = await prisma.user.findUnique({
  			where: { username: data.username },
  		})

  		if (existingUser) {
  			ctx.addIssue({
  				code: z.ZodIssueCode.custom,
  				message: 'Username already taken',
  				path: ['username'],
  			})
  			return z.NEVER
  		}

  		return data
  	})
  ```

- **Return Type**: `{ result: SubmissionResult } | redirect`
- **Database Operations**:
  - Check username uniqueness
  - Hash password with bcrypt
  - Create user with 'user' role
  - Create password entry
- **Revalidation**: Not needed (redirects on success)
- **Error Handling**: Via parseWithZod and ctx.addIssue

#### loginAction

```typescript
async function loginAction(prevState: unknown, formData: FormData)
```

- **Purpose**: Authenticate user and create session
- **Input Parameters**:
  - prevState: unknown
  - formData: Contains username, password
- **Validation Schema**: As shown in the example
- **Return Type**: `{ result: SubmissionResult } | redirect`
- **Database Operations**: Find user, verify password
- **Revalidation**: Not needed (redirects)
- **Error Handling**: Invalid credentials via ctx.addIssue

#### logoutAction

```typescript
async function logoutAction()
```

- **Purpose**: End user session
- **Input Parameters**: None
- **Validation Schema**: None
- **Return Type**: redirect
- **Database Operations**: None
- **Revalidation**: Not needed
- **Error Handling**: Cookie clearing

### Players Module (`src/lib/actions/players.ts`)

#### createPlayerAction

```typescript
async function createPlayerAction(prevState: unknown, formData: FormData)
```

- **Purpose**: Add new player to roster (Admin only)
- **Input Parameters**:
  - prevState: unknown
  - formData: Contains name, skillTier, positions[]
- **Validation Schema**:

  ```typescript
  const CreatePlayerSchema = z
  	.object({
  		name: z
  			.string()
  			.min(2, 'Name must be at least 2 characters')
  			.max(100, 'Name must not exceed 100 characters'),
  		skillTier: z.enum(['S', 'A', 'B', 'C', 'D']),
  		positions: z
  			.array(z.enum(['PG', 'SG', 'SF', 'PF', 'C']))
  			.min(1, 'At least one position required'),
  	})
  	.transform(async (data, ctx) => {
  		if (intent !== null) return { ...data }

  		// Check admin authorization
  		const user = await getCurrentUser()
  		if (!user || user.role !== 'admin') {
  			ctx.addIssue({
  				code: z.ZodIssueCode.custom,
  				message: 'Unauthorized access',
  			})
  			return z.NEVER
  		}

  		// Check name uniqueness
  		const existingPlayer = await prisma.player.findUnique({
  			where: { name: data.name },
  		})

  		if (existingPlayer) {
  			ctx.addIssue({
  				code: z.ZodIssueCode.custom,
  				message: 'Player name already exists',
  				path: ['name'],
  			})
  			return z.NEVER
  		}

  		return data
  	})
  ```

- **Return Type**: `{ result: SubmissionResult } | redirect`
- **Database Operations**: Create player record
- **Revalidation**: `revalidatePath('/players')` before redirect
- **Error Handling**: Duplicate name, unauthorized via ctx.addIssue

#### updatePlayerAction

```typescript
async function updatePlayerAction(prevState: unknown, formData: FormData)
```

- **Purpose**: Edit existing player details (Admin only)
- **Input Parameters**:
  - prevState: unknown
  - formData: Contains id, name, skillTier, positions[]
- **Validation Schema**:
  ```typescript
  const UpdatePlayerSchema = z
  	.object({
  		id: z.string().uuid('Invalid player ID'),
  		name: z
  			.string()
  			.min(2, 'Name must be at least 2 characters')
  			.max(100, 'Name must not exceed 100 characters'),
  		skillTier: z.enum(['S', 'A', 'B', 'C', 'D']),
  		positions: z
  			.array(z.enum(['PG', 'SG', 'SF', 'PF', 'C']))
  			.min(1, 'At least one position required'),
  	})
  	.transform(async (data, ctx) => {
  		// Admin check
  		// Player exists check
  		// Name uniqueness check (excluding current player)
  	})
  ```
- **Return Type**: `{ result: SubmissionResult } | redirect`
- **Database Operations**: Update player record
- **Revalidation**: `revalidatePath('/players')` before redirect
- **Error Handling**: Via ctx.addIssue

#### deletePlayerAction

```typescript
async function deletePlayerAction(prevState: unknown, formData: FormData)
```

- **Purpose**: Remove player from roster (Admin only)
- **Input Parameters**:
  - prevState: unknown
  - formData: Contains playerId
- **Validation Schema**:
  ```typescript
  const DeletePlayerSchema = z
  	.object({
  		playerId: z.string().uuid('Invalid player ID'),
  	})
  	.transform(async (data, ctx) => {
  		// Admin authorization check
  		// Player exists check
  	})
  ```
- **Return Type**: `{ result: SubmissionResult } | redirect`
- **Database Operations**: Delete player (cascade to team relationships)
- **Revalidation**: `revalidatePath('/players')` before redirect
- **Error Handling**: Via ctx.addIssue

### Game Sessions Module (`src/lib/actions/game-sessions.ts`)

#### getAllGameSessionsAction

```typescript
async function getAllGameSessionsAction()
```

- **Purpose**: Retrieve all game sessions from database
- **Input Parameters**: None
- **Validation Schema**: None (read-only operation)
- **Return Type**: `GameSession[]`
- **Database Operations**:
  ```typescript
  const gameSessions = await prisma.gameSession.findMany({
    orderBy: { gameDatetime: 'desc' },
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
  })
  ```
- **Revalidation**: Not needed (read operation)
- **Error Handling**: Try-catch with error logging

#### createGameSessionAction

```typescript
async function createGameSessionAction(prevState: unknown, formData: FormData)
```

- **Purpose**: Create new game for specific date (Admin only)
- **Input Parameters**:
  - prevState: unknown
  - formData: Contains gameDatetime, description
- **Validation Schema**:
  ```typescript
  const CreateGameSessionSchema = z
  	.object({
  		gameDatetime: z.string().datetime('Invalid datetime format'),
  		description: z.string().max(500).optional(),
  	})
  	.transform(async (data, ctx) => {
  		// Admin authorization check
  		// Future date validation
  	})
  ```
- **Return Type**: `{ result: SubmissionResult } | redirect`
- **Database Operations**: Create game_session record
- **Revalidation**: `revalidatePath('/games')` before redirect
- **Error Handling**: Via ctx.addIssue

#### selectAvailablePlayersAction

```typescript
async function selectAvailablePlayersAction(
	prevState: unknown,
	formData: FormData,
)
```

- **Purpose**: Select players available for game (Admin only)
- **Input Parameters**:
  - prevState: unknown
  - formData: Contains gameSessionId, playerIds[]
- **Validation Schema**:
  ```typescript
  const SelectPlayersSchema = z
  	.object({
  		gameSessionId: z.string().uuid(),
  		playerIds: z.array(z.string().uuid()),
  	})
  	.transform(async (data, ctx) => {
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
  		// Admin check
  		// Session exists check
  	})
  ```
- **Return Type**: `{ result: SubmissionResult } | redirect`
- **Database Operations**: Store selected players temporarily
- **Revalidation**: `revalidatePath('/games/[id]')` before redirect
- **Error Handling**: Via ctx.addIssue

#### recordGameResultAction

```typescript
async function recordGameResultAction(prevState: unknown, formData: FormData)
```

- **Purpose**: Record game scores (Admin only)
- **Input Parameters**:
  - prevState: unknown
  - formData: Contains gameSessionId, games
- **Validation Schema**:
  ```typescript
  const GameResultSchema = z
  	.object({
  		gameSessionId: z.string().uuid(),
  		games: Array<Array<{ score: number; teamId: string }>>,
  	})
  	.transform(async (data, ctx) => {
  		// Admin check
  		// Session exists check
  		// Teams belong to session check
  	})
  ```
- **Return Type**: `{ result: SubmissionResult } | redirect`
- **Database Operations**: Append to games JSONB array
- **Revalidation**: `revalidatePath('/games/[id]')` before redirect
- **Error Handling**: Via ctx.addIssue

### Teams Module (`src/lib/actions/teams.ts`)

#### generateTeamPropositionsAction

```typescript
async function generateTeamPropositionsAction(
	prevState: unknown,
	formData: FormData,
)
```

- **Purpose**: Generate AI team propositions (Admin only)
- **Input Parameters**:
  - prevState: unknown
  - formData: Contains gameSessionId, playerIds[]
- **Validation Schema**:
  ```typescript
  const GeneratePropositionsSchema = z
  	.object({
  		gameSessionId: z.string().uuid(),
  		playerIds: z.array(z.string().uuid()),
  	})
  	.transform(async (data, ctx) => {
  		if (data.playerIds.length < 10) {
  			ctx.addIssue({
  				code: z.ZodIssueCode.custom,
  				message: 'Minimum 10 players required',
  				path: ['playerIds'],
  			})
  			return z.NEVER
  		}
  		// Admin check
  		// Fetch player details for AI processing
  		const players = await prisma.player.findMany({
  			where: { id: { in: data.playerIds } },
  		})
  		return { ...data, players }
  	})
  ```
- **Return Type**: `{ result: SubmissionResult } | redirect`
- **Database Operations**:
  - Call AI service with player data
  - Create 3 propositions (position_focused, skill_balanced, general)
  - Create teams for each proposition
  - Link players to teams
- **Revalidation**: `revalidatePath('/games/[id]/propositions')` before redirect
- **Error Handling**: AI API

#### swapPlayersAction

```typescript
async function swapPlayersAction(prevState: unknown, formData: FormData)
```

- **Purpose**: Manually swap players between teams (Admin only)
- **Input Parameters**:
  - prevState: unknown
  - formData: Contains propositionId, player1Id, team1Id, player2Id, team2Id
- **Validation Schema**:
  ```typescript
  const SwapPlayersSchema = z
  	.object({
  		propositionId: z.string().uuid(),
  		player1Id: z.string().uuid(),
  		team1Id: z.string().uuid(),
  		player2Id: z.string().uuid(),
  		team2Id: z.string().uuid(),
  	})
  	.transform(async (data, ctx) => {
  		// Admin check
  		// Validate players are in correct teams
  		// Ensure teams are from same proposition
  	})
  ```
- **Return Type**: `{ result: SubmissionResult }`
- **Database Operations**: Update team-player relationships
- **Revalidation**: `revalidatePath('/games/[id]/propositions')`
- **Error Handling**: Via ctx.addIssue

#### selectPropositionAction

```typescript
async function selectPropositionAction(prevState: unknown, formData: FormData)
```

- **Purpose**: Confirm final team selection (Admin only)
- **Input Parameters**:
  - prevState: unknown
  - formData: Contains gameSessionId, propositionId
- **Validation Schema**:
  ```typescript
  const SelectPropositionSchema = z
  	.object({
  		gameSessionId: z.string().uuid(),
  		propositionId: z.string().uuid(),
  	})
  	.transform(async (data, ctx) => {
  		// Admin check
  		// Proposition belongs to session check
  		// Not already selected check
  	})
  ```
- **Return Type**: `{ result: SubmissionResult } | redirect`
- **Database Operations**: Update game_session.selected_proposition_id
- **Revalidation**: `revalidatePath('/games/[id]')` before redirect
- **Error Handling**: Via ctx.addIssue

## 3. Authentication and Authorization

### JWT Implementation

```typescript
// Helper function used across actions
async function getCurrentUser(): Promise<User | null> {
	const cookieStore = await cookies()
	const token = cookieStore.get('bts-session')

	if (!token) return null

	try {
		const payload = jwt.verify(token.value, env.JWT_SECRET)
		const user = await prisma.user.findUnique({
			where: { id: payload.userId },
		})
		return user
	} catch {
		return null
	}
}
```

### Authorization Pattern

All admin-only actions include validation in transform:

```typescript
.transform(async (data, ctx) => {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Unauthorized access"
    })
    return z.NEVER
  }
  // Continue with other validations
})
```

## 4. Validation and Business Logic

### Core Validation Schemas

```typescript
// Base schemas in src/lib/validations/[module].ts
export const LoginSchema = z.object({
	username: z.string().min(1, 'Username is required'),
	password: z.string().min(1, 'Password is required'),
})

export const SignUpSchema = z.object({
	username: z
		.string()
		.min(3, 'Username must be at least 3 characters')
		.max(50, 'Username must not exceed 50 characters')
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			'Username can only contain letters, numbers, - and _',
		),
	password: z.string().min(8, 'Password must be at least 8 characters'),
	confirmPassword: z.string(),
})

export const CreatePlayerSchema = z.object({
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(100, 'Name must not exceed 100 characters'),
	skillTier: z.enum(['S', 'A', 'B', 'C', 'D']),
	positions: z
		.array(z.enum(['PG', 'SG', 'SF', 'PF', 'C']))
		.min(1, 'At least one position required'),
})

export const UpdatePlayerSchema = z.object({
	id: z.string().uuid('Invalid player ID'),
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(100, 'Name must not exceed 100 characters'),
	skillTier: z.enum(['S', 'A', 'B', 'C', 'D']),
	positions: z
		.array(z.enum(['PG', 'SG', 'SF', 'PF', 'C']))
		.min(1, 'At least one position required'),
})

export const DeletePlayerSchema = z.object({
	playerId: z.string().uuid('Invalid player ID'),
})

export const CreateGameSessionSchema = z.object({
	gameDatetime: z.string().datetime('Invalid datetime format'),
	description: z.string().max(500).optional(),
})

export const SelectPlayersSchema = z.object({
	gameSessionId: z.string().uuid(),
	playerIds: z.array(z.string().uuid()),
})

export const GameResultSchema = z.object({
	gameSessionId: z.string().uuid(),
	team1Id: z.string().uuid(),
	team1Score: z.coerce.number().min(0).max(200),
	team2Id: z.string().uuid(),
	team2Score: z.coerce.number().min(0).max(200),
})

export const GeneratePropositionsSchema = z.object({
	gameSessionId: z.string().uuid(),
	playerIds: z.array(z.string().uuid()),
})

export const SwapPlayersSchema = z.object({
	propositionId: z.string().uuid(),
	player1Id: z.string().uuid(),
	team1Id: z.string().uuid(),
	player2Id: z.string().uuid(),
	team2Id: z.string().uuid(),
})

export const SelectPropositionSchema = z.object({
	gameSessionId: z.string().uuid(),
	propositionId: z.string().uuid(),
})

// Reusable field schemas
export const skillTierSchema = z.enum(['S', 'A', 'B', 'C', 'D'])
export const positionSchema = z.enum(['PG', 'SG', 'SF', 'PF', 'C'])
export const uuidSchema = z.string().uuid()
```

### Business Logic Implementation

#### Team Balance Algorithm

```typescript
// In AI service
function distributePlayersToTeams(playerCount: number): [number, number] {
	const half = Math.floor(playerCount / 2)
	const remainder = playerCount % 2
	return [half + remainder, half]
}
```

#### parseWithZod Error Pattern

```typescript
const submission = await parseWithZod(formData, {
	schema: (intent) =>
		Schema.transform(async (data, ctx) => {
			if (intent !== null) return data

			// Perform async validations
			// Use ctx.addIssue for errors
			// Return z.NEVER on validation failure
			// Return validated data on success
		}),
	async: true,
})

if (submission.status !== 'success') {
	return { result: submission.reply({ hideFields: ['password'] }) }
}

// Perform database operations
// Call revalidatePath if needed
// redirect() on success
```

## 5. Type Safety

### Shared Types (`src/lib/db.server.ts`)

```typescript
// Auto-generated from Prisma
export type {
	User,
	Player,
	Team,
	GameSession,
	Proposition,
} from '@prisma/client'

// Conform-specific types
export type FormResult = {
	result: SubmissionResult<any>
}

// Helper types for AI integration
export interface PlayerWithStats extends Player {
	gamesPlayed?: number
	winRate?: number
}

export interface TeamComposition {
	players: Player[]
	averageSkillTier: number
	positionCoverage: string[]
}

export interface AIProposition {
	type: 'position_focused' | 'skill_balanced' | 'general'
	teams: [TeamComposition, TeamComposition]
}

// Environment variables type
export interface Env {
	JWT_SECRET: string
	GEMINI_API_KEY: string
	DATABASE_URL: string
	NODE_ENV: 'development' | 'production' | 'test'
}
```

### Client-Server Integration

- Conform handles client-side form state and validation
- Server actions return `{ result: SubmissionResult }` for form errors
- Successful operations use `redirect()` to navigate or return a data to display
- `revalidatePath()` called before redirects to update cached data
- All async validations happen in Zod transforms with `ctx.addIssue()`
