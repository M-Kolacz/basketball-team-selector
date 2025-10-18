# Server Actions Plan

## 1. Overview

This document translates the REST API plan into Next.js Server Actions architecture. Server Actions replace traditional REST endpoints while maintaining the same functionality, validation, and business logic. All actions follow the established pattern using `@conform-to/zod` for validation and return structured responses compatible with Conform.

## 2. Action Organization

Actions are organized by domain in the following structure:

```
src/lib/actions/
├── auth.ts          # Authentication actions
├── users.ts         # User management actions
├── players.ts       # Player management actions
├── game-sessions.ts # Game session actions
└── propositions.ts  # Proposition actions
```

## 3. Common Patterns

### Action Signature

All actions follow this signature pattern:

```typescript
export const actionName = async (
  _prevState: unknown,
  formData: FormData
) => {
  // Implementation
}
```

### Response Format

Actions return Conform submission responses:

```typescript
// Success - redirect happens via redirect() call
redirect('/target-path')

// Validation error
return submission.reply({
  formErrors: ['Error message'],
  fieldErrors: { fieldName: ['Field error'] }
})

// Custom error
return submission.reply({
  formErrors: ['Custom error message']
})
```

### Authentication Check

Protected actions use this helper pattern:

```typescript
const user = await requireUser() // Throws if not authenticated
const admin = await requireAdmin() // Throws if not admin
```

### Query Actions

For read-only operations that need URL params, use separate query functions:

```typescript
export const getPlayers = async (params: GetPlayersParams) => {
  // Implementation - returns data directly
}
```

## 4. Authentication Actions

### loginAction

**File:** `src/lib/actions/auth.ts`

**Corresponds to:** `POST /api/auth/login`

**Purpose:** Authenticate user and create session

**Request Schema:**

```typescript
const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
})
```

**Implementation:**
- Validate credentials using `parseWithZod` with async transform
- Compare hashed password with bcrypt
- Generate JWT token with userId payload
- Set HttpOnly cookie with 7-day expiration
- Redirect to `/games` on success
- Return validation errors on failure

**Success:** Redirect to `/games`

**Errors:**
- Invalid credentials: Add custom issue to context
- Missing fields: Conform validation errors

**Status:** Already implemented ✓

---

### logoutAction

**File:** `src/lib/actions/auth.ts`

**Corresponds to:** `POST /api/auth/logout`

**Purpose:** Terminate user session

**Request Schema:** None (no formData needed)

**Implementation:**
- Delete `bts-session` cookie
- Redirect to `/login`

**Success:** Redirect to `/login`

**Errors:** None (always succeeds)

---

### registerAction

**File:** `src/lib/actions/auth.ts`

**Corresponds to:** `POST /api/auth/register`

**Purpose:** Register new user account

**Request Schema:**

```typescript
const RegisterSchema = z.object({
  username: z.string().max(50),
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})
```

**Implementation:**
- Validate input with password match check
- Check username uniqueness via `superRefine`
- Hash password with bcrypt (cost: 10)
- Create user with role 'user'
- Generate JWT token
- Set HttpOnly cookie with 7-day expiration
- Redirect to `/games`

**Success:** Redirect to `/games`

**Errors:**
- Username exists: Custom issue on username field
- Password mismatch: Refine validation error
- Missing/invalid fields: Conform validation errors

**Status:** Already implemented as `register` ✓

---

## 5. User Management Actions

### getUsersAction

**File:** `src/lib/actions/users.ts`

**Corresponds to:** `GET /api/users`

**Purpose:** List all users (admin only)

**Type:** Query function (not form action)

**Parameters:**

```typescript
type GetUsersParams = {
  page?: number // default: 1
  limit?: number // default: 20
  sort?: 'username' | 'created_at' // default: 'username'
}
```

**Implementation:**
- Require admin authentication
- Calculate skip/take for pagination
- Query users with Prisma orderBy
- Return users array + pagination metadata

**Response:**

```typescript
type GetUsersResponse = {
  users: Array<{
    id: string
    username: string
    role: 'admin' | 'user'
    created_at: Date
    updated_at: Date
  }>
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

**Errors:** Throws if not admin (handled by requireAdmin)

---

### createUserAction

**File:** `src/lib/actions/users.ts`

**Corresponds to:** `POST /api/users`

**Purpose:** Create new user (admin only)

**Request Schema:**

```typescript
const CreateUserSchema = z.object({
  username: z.string().max(50),
  password: z.string().min(8),
  role: z.enum(['admin', 'user']),
})
```

**Implementation:**
- Require admin authentication
- Validate input
- Check username uniqueness via `superRefine`
- Hash password with bcrypt
- Create user with specified role
- Return success with user data

**Success:** Return submission.reply() with reset form

**Errors:**
- Not admin: Throws (handled by middleware)
- Username exists: Custom issue on username field
- Validation errors: Conform validation

---

## 6. Player Management Actions

### getPlayersAction

**File:** `src/lib/actions/players.ts`

**Corresponds to:** `GET /api/players`

**Purpose:** List all players (filtered by role)

**Type:** Query function

**Parameters:**

```typescript
type GetPlayersParams = {
  page?: number // default: 1
  limit?: number // default: 50
  sort?: 'name' | 'skill_tier' | 'created_at'
  skill_tier?: 'S' | 'A' | 'B' | 'C' | 'D' // admin only
  position?: 'PG' | 'SG' | 'SF' | 'PF' | 'C' // admin only
}
```

**Implementation:**
- Get current user to determine role
- Build Prisma where clause (filters only for admin)
- Calculate pagination
- Query players with conditional select based on role
- Return filtered data

**Response (Admin):**

```typescript
type PlayerAdmin = {
  id: string
  name: string
  skill_tier: 'S' | 'A' | 'B' | 'C' | 'D'
  positions: string[]
  created_at: Date
  updated_at: Date
}
```

**Response (User):**

```typescript
type PlayerUser = {
  id: string
  name: string
  created_at: Date
}
```

---

### createPlayerAction

**File:** `src/lib/actions/players.ts`

**Corresponds to:** `POST /api/players`

**Purpose:** Create new player (admin only)

**Request Schema:**

```typescript
const CreatePlayerSchema = z.object({
  name: z.string().max(100),
  skill_tier: z.enum(['S', 'A', 'B', 'C', 'D']),
  positions: z.array(z.enum(['PG', 'SG', 'SF', 'PF', 'C'])).min(1),
})
```

**Implementation:**
- Require admin authentication
- Validate input
- Check name uniqueness via `superRefine`
- Create player with positions as JSON array
- Return success

**Success:** Return submission.reply() with reset form

**Errors:**
- Not admin: Throws
- Name exists: Custom issue on name field
- Invalid positions: Validation error

---

### updatePlayerAction

**File:** `src/lib/actions/players.ts`

**Corresponds to:** `PUT /api/players/{id}`

**Purpose:** Update player information (admin only)

**Request Schema:**

```typescript
const UpdatePlayerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(100).optional(),
  skill_tier: z.enum(['S', 'A', 'B', 'C', 'D']).optional(),
  positions: z.array(z.enum(['PG', 'SG', 'SF', 'PF', 'C'])).min(1).optional(),
})
```

**Implementation:**
- Require admin authentication
- Validate input including id
- Check player exists
- Check name uniqueness if name provided (exclude current player)
- Update player with provided fields
- Return success

**Success:** Return submission.reply()

**Errors:**
- Not admin: Throws
- Player not found: Custom form error
- Name taken: Custom issue on name field

---

### deletePlayerAction

**File:** `src/lib/actions/players.ts`

**Corresponds to:** `DELETE /api/players/{id}`

**Purpose:** Delete player (admin only)

**Request Schema:**

```typescript
const DeletePlayerSchema = z.object({
  id: z.string().uuid(),
})
```

**Implementation:**
- Require admin authentication
- Validate id
- Check player exists
- Delete player (cascade handled by Prisma schema)
- Revalidate relevant paths
- Return success

**Success:** Return submission.reply()

**Errors:**
- Not admin: Throws
- Player not found: Custom form error

---

## 7. Game Session Actions

### getGameSessionsAction

**File:** `src/lib/actions/game-sessions.ts`

**Corresponds to:** `GET /api/game-sessions`

**Purpose:** List game sessions with filtering

**Type:** Query function

**Parameters:**

```typescript
type GetGameSessionsParams = {
  page?: number // default: 1
  limit?: number // default: 20
  from_date?: Date
  to_date?: Date
  has_results?: boolean
}
```

**Implementation:**
- Build where clause with date range and results filter
- Calculate pagination
- Query game sessions with games relation
- Return sessions with pagination

**Response:**

```typescript
type GameSession = {
  id: string
  game_datetime: Date
  description: string | null
  selected_proposition_id: string | null
  games: Array<Array<{score: number, teamId: string}>>
  created_at: Date
}
```

---

### createGameSessionAction

**File:** `src/lib/actions/game-sessions.ts`

**Corresponds to:** `POST /api/game-sessions`

**Purpose:** Create new game session (admin only)

**Request Schema:**

```typescript
const CreateGameSessionSchema = z.object({
  game_datetime: z.coerce.date(),
  description: z.string().max(500).optional(),
})
```

**Implementation:**
- Require admin authentication
- Validate input
- Check for existing session on same date (day level) via `superRefine`
- Create game session
- Return success

**Success:** Return submission.reply() with reset form

**Errors:**
- Not admin: Throws
- Duplicate date: Custom issue on game_datetime field
- Invalid datetime: Validation error

---

### getGameSessionAction

**File:** `src/lib/actions/game-sessions.ts`

**Corresponds to:** `GET /api/game-sessions/{id}`

**Purpose:** Get detailed game session information

**Type:** Query function

**Parameters:**

```typescript
type GetGameSessionParams = {
  id: string
}
```

**Implementation:**
- Validate id
- Query game session with all relations:
  - games
  - available_players
  - propositions (with teams and players)
- Return full game session data

**Response:**

```typescript
type GameSessionDetail = {
  id: string
  game_datetime: Date
  description: string | null
  selected_proposition_id: string | null
  games: Array<Array<{score: number, teamId: string}>>
  available_players: string[]
  propositions: Proposition[]
  created_at: Date
  updated_at: Date
}
```

**Errors:** Throws if not found

---

### updateAvailablePlayersAction

**File:** `src/lib/actions/game-sessions.ts`

**Corresponds to:** `PUT /api/game-sessions/{id}/available-players`

**Purpose:** Set available players for game session (admin only)

**Request Schema:**

```typescript
const UpdateAvailablePlayersSchema = z.object({
  id: z.string().uuid(),
  player_ids: z.array(z.string().uuid()).min(10),
})
```

**Implementation:**
- Require admin authentication
- Validate input (minimum 10 players)
- Check game session exists
- Verify all player_ids exist
- Update game session available_players
- Return success

**Success:** Return submission.reply()

**Errors:**
- Not admin: Throws
- Session not found: Custom form error
- Less than 10 players: Validation error
- Invalid player ids: Custom form error

---

### generatePropositionsAction

**File:** `src/lib/actions/game-sessions.ts`

**Corresponds to:** `POST /api/game-sessions/{id}/propositions/generate`

**Purpose:** Generate AI team propositions (admin only)

**Request Schema:**

```typescript
const GeneratePropositionsSchema = z.object({
  id: z.string().uuid(),
  regenerate: z.boolean().default(false),
})
```

**Implementation:**
- Require admin authentication
- Validate input
- Check game session exists
- Get available players (minimum 10)
- If regenerate=true, delete existing propositions
- Call AI service to generate 3 propositions:
  - position_focused
  - skill_balanced
  - general
- Create propositions with teams and player relations
- Return proposition data

**Success:** Return submission.reply() with proposition data

**Errors:**
- Not admin: Throws
- Session not found: Custom form error
- Insufficient players: Custom form error
- AI service error: Custom form error

---

### selectPropositionAction

**File:** `src/lib/actions/game-sessions.ts`

**Corresponds to:** `PUT /api/game-sessions/{id}/select-proposition`

**Purpose:** Select final team proposition (admin only)

**Request Schema:**

```typescript
const SelectPropositionSchema = z.object({
  game_session_id: z.string().uuid(),
  proposition_id: z.string().uuid(),
})
```

**Implementation:**
- Require admin authentication
- Validate input
- Check game session exists
- Check proposition exists and belongs to session
- Check no proposition already selected
- Update game session selected_proposition_id
- Return success

**Success:** Return submission.reply()

**Errors:**
- Not admin: Throws
- Session not found: Custom form error
- Proposition not found: Custom form error
- Already selected: Custom form error

---

### updateGameResultsAction

**File:** `src/lib/actions/game-sessions.ts`

**Corresponds to:** `PUT /api/game-sessions/{id}/results`

**Purpose:** Record game results (admin only)

**Request Schema:**

```typescript
const GameResultSchema = z.object({
  score: z.number().int().min(0),
  teamId: z.string().uuid(),
})

const UpdateGameResultsSchema = z.object({
  id: z.string().uuid(),
  games: z.array(z.array(GameResultSchema).length(2)).min(1),
})
```

**Implementation:**
- Require admin authentication
- Validate input
- Check game session exists
- Verify all teamIds belong to selected proposition
- Update game session games field
- Return success

**Success:** Return submission.reply()

**Errors:**
- Not admin: Throws
- Session not found: Custom form error
- Invalid team ids: Custom form error
- Invalid format: Validation error

---

## 8. Proposition Actions

### getPropositionAction

**File:** `src/lib/actions/propositions.ts`

**Corresponds to:** `GET /api/propositions/{id}`

**Purpose:** Get specific proposition details

**Type:** Query function

**Parameters:**

```typescript
type GetPropositionParams = {
  id: string
}
```

**Implementation:**
- Validate id
- Query proposition with teams and players
- Return proposition data

**Response:**

```typescript
type PropositionDetail = {
  id: string
  game_session_id: string
  type: 'position_focused' | 'skill_balanced' | 'general'
  teams: Array<{
    id: string
    players: Array<{
      id: string
      name: string
      skill_tier: 'S' | 'A' | 'B' | 'C' | 'D'
      positions: string[]
    }>
  }>
  created_at: Date
}
```

**Errors:** Throws if not found

---

### updatePropositionTeamsAction

**File:** `src/lib/actions/propositions.ts`

**Corresponds to:** `PUT /api/propositions/{id}/teams`

**Purpose:** Manually adjust teams in proposition (admin only)

**Request Schema:**

```typescript
const UpdatePropositionTeamsSchema = z.object({
  id: z.string().uuid(),
  team1_player_ids: z.array(z.string().uuid()).min(5),
  team2_player_ids: z.array(z.string().uuid()).min(5),
})
```

**Implementation:**
- Require admin authentication
- Validate input
- Check proposition exists
- Verify no duplicate players across teams
- Verify all players in available_players for session
- Get existing team ids from proposition
- Update both teams with new player lists
- Return success

**Success:** Return submission.reply()

**Errors:**
- Not admin: Throws
- Proposition not found: Custom form error
- Duplicate players: Custom form error
- Invalid player ids: Custom form error

---

## 9. Validation Schemas

All validation schemas should be defined in:

```
src/lib/validations/
├── auth.ts          # LoginSchema, RegisterSchema
├── users.ts         # CreateUserSchema
├── players.ts       # CreatePlayerSchema, UpdatePlayerSchema, DeletePlayerSchema
├── game-sessions.ts # Game session related schemas
└── propositions.ts  # Proposition related schemas
```

### Schema Patterns

**Password Validation:**
```typescript
z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number')
```

**Username Validation:**
```typescript
z.string()
  .max(50, 'Username must be 50 characters or less')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
```

**Name Validation:**
```typescript
z.string()
  .max(100, 'Name must be 100 characters or less')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
```

---

## 10. Authentication & Authorization

### Helper Functions

**File:** `src/lib/auth.server.ts`

```typescript
export const getUser = async (): Promise<User | null> => {
  const cookieStore = await cookies()
  const token = cookieStore.get('bts-session')?.value

  if (!token) return null

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string }
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, username: true, role: true }
    })
    return user
  } catch {
    return null
  }
}

export const requireUser = async (): Promise<User> => {
  const user = await getUser()
  if (!user) redirect('/login')
  return user
}

export const requireAdmin = async (): Promise<User> => {
  const user = await requireUser()
  if (user.role !== 'admin') {
    throw new Error('Insufficient permissions')
  }
  return user
}
```

### Role-based Filtering

For query functions that return different data based on role:

```typescript
export const getPlayers = async (params: GetPlayersParams) => {
  const user = await getUser()
  const isAdmin = user?.role === 'admin'

  const select = isAdmin
    ? { id: true, name: true, skill_tier: true, positions: true, created_at: true }
    : { id: true, name: true, created_at: true }

  const players = await prisma.player.findMany({
    select,
    // ... rest of query
  })

  return players
}
```

---

## 11. Error Handling

### Error Types

**Authentication Errors:**
- Not logged in → `redirect('/login')`
- Insufficient permissions → Throw error (caught by error boundary)

**Validation Errors:**
- Field errors → Return via `submission.reply()`
- Form errors → Return via `submission.reply({ formErrors: [...] })`

**Business Logic Errors:**
- Not found → Custom form error
- Conflict → Custom field or form error
- External service error → Custom form error

### Error Response Pattern

```typescript
// Field-specific error
return submission.reply({
  fieldErrors: {
    username: ['Username already exists']
  }
})

// Form-level error
return submission.reply({
  formErrors: ['Unable to connect to AI service']
})

// Combined
return submission.reply({
  formErrors: ['Unable to save changes'],
  fieldErrors: {
    name: ['Name already taken']
  }
})
```

---

## 12. Business Logic Implementation

### Team Generation

**File:** `src/lib/services/team-generation.ts`

```typescript
type GenerateTeamsParams = {
  players: Array<{
    id: string
    name: string
    skill_tier: 'S' | 'A' | 'B' | 'C' | 'D'
    positions: string[]
  }>
  types: Array<'position_focused' | 'skill_balanced' | 'general'>
}

type TeamProposition = {
  type: string
  team1: string[]
  team2: string[]
}

export const generateTeams = async (
  params: GenerateTeamsParams
): Promise<TeamProposition[]> => {
  // Call AI service with player data
  // Enforce balanced team generation
  // Return 3 propositions
}
```

**Skill Points Mapping:**
- S = 5 points
- A = 4 points
- B = 3 points
- C = 2 points
- D = 1 point

**Balancing Rules:**
- Equal or ±1 player count
- Minimize skill point differential
- Consider position coverage for position_focused type

---

### Cascading Operations

**Prisma Schema Relationships:**

```prisma
model GameSession {
  propositions Proposition[] @relation(onDelete: Cascade)
  selected_proposition_id String?
  selectedProposition Proposition? @relation(fields: [selected_proposition_id], references: [id], onDelete: SetNull)
}

model User {
  password Password? @relation(onDelete: Cascade)
}
```

**Cascade Behavior:**
- Delete game session → Delete all propositions
- Delete selected proposition → Set selected_proposition_id to null
- Delete user → Delete password record

---

### Duplicate Prevention

**Username Uniqueness:**
```typescript
const existingUser = await prisma.user.findUnique({
  where: { username: data.username },
  select: { id: true }
})

if (existingUser) {
  ctx.addIssue({
    path: ['username'],
    code: z.ZodIssueCode.custom,
    message: 'A user already exists with this username'
  })
  return
}
```

**Player Name Uniqueness:**
```typescript
const existingPlayer = await prisma.player.findUnique({
  where: { name: data.name },
  select: { id: true }
})

if (existingPlayer) {
  ctx.addIssue({
    path: ['name'],
    code: z.ZodIssueCode.custom,
    message: 'A player already exists with this name'
  })
  return
}
```

**Game Date Uniqueness:**
```typescript
const existingSession = await prisma.gameSession.findFirst({
  where: {
    game_datetime: {
      gte: startOfDay(data.game_datetime),
      lt: endOfDay(data.game_datetime)
    }
  },
  select: { id: true }
})

if (existingSession) {
  ctx.addIssue({
    path: ['game_datetime'],
    code: z.ZodIssueCode.custom,
    message: 'A game already exists on this date'
  })
  return
}
```

---

## 13. Revalidation Strategy

After mutations, revalidate affected paths:

```typescript
import { revalidatePath } from 'next/cache'

// After creating/updating/deleting players
revalidatePath('/players')
revalidatePath('/admin/players')

// After game session changes
revalidatePath('/games')
revalidatePath('/games/[id]', 'page')

// After user changes
revalidatePath('/admin/users')
```

Pattern: Revalidate list pages and affected detail pages after any mutation.

---

## 14. Implementation Notes

### FormData Handling

For complex nested data (like games results), use JSON stringification:

```typescript
// In form component
<input
  type="hidden"
  name="games"
  value={JSON.stringify(games)}
/>

// In action
const GamesSchema = z.string().transform((str, ctx) => {
  try {
    return JSON.parse(str)
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid games format'
    })
    return z.NEVER
  }
}).pipe(z.array(z.array(GameResultSchema).length(2)))
```

### Query Function Caching

Mark query functions as cached where appropriate:

```typescript
import { unstable_cache } from 'next/cache'

export const getPlayers = unstable_cache(
  async (params: GetPlayersParams) => {
    // Implementation
  },
  ['players-list'],
  { revalidate: 60 } // Cache for 60 seconds
)
```

### Progressive Enhancement

All actions work without JavaScript via form submission. Use `useActionState` for enhanced UX:

```typescript
import { useActionState } from 'react'

const [state, formAction] = useActionState(createPlayerAction, null)
```

---

## 15. Migration Checklist

- [ ] Create auth helper functions in `src/lib/auth.server.ts`
- [ ] Implement `logoutAction` in `src/lib/actions/auth.ts`
- [ ] Create validation schemas in `src/lib/validations/`
- [ ] Implement user actions in `src/lib/actions/users.ts`
- [ ] Implement player actions in `src/lib/actions/players.ts`
- [ ] Create team generation service in `src/lib/services/team-generation.ts`
- [ ] Implement game session actions in `src/lib/actions/game-sessions.ts`
- [ ] Implement proposition actions in `src/lib/actions/propositions.ts`
- [ ] Add query functions for all GET operations
- [ ] Update Prisma schema with cascade rules
- [ ] Add revalidation calls to all mutations
- [ ] Create error boundary components
- [ ] Update forms to use new actions
- [ ] Test all authentication flows
- [ ] Test all CRUD operations
- [ ] Test role-based access control
- [ ] Test validation and error handling
- [ ] Test AI team generation
- [ ] Verify cascading deletes work correctly
