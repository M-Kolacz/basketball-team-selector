# Basketball Team Selector Database Schema

## 1. Tables with Columns, Data Types, and Constraints

### users

```sql
- id: UUID (PRIMARY KEY, DEFAULT gen_random_uuid())
- username: VARCHAR(50) (UNIQUE, NOT NULL)
- password_hash: VARCHAR(255) (NOT NULL, CHECK length >= 8)
- role: user_role_enum (NOT NULL, DEFAULT 'user')
- created_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
- updated_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
```

### players

```sql
- id: UUID (PRIMARY KEY, DEFAULT gen_random_uuid())
- name: VARCHAR(100) (UNIQUE, NOT NULL)
- skill_tier: skill_tier_enum (NOT NULL)
- positions: position_enum[] (NOT NULL, DEFAULT '{}')
- created_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
- updated_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
```

### teams

```sql
- id: UUID (PRIMARY KEY, DEFAULT gen_random_uuid())
- players: UUID[] (NOT NULL, DEFAULT '{}')
- created_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
- updated_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
```

### game_sessions

```sql
- id: UUID (PRIMARY KEY, DEFAULT gen_random_uuid())
- game_datetime: TIMESTAMP WITH TIME ZONE (NOT NULL)
- description: TEXT (NULLABLE)
- games: JSONB (DEFAULT '[]', NOT NULL)
- team_propositions: UUID[] (NOT NULL, DEFAULT '{}')
- selected_proposition_id: UUID (NULLABLE, FOREIGN KEY → propositions.id)
- created_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
- updated_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
```

### propositions

```sql
- id: UUID (PRIMARY KEY, DEFAULT gen_random_uuid())
- game_session_id: UUID (NOT NULL, FOREIGN KEY → game_sessions.id)
- type: proposition_type_enum (NOT NULL)
- teams: UUID[] (NOT NULL, DEFAULT '{}')
- created_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
```

## 2. Relationships Between Tables

### One-to-Many Relationships

- users → many game_sessions (created_by relationship - optional for MVP)
- game_sessions → many propositions

### One-to-One Relationships

- game_sessions → selected_proposition (nullable foreign key)

### Many-to-Many Relationships (via UUID arrays)

- teams ↔ players (teams.players[] contains player UUIDs)
- propositions ↔ teams (propositions.teams[] contains team UUIDs)
- game_sessions ↔ propositions (game_sessions.team_propositions[] contains
  proposition UUIDs)

## 3. Indexes

```sql
-- Performance indexes
CREATE INDEX idx_game_sessions_game_datetime ON game_sessions(game_datetime DESC);
CREATE INDEX idx_game_sessions_selected_proposition ON game_sessions(selected_proposition_id);
CREATE INDEX idx_propositions_game_session_id ON propositions(game_session_id);
CREATE INDEX idx_propositions_type ON propositions(type);
CREATE INDEX idx_players_skill_tier ON players(skill_tier);
CREATE INDEX idx_players_name ON players(name);
CREATE INDEX idx_players_positions ON players USING GIN(positions);

-- Array indexes
CREATE INDEX idx_teams_players ON teams USING GIN(players);
CREATE INDEX idx_propositions_teams ON propositions USING GIN(teams);
CREATE INDEX idx_game_sessions_team_propositions ON game_sessions USING GIN(team_propositions);
```

## 4. PostgreSQL Policies

_Note: As specified in the planning notes, Row Level Security (RLS) is not
required for the MVP as access control will be handled at the application layer.
However, the schema is designed to support RLS implementation in future
iterations if needed._

## 5. Additional Notes and Design Decisions

### Enum Types

```sql
CREATE TYPE user_role_enum AS ENUM ('admin', 'user');
CREATE TYPE skill_tier_enum AS ENUM ('S', 'A', 'B', 'C', 'D');
CREATE TYPE proposition_type_enum AS ENUM ('position_focused', 'skill_balanced', 'general');
CREATE TYPE position_enum AS ENUM ('PG', 'SG', 'SF', 'PF', 'C');
```

### Skill Tier Point Values

- S = 5 points
- A = 4 points
- B = 3 points
- C = 2 points
- D = 1 point _(These values are used in application logic for team balancing
  calculations)_

### Position Enum Values

- PG = Point Guard
- SG = Shooting Guard
- SF = Small Forward
- PF = Power Forward
- C = Center

### JSONB Structure for games array (in game_sessions table)

Each game is represented as an array containing score objects for each team:

```json
[
	[
		{ "score": 32, "teamId": "uuid-of-team-1" },
		{ "score": 28, "teamId": "uuid-of-team-2" }
	],
	[
		{ "score": 29, "teamId": "uuid-of-team-1" },
		{ "score": 32, "teamId": "uuid-of-team-2" }
	]
]
```

Each inner array represents a single game, with score objects indicating the
score and team ID for each participating team.

### Database Triggers

```sql
-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_users BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_players BEFORE UPDATE ON players
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_teams BEFORE UPDATE ON teams
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_game_sessions BEFORE UPDATE ON game_sessions
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Cascade Behaviors

- propositions.game_session_id → ON DELETE CASCADE
- game_sessions.selected_proposition_id → ON DELETE SET NULL
