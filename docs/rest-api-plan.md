# REST API Plan

## 1. Resources

- **Users** → `users` table
- **Players** → `players` table
- **Game Sessions** → `game_sessions` table
- **Propositions** → `propositions` table
- **Teams** → `teams` table (managed through propositions)
- **Authentication** → `users` + `passwords` tables

## 2. Endpoints

### Authentication

#### POST /api/auth/login

- **Description:** Authenticate user and create session
- **Request Payload:**

```json
{
	"username": "string",
	"password": "string"
}
```

- **Response Payload:**

```json
{
	"user": {
		"id": "uuid",
		"username": "string",
		"role": "admin|user"
	}
}
```

- **Success:** 200 OK - JWT token saved in the cookie
- **Errors:**
  - 401 Unauthorized - Invalid credentials
  - 422 Unprocessable Entity - Missing required fields

#### POST /api/auth/logout

- **Description:** Terminate user session - remove cookie
- **Success:** 204 No Content
- **Errors:** 401 Unauthorized - Not authenticated

### Users

#### GET /api/users

- **Description:** List all users (admin only)
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 20)
  - `sort` (username|created_at, default: username)
- **Response Payload:**

```json
{
	"users": [
		{
			"id": "uuid",
			"username": "string",
			"role": "admin|user",
			"created_at": "datetime",
			"updated_at": "datetime"
		}
	],
	"pagination": {
		"page": 1,
		"limit": 20,
		"total": 50,
		"totalPages": 3
	}
}
```

- **Success:** 200 OK
- **Errors:** 403 Forbidden - Insufficient permissions

#### POST /api/users

- **Description:** Create new user (admin only)
- **Request Payload:**

```json
{
	"username": "string (max 50 chars)",
	"password": "string (min 8 chars)",
	"role": "admin|user"
}
```

- **Response Payload:**

```json
{
	"id": "uuid",
	"username": "string",
	"role": "admin|user",
	"created_at": "datetime"
}
```

- **Success:** 201 Created
- **Errors:**
  - 403 Forbidden - Insufficient permissions
  - 409 Conflict - Username already exists
  - 422 Unprocessable Entity - Validation errors

### Players

#### GET /api/players

- **Description:** List all players (skill_tier and positions hidden for
  non-admins)
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 50)
  - `sort` (name|skill_tier|created_at)
  - `skill_tier` (S|A|B|C|D) - admin only
  - `position` (PG|SG|SF|PF|C) - admin only
- **Response Payload (Admin):**

```json
{
  "players": [
    {
      "id": "uuid",
      "name": "string",
      "skill_tier": "S|A|B|C|D",
      "positions": ["PG", "SG"],
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ],
  "pagination": {...}
}
```

- **Response Payload (User):**

```json
{
  "players": [
    {
      "id": "uuid",
      "name": "string",
      "created_at": "datetime"
    }
  ],
  "pagination": {...}
}
```

- **Success:** 200 OK

#### POST /api/players

- **Description:** Create new player (admin only)
- **Request Payload:**

```json
{
	"name": "string (max 100 chars)",
	"skill_tier": "S|A|B|C|D",
	"positions": ["PG", "SG"]
}
```

- **Success:** 201 Created
- **Errors:**
  - 403 Forbidden - Insufficient permissions
  - 409 Conflict - Player name already exists
  - 422 Unprocessable Entity - Invalid skill tier or positions

#### PUT /api/players/{id}

- **Description:** Update player information (admin only)
- **Request Payload:**

```json
{
  "name": "string (optional)",
  "skill_tier": "S|A|B|C|D (optional)",
  "positions": ["PG", "SG"] (optional)
}
```

- **Success:** 200 OK
- **Errors:**
  - 403 Forbidden - Insufficient permissions
  - 404 Not Found - Player not found
  - 409 Conflict - Name already taken

#### DELETE /api/players/{id}

- **Description:** Delete player (admin only)
- **Success:** 204 No Content
- **Errors:**
  - 403 Forbidden - Insufficient permissions
  - 404 Not Found - Player not found

### Game Sessions

#### GET /api/game-sessions

- **Description:** List game sessions with filtering
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 20)
  - `from_date` (ISO datetime)
  - `to_date` (ISO datetime)
  - `has_results` (true|false)
- **Response Payload:**

```json
{
  "gameSessions": [
    {
      "id": "uuid",
      "game_datetime": "datetime",
      "description": "string|null",
      "selected_proposition_id": "uuid|null",
      "games": [...],
      "created_at": "datetime"
    }
  ],
  "pagination": {...}
}
```

- **Success:** 200 OK

#### POST /api/game-sessions

- **Description:** Create new game session (admin only)
- **Request Payload:**

```json
{
	"game_datetime": "datetime",
	"description": "string (optional)"
}
```

- **Success:** 201 Created
- **Errors:**
  - 403 Forbidden - Insufficient permissions
  - 409 Conflict - Game already exists on this date
  - 422 Unprocessable Entity - Invalid datetime

#### GET /api/game-sessions/{id}

- **Description:** Get detailed game session information
- **Response Payload:**

```json
{
  "id": "uuid",
  "game_datetime": "datetime",
  "description": "string|null",
  "selected_proposition_id": "uuid|null",
  "games": [
    [
      {"score": 32, "teamId": "uuid"},
      {"score": 28, "teamId": "uuid"}
    ]
  ],
  "available_players": ["uuid", "uuid"],
  "propositions": [...],
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

- **Success:** 200 OK
- **Errors:** 404 Not Found

#### PUT /api/game-sessions/{id}/available-players

- **Description:** Set available players for game session (admin only)
- **Request Payload:**

```json
{
  "player_ids": ["uuid", "uuid", ...]
}
```

- **Success:** 200 OK
- **Errors:**
  - 403 Forbidden - Insufficient permissions
  - 404 Not Found - Game session not found
  - 422 Unprocessable Entity - Less than 10 players selected

#### POST /api/game-sessions/{id}/propositions/generate

- **Description:** Generate AI team propositions (admin only)
- **Request Payload:**

```json
{
	"regenerate": false
}
```

- **Response Payload:**

```json
{
  "propositions": [
    {
      "id": "uuid",
      "type": "position_focused",
      "teams": [
        {
          "id": "uuid",
          "players": [...]
        }
      ]
    },
    {
      "id": "uuid",
      "type": "skill_balanced",
      "teams": [...]
    },
    {
      "id": "uuid",
      "type": "general",
      "teams": [...]
    }
  ]
}
```

- **Success:** 201 Created
- **Errors:**
  - 403 Forbidden - Insufficient permissions
  - 404 Not Found - Game session not found
  - 422 Unprocessable Entity - Insufficient available players
  - 503 Service Unavailable - AI service error

#### PUT /api/game-sessions/{id}/select-proposition

- **Description:** Select final team proposition (admin only)
- **Request Payload:**

```json
{
	"proposition_id": "uuid"
}
```

- **Success:** 200 OK
- **Errors:**
  - 403 Forbidden - Insufficient permissions
  - 404 Not Found - Game session or proposition not found
  - 409 Conflict - Proposition already selected

#### PUT /api/game-sessions/{id}/results

- **Description:** Record game results (admin only)
- **Request Payload:**

```json
{
	"games": [
		[
			{ "score": 32, "teamId": "uuid" },
			{ "score": 28, "teamId": "uuid" }
		]
	]
}
```

- **Success:** 200 OK
- **Errors:**
  - 403 Forbidden - Insufficient permissions
  - 404 Not Found - Game session not found
  - 422 Unprocessable Entity - Invalid team IDs or score format

### Propositions

#### GET /api/propositions/{id}

- **Description:** Get specific proposition details
- **Response Payload:**

```json
{
	"id": "uuid",
	"game_session_id": "uuid",
	"type": "position_focused|skill_balanced|general",
	"teams": [
		{
			"id": "uuid",
			"players": [
				{
					"id": "uuid",
					"name": "string",
					"skill_tier": "S|A|B|C|D",
					"positions": ["PG", "SG"]
				}
			]
		}
	],
	"created_at": "datetime"
}
```

- **Success:** 200 OK
- **Errors:** 404 Not Found

#### PUT /api/propositions/{id}/teams

- **Description:** Manually adjust teams in proposition (admin only)
- **Request Payload:**

```json
{
  "team1_player_ids": ["uuid", ...],
  "team2_player_ids": ["uuid", ...]
}
```

- **Success:** 200 OK
- **Errors:**
  - 403 Forbidden - Insufficient permissions
  - 404 Not Found - Proposition not found
  - 422 Unprocessable Entity - Invalid player assignments

## 3. Authentication and Authorization

### Authentication Mechanism

- **Type:** JWT (JSON Web Token) based authentication
- **Token Storage:** JWT token in cookie (HttpOnly, Secure, SameSite=Strict)
- **Token Expiration:** 24 hours for standard users, 7 days for admin
- **Implementation:**
  - Generate JWT upon successful login
  - Include user ID and role in token payload
  - Verify cookie with token on each protected endpoint
  - Refresh token endpoint not required for MVP

### Authorization Rules

- **Public Endpoints:** POST /api/auth/login only
- **User-level Access (authenticated users):**
  - GET endpoints for players (limited fields), game sessions, propositions
  - Cannot access skill_tier and positions fields for players
- **Admin-only Access:**
  - All POST, PUT, DELETE operations
  - Full access to all player fields
  - User management endpoints
  - Team generation and game management

## 4. Validation and Business Logic

### User Validation

- Username: Required, unique, max 50 characters, alphanumeric with underscores
- Password: Required for creation, min 8 characters, at least one uppercase, one
  lowercase, one number
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
  - Calls AI service with available players
  - Enforces minimum 10 players
  - Generates exactly 3 propositions per request
  - Balances teams based on skill points (S=5, A=4, B=3, C=2, D=1)
- **Role-based Field Filtering:**
  - Middleware checks user role from JWT
  - Removes sensitive fields from response based on role
  - Applied at serialization layer before sending response

- **Duplicate Prevention:**
  - Database unique constraints enforced
  - Pre-validation checks for duplicates with meaningful error messages
  - Game session date uniqueness checked at day level

- **Cascading Operations:**
  - Deleting game session removes all associated propositions
  - Deleting selected proposition sets game session's selected_proposition_id to
    null
  - User deletion cascades to password record
