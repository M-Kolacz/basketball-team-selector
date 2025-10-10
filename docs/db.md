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

### game_sessions

```sql
- id: UUID (PRIMARY KEY, DEFAULT gen_random_uuid())
- game_datetime: TIMESTAMP WITH TIME ZONE (NOT NULL)
- description: TEXT (NULLABLE)
- games: JSONB (DEFAULT '[]', NOT NULL)
- selected_proposition_id: UUID (NULLABLE, FOREIGN KEY → propositions.id)
- created_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
- updated_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
```

### propositions

```sql
- id: UUID (PRIMARY KEY, DEFAULT gen_random_uuid())
- game_session_id: UUID (NOT NULL, FOREIGN KEY → game_sessions.id)
- type: proposition_type_enum (NOT NULL)
- version: INTEGER (NOT NULL, DEFAULT 1)
- team_composition: JSONB (NOT NULL)
- skill_differential: DECIMAL(5,2) (NOT NULL)
- position_coverage_score: DECIMAL(5,2) (NOT NULL)
- is_selected: BOOLEAN (DEFAULT FALSE)
- regeneration_count: INTEGER (DEFAULT 0)
- created_at: TIMESTAMP WITH TIME ZONE (NOT NULL, DEFAULT NOW())
```

## 2. Relationships Between Tables

### One-to-Many Relationships

- users → many game_sessions (created_by relationship - optional for MVP)
- game_sessions → many propositions

### One-to-One Relationships

- game_sessions → selected_proposition (nullable foreign key)

## 3. Indexes

```sql
-- Performance indexes
CREATE INDEX idx_game_sessions_game_datetime ON game_sessions(game_datetime DESC);
CREATE INDEX idx_game_sessions_selected_proposition ON game_sessions(selected_proposition_id);
CREATE INDEX idx_propositions_game_session_id ON propositions(game_session_id);
CREATE INDEX idx_propositions_type ON propositions(type);
CREATE INDEX idx_propositions_is_selected ON propositions(is_selected);
CREATE INDEX idx_players_skill_tier ON players(skill_tier);
CREATE INDEX idx_players_name ON players(name);
CREATE INDEX idx_players_positions ON players USING GIN(positions);

-- Composite indexes
CREATE INDEX idx_propositions_game_session_version ON propositions(game_session_id, version);
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

```json
[
	{
		"team_a_score": 32,
		"team_b_score": 28
	},
	{
		"team_a_score": 32,
		"team_b_score": 30
	}
]
```

### JSONB Structure for team_composition (in propositions table)

```json
{
  "team_a": {
    "players": [
      {
        "id": "uuid",
        "name": "string",
        "skill_tier": "S|A|B|C|D",
        "positions": ["PG", "SG"]
      }
    ],
    "total_skill_points": 20,
    "position_coverage": {
      "PG": true,
      "SG": true,
      "SF": true,
      "PF": true,
      "C": true
    }
  },
  "team_b": {
    "players": [...],
    "total_skill_points": 19,
    "position_coverage": {...}
  }
}
```

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

CREATE TRIGGER set_updated_at_game_sessions BEFORE UPDATE ON game_sessions
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Cascade Behaviors

- propositions.game_session_id → ON DELETE CASCADE
- game_sessions.selected_proposition_id → ON DELETE SET NULL
