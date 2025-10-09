<!-- Claude session: https://claude.ai/share/10e199b2-1acd-4261-81b8-244f70c59277 -->

# PRD Summary for Basketball Team Selector MVP

## Problem Statement

Manual team organization for amateur basketball games is time-consuming and
produces unbalanced, repetitive matchups, requiring an AI-powered solution for
quick, balanced team generation.

## Core Product Requirements

### User Management

- **Two user roles:** Admin (full access) and User (view-only)
- **Platform:** Web application only
- **Security:** Basic authentication and session management (no sensitive data
  stored)

### Player Management

- **Skill Rating System:** Tier-based (S, A, B, C, D) with point values:
  - S = 5 points (best)
  - A = 4 points
  - B = 3 points
  - C = 2 points
  - D = 1 point (worst)
- **Positions:** Point Guard, Shooting Guard, Small Forward, Power Forward,
  Center
- **Multi-position Support:** Players can play multiple positions

### Team Generation

- **AI Service:** Free tier of Gemini API (or similar free service)
- **Three AI Propositions per game:**
  1. Position-focused: Prioritizes optimal position coverage
  2. Skill-balanced: Minimizes point value differences between teams
  3. General balanced: Combination of factors
- **Team Structure:**
  - Standard: 5v5 games
  - Even distribution for extra players (e.g., 6-6 for 12 players, 6-6-6 for 18
    players)
  - No bench/starter differentiation - equal playing time for all

### Game Workflow

1. Admin selects available players from roster
2. System generates 3 team propositions via AI
3. Admin reviews and can make manual adjustments (player swaps between teams)
4. Admin selects final team composition
5. After game completion, admin enters results
6. System stores game data and updates statistics

### Data Storage

- Historical game results (date, teams, scores)
- Team compositions for each game
- Basic player statistics (games played, games won)
- Data stored for future AI training (not used in MVP)

### Success Metrics

- **Primary:** Complete team selection process in under 5 minutes
- **Secondary:** At least one AI proposition accepted with minimal adjustments
  (< 3 player swaps)

## Excluded from MVP

- Multiple player groups support
- Player feedback/rating system
- Advanced analytics and performance tracking
- AI learning from historical games
- External integrations (calendar, league systems)
- Late game-day roster changes
- Monetization features
- User engagement tracking

## Development Priorities

1. Core functionality over UI polish
2. Speed of delivery prioritized
3. Single admin user (weekly Friday usage)
4. Focus on team generation quality over user experience refinements

## Key Decisions from Requirements Gathering

- **No bench differentiation:** All players treated equally with similar playing
  time
- **Free AI service:** Using free tier limits (Gemini or alternative) sufficient
  for single-user weekly usage
- **Simple tier system:** S-D ranking converted to points for balancing
  calculations
- **Flexible positions:** Players can play multiple positions, AI optimizes
  based on available roster
- **Manual override:** Admin retains ability to adjust AI-generated teams
- **Historical data:** Stored for future use but not actively used in MVP
  algorithms

This MVP serves as an internal tool for optimizing weekly basketball game
organization, with potential for future enhancements based on collected data and
usage patterns.
