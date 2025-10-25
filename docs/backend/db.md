# Basketball Team Selector Database Schema

## 1. Tables with Columns, Data Types, and Constraints

### users

```sql
- id: UUID (PRIMARY KEY, DEFAULT gen_random_uuid())
- username: VARCHAR(50) (UNIQUE, NOT NULL)
- role: user_role_enum (NOT NULL, DEFAULT 'user')
- created_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
- updated_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
```

### passwords

```sql
- hash: VARCHAR(255) (NOT NULL)
- user_id: UUID (UNIQUE, NOT NULL, FOREIGN KEY → users.id)
```

### players

```sql
- id: UUID (PRIMARY KEY, DEFAULT gen_random_uuid())
- name: VARCHAR(100) (UNIQUE, NOT NULL)
- skill_tier: skill_tier_enum (NOT NULL, DEFAULT 'B')
- positions: position_enum[] (NOT NULL, DEFAULT '{}')
- created_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
- updated_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
```

### teams

```sql
- id: UUID (PRIMARY KEY, DEFAULT gen_random_uuid())
- created_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
- updated_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
```

_Note: The many-to-many relationship between teams and players is managed by
Prisma through an implicit join table `_PlayerToTeam` (player_id, team_id)._

### games

```sql
- id: UUID (PRIMARY KEY, DEFAULT gen_random_uuid())
- game_session_id: UUID (NOT NULL, FOREIGN KEY → game_sessions.id)
- created_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
- updated_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
```

### scores

```sql
- id: UUID (PRIMARY KEY, DEFAULT gen_random_uuid())
- points: INTEGER (NOT NULL)
- game_id: UUID (NOT NULL, FOREIGN KEY → games.id)
- team_id: UUID (NOT NULL, FOREIGN KEY → teams.id)
- created_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
```

### game_sessions

```sql
- id: UUID (PRIMARY KEY, DEFAULT gen_random_uuid())
- game_datetime: TIMESTAMP WITH TIME ZONE (NOT NULL)
- description: TEXT (NULLABLE)
- selected_proposition_id: UUID (NULLABLE, UNIQUE, FOREIGN KEY → propositions.id)
- created_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
- updated_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
```

### propositions

```sql
- id: UUID (PRIMARY KEY, DEFAULT gen_random_uuid())
- game_session_id: UUID (NOT NULL, FOREIGN KEY → game_sessions.id)
- type: proposition_type_enum (NOT NULL)
- created_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
```

_Note: The many-to-many relationship between propositions and teams is managed
by Prisma through an implicit join table `_PropositionToTeam` (proposition_id,
team_id)._

## 2. Relationships Between Tables

### One-to-Many Relationships

- game_sessions → many propositions (via propositions.game_session_id)
- game_sessions → many games (via games.game_session_id)
- games → many scores (via scores.game_id)
- teams → many scores (via scores.team_id)

### One-to-One Relationships

- users → password (via passwords.user_id, nullable on User side)
- game_sessions → selected_proposition (via
  game_sessions.selected_proposition_id, nullable)

### Many-to-Many Relationships (via Prisma implicit join tables)

- teams ↔ players (managed via `_PlayerToTeam` join table with player_id and
  team_id)
- propositions ↔ teams (managed via `_PropositionToTeam` join table with
  proposition_id and team_id)

## 3. Indexes

_Note: Prisma automatically creates indexes for the following:_

- Primary keys (all `id` fields)
- Unique constraints (`users.username`, `passwords.user_id`, `players.name`,
  `game_sessions.selected_proposition_id`)
- Foreign key fields (`passwords.user_id`, `propositions.game_session_id`,
  `game_sessions.selected_proposition_id`, `games.game_session_id`,
  `scores.game_id`, `scores.team_id`)
- Join table columns (indexes on `_PlayerToTeam` and `_PropositionToTeam`)

_Additional performance indexes can be added manually if needed:_

```sql
-- Recommended performance indexes (to be added manually if needed)
CREATE INDEX idx_game_sessions_game_datetime ON game_sessions(game_datetime DESC);
CREATE INDEX idx_propositions_type ON propositions(type);
CREATE INDEX idx_players_skill_tier ON players(skill_tier);
CREATE INDEX idx_players_positions ON players USING GIN(positions);
```

## 4. PostgreSQL Policies

_Note: As specified in the planning notes, Row Level Security (RLS) is not
required for the MVP as access control will be handled at the application layer.
However, the schema is designed to support RLS implementation in future
iterations if needed._

## 5. Additional Notes and Design Decisions

### Prisma Schema Mapping

_Note: The Prisma schema uses camelCase for field names (e.g., `skillTier`,
`gameDatetime`, `gameSessionId`), which automatically maps to snake_case in the
PostgreSQL database (e.g., `skill_tier`, `game_datetime`, `game_session_id`).
The SQL examples above reflect the actual database column names._

### Enum Types

```sql
CREATE TYPE user_role_enum AS ENUM ('admin', 'user');
CREATE TYPE skill_tier_enum AS ENUM ('S', 'A', 'B', 'C', 'D');
CREATE TYPE proposition_type_enum AS ENUM ('position_focused', 'skill_balanced', 'general');
CREATE TYPE position_enum AS ENUM ('PG', 'SG', 'SF', 'PF', 'C');
```

### Position Enum Values

- PG = Point Guard
- SG = Shooting Guard
- SF = Small Forward
- PF = Power Forward
- C = Center

### Games and Scores Structure

Games are now stored in two separate tables instead of a JSON field:

- **games table**: Each record represents a single game within a game session.
  Contains `game_session_id` to link back to the session.
- **scores table**: Each record represents one team's score in a game. Contains
  `game_id` (to identify which game), `team_id` (to identify which team), and
  `points` (the score).

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

CREATE TRIGGER set_updated_at_games BEFORE UPDATE ON games
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Cascade Behaviors

- passwords.user_id → ON DELETE CASCADE, ON UPDATE CASCADE
- propositions.game_session_id → ON DELETE CASCADE (deleting a game session
  deletes all its propositions)
- game_sessions.selected_proposition_id → ON DELETE SET NULL (deleting a
  proposition doesn't delete the game session)
- games.game_session_id → ON DELETE CASCADE (deleting a game session deletes
  all its games)
- scores.game_id → ON DELETE CASCADE (deleting a game deletes all its scores)
- `_PlayerToTeam` join table → ON DELETE CASCADE for both player_id and team_id
- `_PropositionToTeam` join table → ON DELETE CASCADE for both proposition_id
  and team_id

_Note: The `propositions` and `scores` tables intentionally do not have an
`updated_at` field, as they are considered immutable once created._
