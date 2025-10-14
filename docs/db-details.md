<!-- Claude session: https://claude.ai/share/2734d8d8-fdcd-45d6-8925-f22244336f46 -->

# Basketball Team Selector - Database Design Summary

## Overview

This document summarizes the database design decisions for the Basketball Team
Selector MVP, a web application for organizing amateur basketball games with
AI-powered team generation.

## Key Design Decisions

### Core Entities and Relationships

#### 1. **Users Table**

- Simple authentication with username/password (hashed)
- Role-based access using enum type (admin, user)
- Admins have full access, users have view-only permissions
- No session tracking in database (handled at application layer)

#### 2. **Players Table**

- Player profiles with names (unique constraint)
- Skill tiers as enum (S, A, B, C, D) with separate point values
- Many-to-many relationship with positions via junction table
- No soft deletes for MVP
- Skill tiers and positions hidden from non-admin users

#### 3. **Positions Table**

- Five standard basketball positions
- Many-to-many relationship with players through `player_positions` junction
  table

#### 4. **Games Table**

- Single timestamp field for game date/time
- Support for multiple games per session
- Direct storage of game results (team_a_score, team_b_score)
- Reference to selected proposition via foreign key
- No player availability tracking (admin manually manages)

#### 5. **Propositions Table**

- Complete team composition snapshots stored as JSONB
- Three types per generation: position-focused, skill-balanced, general (enum
  field)
- Version numbering and timestamps for tracking regenerations
- Regeneration count to monitor usage patterns
- Pre-calculated team metrics (skill differentials, position coverage)
- Teams identified as "Team A" and "Team B" within JSONB structure

#### 6. **Player Statistics Table**

- Dedicated table for performance metrics
- Games played, games won, win percentage
- Updated via database triggers when game results are entered
- Ensures consistency and reduces application complexity

### Data Storage Strategy

#### JSONB for Team Compositions

Using JSONB fields for storing complete team snapshots in propositions provides:

- Historical accuracy (preserves exact team state even if player data changes)
- Simplified queries (no complex joins for retrieving propositions)
- Flexibility for future schema evolution
- Efficient storage of complex nested data

#### Enum Types

- Skill tiers: S, A, B, C, D (with corresponding point values: 5, 4, 3, 2, 1)
- User roles: admin, user
- Proposition types: position_focused, skill_balanced, general

### Security and Privacy

#### Data Access Control

- Skill tiers and positions are sensitive data
- Only exposed to frontend for admin users
- Backend-only access for regular users
- No RLS needed since access control is handled at application layer

#### Authentication

- Simple password-based authentication
- Passwords hashed and stored in database
- Minimum 8-character length enforced at database level
- Additional complexity requirements handled by application

### Performance Optimizations

#### Indexing Strategy

- Foreign key indexes for relationship queries
- Index on game dates for chronological queries
- Index on player names for search functionality
- Composite indexes on game-player relationships

#### Database Triggers

- Automatic statistics updates when game results are entered
- Ensures data consistency without application logic overhead

### Cascade Behaviors

- **CASCADE**: Propositions deleted when parent game is deleted
- **RESTRICT**: Prevent player deletion if they have game history

## Design Rationale and Thoughts

### Strengths of This Design

1. **Simplicity First**: The design prioritizes MVP requirements without
   over-engineering. No complex permission systems, audit trails, or unnecessary
   abstractions.

2. **Historical Integrity**: Storing complete snapshots in JSONB ensures
   historical games remain accurate even as player data evolves. This is crucial
   for statistics and future AI training.

3. **Performance Conscious**: Strategic use of triggers, indexes, and
   denormalization (statistics table) balances performance with maintainability.

4. **Flexibility for Growth**: While simple, the design accommodates future
   enhancements:
   - Enum types can be expanded
   - JSONB allows schema evolution without migrations
   - Statistics table can be extended with new metrics

### Considerations and Trade-offs

1. **JSONB vs. Normalized Tables**: Choosing JSONB for team compositions trades
   some query flexibility for simplicity and historical accuracy. This is
   appropriate since you won't be querying individual players within
   propositions.

2. **Multiple Games per Session**: The clarification about multiple games per
   session (playing to 32 points) is important. The schema handles this well
   with separate game records, each linked to the same session date but with
   different scores.

3. **No Availability Tracking**: Removing player availability tracking
   simplifies the schema but puts more responsibility on the admin. This is a
   reasonable trade-off for an MVP with a single admin user.

4. **Trigger-Based Statistics**: Using database triggers for statistics updates
   is slightly more complex to set up but ensures consistency and reduces
   application code complexity.

## Migration Path Considerations

The current design provides clear upgrade paths for future features:

1. **Enhanced Authentication**: The simple password table can easily migrate to
   external auth providers
2. **Expanded Roles**: The enum can convert to a full RBAC system if needed
3. **Audit Trails**: Timestamps can be added without disrupting existing
   functionality
4. **AI Learning**: Stored propositions provide rich historical data for future
   ML features

## Recommended Implementation Order

1. Create core tables (users, players, positions)
2. Set up junction tables (player_positions)
3. Implement games and propositions tables
4. Add statistics table with triggers
5. Create indexes
6. Seed initial data (positions, skill tiers)

## Final Thoughts

This database design strikes an excellent balance between simplicity and
functionality for an MVP. It avoids premature optimization while laying a solid
foundation for future growth. The use of PostgreSQL-specific features (JSONB,
enums, triggers) leverages the database's strengths without creating vendor
lock-in concerns.

The design particularly excels at maintaining data integrity and historical
accuracy - essential for a statistics-driven application. The clear separation
between what's stored (complete data) and what's calculated (statistics)
provides flexibility for future enhancements without requiring major
refactoring.

Most importantly, this schema directly addresses the core user problem: enabling
quick, fair, and varied team generation for weekly basketball games, while
keeping the administrative burden minimal.
