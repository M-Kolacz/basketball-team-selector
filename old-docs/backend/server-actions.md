<!-- Claude session: https://claude.ai/share/b1c8e0ee-bd86-4bb5-9446-0cc987bb83f3 -->

# Server Actions Plan

## 1. Resources

- **Users** → `users` table
- **Players** → `players` table
- **Game Sessions** → `game_sessions` table
- **Propositions** → `propositions` table
- **Teams** → `teams` table (managed through propositions)
- **Authentication** → `users` + `passwords` tables

## 2. Server Actions

### Authentication

#### `loginUser(_prevState, formData)`

- **Location:** `src/actions/auth.ts`
- **Description:** Authenticate user and create session
- **Parameters:**
  - `_prevState: unknown` - Previous state (required by server action signature)
  - `formData: FormData` - Form data containing login credentials
- **FormData Fields:**
  - `username: string`
  - `password: string`
- **Return Type:**

```typescript
{
  success: true;
  user: {
    id: string;
    username: string;
    role: "admin" | "user";
  };
} | {
  success: false;
  error: string;
}
```

- **Implementation:** Sets JWT token in cookie on success
- **Errors:**
  - Invalid credentials
  - Missing required fields

#### `logoutUser(_prevState, formData)`

- **Location:** `src/actions/auth.ts`
- **Description:** Terminate user session - remove cookie
- **Parameters:**
  - `_prevState: unknown` - Previous state (required by server action signature)
  - `formData: FormData` - Form data (may be empty)
- **Return Type:** `{ success: true } | { success: false; error: string }`
- **Errors:** Not authenticated

#### `registerUser(_prevState, formData)`

- **Location:** `src/actions/auth.ts`
- **Description:** Register new user account (public action)
- **Parameters:**
  - `_prevState: unknown` - Previous state (required by server action signature)
  - `formData: FormData` - Form data containing registration details
- **FormData Fields:**
  - `username: string` // max 50 chars
  - `password: string` // min 8 chars
  - `confirmPassword: string` // must match password
- **Return Type:**

```typescript
{
  success: true;
  user: {
    id: string;
    username: string;
    role: "user";
  };
} | {
  success: false;
  error: string;
  fieldErrors?: {
    username?: string;
    password?: string;
    confirmPassword?: string;
  };
}
```

- **Implementation:** Creates user, sets JWT token in cookie on success
- **Errors:**
  - Username already exists
  - Validation errors (password mismatch, invalid format, missing fields)

### Users

#### `getUsers(_prevState, formData)`

- **Location:** `src/actions/users.ts`
- **Description:** List all users (admin only)
- **Parameters:**
  - `_prevState: unknown` - Previous state (required by server action signature)
  - `formData: FormData` - Form data (may be empty)
- **FormData Fields:**

- **Return Type:**

```typescript
{
  success: true;
  users: Array<{
    id: string;
    username: string;
    role: "admin" | "user";
    created_at: Date;
    updated_at: Date;
  }>;

} | {
  success: false;
  error: string;
}
```

- **Auth Check:** Requires admin role
- **Errors:** Insufficient permissions

#### `createUser(_prevState, formData)`

- **Location:** `src/actions/users.ts`
- **Description:** Create new user (admin only)
- **Parameters:**
  - `_prevState: unknown` - Previous state (required by server action signature)
  - `formData: FormData` - Form data containing user details
- **FormData Fields:**
  - `username: string` // max 50 chars
  - `password: string` // min 8 chars
  - `role: 'admin' | 'user'`
- **Return Type:**

```typescript
{
  success: true;
  user: {
    id: string;
    username: string;
    role: "admin" | "user";
    created_at: Date;
  };
} | {
  success: false;
  error: string;
  fieldErrors?: Record<string, string>;
}
```

- **Auth Check:** Requires admin role
- **Errors:**
  - Insufficient permissions
  - Username already exists
  - Validation errors

### Players

#### `getPlayers()`

- **Location:** `src/actions/players.ts`
- **Description:** List all players (skill_tier and positions hidden for
  non-admins)
- **Parameters:** None (standard getter, doesn't follow form action signature)
- **Return Type (Admin):**

```typescript
{
	success: true
	players: Array<{
		id: string
		name: string
		skill_tier: 'S' | 'A' | 'B' | 'C' | 'D'
		positions: Array<'PG' | 'SG' | 'SF' | 'PF' | 'C'>
		created_at: Date
		updated_at: Date
	}>
}
```

- **Return Type (User):**

```typescript
{
	success: true
	players: Array<{
		id: string
		name: string
		created_at: Date
	}>
}
```

- **Auth Check:** Fields filtered based on user role

#### `createPlayer(_prevState, formData)`

- **Location:** `src/actions/players.ts`
- **Description:** Create new player (admin only)
- **Parameters:**
  - `_prevState: unknown` - Previous state (required by server action signature)
  - `formData: FormData` - Form data containing player details
- **FormData Fields:**
  - `name: string` // max 100 chars
  - `skillTier: 'S' | 'A' | 'B' | 'C' | 'D'`
  - `positions: Array<'PG' | 'SG' | 'SF' | 'PF' | 'C'>`
- **Return Type:**

```typescript
{
  success: true;
  player: {
    id: string;
    name: string;
    skill_tier: string;
    positions: string[];
    created_at: Date;
  };
} | {
  success: false;
  error: string;
}
```

- **Auth Check:** Requires admin role
- **Errors:**
  - Insufficient permissions
  - Player name already exists
  - Invalid skill tier or positions

#### `updatePlayer(_prevState, formData)`

- **Location:** `src/actions/players.ts`
- **Description:** Update player information (admin only)
- **Parameters:**
  - `_prevState: unknown` - Previous state (required by server action signature)
  - `formData: FormData` - Form data containing player updates
- **FormData Fields:**
  - `id: string` (required)
  - `name?: string`
  - `skillTier?: "S" | "A" | "B" | "C" | "D"`
  - `positions?: Array<"PG" | "SG" | "SF" | "PF" | "C">`
- **Return Type:**
  `{ success: true; player: Player } | { success: false; error: string }`
- **Auth Check:** Requires admin role
- **Errors:**
  - Insufficient permissions
  - Player not found
  - Name already taken

#### `deletePlayer(_prevState, formData)`

- **Location:** `src/actions/players.ts`
- **Description:** Delete player (admin only)
- **Parameters:**
  - `_prevState: unknown` - Previous state (required by server action signature)
  - `formData: FormData` - Form data containing player ID
- **FormData Fields:** `id: string` (player ID to delete)
- **Return Type:** `{ success: true } | { success: false; error: string }`
- **Auth Check:** Requires admin role
- **Errors:**
  - Insufficient permissions
  - Player not found

### Game Sessions

#### `getGameSessions(options?)`

- **Location:** `src/actions/game-sessions.ts`
- **Description:** List game sessions with filtering
- **Parameters:**

```typescript
options?: {
  page?: number;        // default: 1
  limit?: number;       // default: 20
  from_date?: Date;
  to_date?: Date;
  has_results?: boolean;
}
```

- **Return Type:**

```typescript
{
  success: true;
  gameSessions: Array<{
    id: string;
    game_datetime: Date;
    description: string | null;
    selected_proposition_id: string | null;
    games: Array<Array<{ score: number; teamId: string }>>;
    created_at: Date;
  }>;
  pagination: {...};
}
```

#### `createGameSession(_prevState, formData)`

- **Location:** `src/actions/game-sessions.ts`
- **Description:** Create new game session (admin only)
- **Parameters:**
  - `_prevState: unknown` - Previous state (required by server action signature)
  - `formData: FormData` - Form data containing game session details
- **FormData Fields:**
  - `gameDateTime: Date`
  - `description?: string`
- **Return Type:**
  `{ success: true; gameSession: GameSession } | { success: false; error: string }`
- **Auth Check:** Requires admin role
- **Errors:**
  - Insufficient permissions
  - Game already exists on this date
  - Invalid datetime

#### `getGameSessionById(id)`

- **Location:** `src/actions/game-sessions.ts`
- **Description:** Get detailed game session information
- **Parameters:** `id: string`
- **Return Type:**

```typescript
{
  success: true;
  gameSession: {
    id: string;
    game_datetime: Date;
    description: string | null;
    selected_proposition_id: string | null;
    games: Array<Array<{ score: number; teamId: string }>>;
    available_players: string[];
    propositions: Proposition[];
    created_at: Date;
    updated_at: Date;
  };
} | {
  success: false;
  error: string;
}
```

- **Errors:** Game session not found

#### `setAvailablePlayers(_prevState, formData)`

- **Location:** `src/actions/game-sessions.ts`
- **Description:** Set available players for game session (admin only)
- **Parameters:**
  - `_prevState: unknown` - Previous state (required by server action signature)
  - `formData: FormData` - Form data containing session and player IDs
- **FormData Fields:**
  - `sessionId: string`
  - `playerIds: string[]`
- **Return Type:** `{ success: true } | { success: false; error: string }`
- **Auth Check:** Requires admin role
- **Errors:**
  - Insufficient permissions
  - Game session not found
  - Less than 10 players selected

#### `generatePropositions(_prevState, formData)`

- **Location:** `src/actions/game-sessions.ts`
- **Description:** Generate AI team propositions (admin only)
- **Parameters:**
  - `_prevState: unknown` - Previous state (required by server action signature)
  - `formData: FormData` - Form data containing session details
- **FormData Fields:**
  - `sessionId: string`
  - `regenerate?: boolean` // default: false
- **Return Type:**

```typescript
{
  success: true;
  propositions: Array<{
    id: string;
    type: "position_focused" | "skill_balanced" | "general";
    teams: Array<{
      id: string;
      players: Player[];
    }>;
  }>;
} | {
  success: false;
  error: string;
}
```

- **Auth Check:** Requires admin role
- **Errors:**
  - Insufficient permissions
  - Game session not found
  - Insufficient available players
  - AI service error

#### `selectProposition(_prevState, formData)`

- **Location:** `src/actions/game-sessions.ts`
- **Description:** Select final team proposition (admin only)
- **Parameters:**
  - `_prevState: unknown` - Previous state (required by server action signature)
  - `formData: FormData` - Form data containing IDs
- **FormData Fields:**
  - `sessionId: string`
  - `propositionId: string`
- **Return Type:** `{ success: true } | { success: false; error: string }`
- **Auth Check:** Requires admin role
- **Errors:**
  - Insufficient permissions
  - Game session or proposition not found
  - Proposition already selected

#### `recordGameResults(_prevState, formData)`

- **Location:** `src/actions/game-sessions.ts`
- **Description:** Record game results (admin only)
- **Parameters:**
  - `_prevState: unknown` - Previous state (required by server action signature)
  - `formData: FormData` - Form data containing game results
- **FormData Fields:**
  - `sessionId: string`
  - `games: Array<Array<{ score: number; teamId: string }>>`
- **Return Type:** `{ success: true } | { success: false; error: string }`
- **Auth Check:** Requires admin role
- **Errors:**
  - Insufficient permissions
  - Game session not found
  - Invalid team IDs or score format

### Propositions

#### `getPropositionById(id)`

- **Location:** `src/actions/propositions.ts`
- **Description:** Get specific proposition details
- **Parameters:** `id: string`
- **Return Type:**

```typescript
{
  success: true;
  proposition: {
    id: string;
    game_session_id: string;
    type: "position_focused" | "skill_balanced" | "general";
    teams: Array<{
      id: string;
      players: Array<{
        id: string;
        name: string;
        skill_tier: "S" | "A" | "B" | "C" | "D";
        positions: Array<"PG" | "SG" | "SF" | "PF" | "C">;
      }>;
    }>;
    created_at: Date;
  };
} | {
  success: false;
  error: string;
}
```

- **Errors:** Proposition not found

#### `updatePropositionTeams(_prevState, formData)`

- **Location:** `src/actions/propositions.ts`
- **Description:** Manually adjust teams in proposition (admin only)
- **Parameters:**
  - `_prevState: unknown` - Previous state (required by server action signature)
  - `formData: FormData` - Form data containing proposition and team updates
- **FormData Fields:**
  - `id: string`
  - `team1PlayerIds: string[]`
  - `team2PlayerIds: string[]`
- **Return Type:**
  `{ success: true; proposition: Proposition } | { success: false; error: string }`
- **Auth Check:** Requires admin role
- **Errors:**
  - Insufficient permissions
  - Proposition not found
  - Invalid player assignments

## 3. Authentication and Authorization

### Authentication Mechanism

- **Type:** JWT (JSON Web Token) based authentication
- **Token Storage:** JWT token in cookie (HttpOnly, Secure, SameSite=Strict)
- **Token Expiration:** 24 hours for standard users, 7 days for admin
- **Implementation:**
  - Generate JWT upon successful login via `loginUser()` or `registerUser()`
  - Include user ID and role in token payload
  - Verify cookie with token at start of each protected server action using
    `verifyAuth()` helper
  - Refresh token not required for MVP

### Authorization Rules

- **Public Actions:** `loginUser()`, `registerUser()`
- **User-level Access (authenticated users):**
  - Read actions for players (limited fields), game sessions, propositions
  - Cannot access skill_tier and positions fields for players
- **Admin-only Access:**
  - All mutation actions (create, update, delete)
  - Full access to all player fields
  - User management actions
  - Team generation and game management

### Implementation Pattern

Each protected server action should:

1. Call `verifyAuth()` helper to get current user from cookie
2. Check user role against required permissions
3. Return `{ success: false; error: string }` if unauthorized
4. Proceed with operation if authorized

```typescript
// Example pattern
export async function createPlayer(
	name: string,
	skillTier: SkillTier,
	positions: Position[],
) {
	'use server'

	const user = await verifyAuth()
	if (!user || user.role !== 'admin') {
		return { success: false, error: 'Insufficient permissions' }
	}

	// Proceed with operation...
}
```

## 4. Validation and Business Logic

### User Validation

- Username: Required, unique, max 50 characters, alphanumeric with underscores
- Password: Required for creation, min 8 characters, at least one uppercase, one
  lowercase, one number
- Confirm Password: Required for registration, must match password field
- Role: Must be either 'admin' or 'user'

### Player Validation

- Name: Required, unique, max 100 characters, no special characters
- Skill Tier: Required, must be one of: S, A, B, C, D
- Positions: Array of valid positions (PG, SG, SF, PF, C), at least one required

### Game Session Validation

- Game datetime: Required, must be future date for creation, unique per date
  (ignore time)
- Description: Optional, max 500 characters
- Available players: Minimum 10 required for team generation
- Selected proposition: Must reference existing proposition for the same game
  session

### Proposition Validation

- Type: Required, must be one of: position_focused, skill_balanced, general
- Teams: Must have equal number of players (±1 for odd totals)
- Players: Cannot be duplicated across teams in same proposition

### Business Logic Implementation

- **Team Generation:**
  - `generatePropositions()` calls AI service with available players
  - Enforces minimum 10 players before processing
  - Generates exactly 3 propositions per request
  - Balances teams based on skill points (S=5, A=4, B=3, C=2, D=1)
- **Role-based Field Filtering:**
  - Each server action checks user role via `verifyAuth()`
  - Removes sensitive fields from return value based on role
  - Applied before returning data to client

- **Duplicate Prevention:**
  - Database unique constraints enforced
  - Server actions perform pre-validation checks with meaningful error messages
  - Game session date uniqueness checked at day level in `createGameSession()`

- **Cascading Operations:**
  - Deleting game session removes all associated propositions (DB constraint)
  - Deleting selected proposition sets game session's selected_proposition_id to
    null
  - User deletion cascades to password record (DB constraint)
