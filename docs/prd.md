# Product Requirements Document (PRD) - Basketball Team Selector

## 1. Product Overview

Web application for AI-powered basketball team generation. Single player group
(~20 players). Two roles: Admin (full access), User (view-only). Uses free AI
service (Gemini) to generate balanced teams based on player skills (S-D tiers)
and positions. Admin selects available players, reviews 3 AI propositions, makes
manual adjustments if needed, confirms teams, records results. Historical data
stored for reference. MVP prioritizes speed over polish - 5-minute team
selection goal.

### Terminology

- **Game Session**: Single event (date, selected players, AI propositions, final teams). Created once per basketball gathering.
- **Game**: Individual match result (scores). Multiple games can be played within one game session.

## 2. User Problem

Amateur basketball groups waste time manually organizing teams, creating
unbalanced games with repetitive matchups. Players lose interest when teams are
predictable or skill-mismatched. Need quick, balanced, varied team generation
that considers player skills and positions while allowing manual override.

## 3. Functional Requirements

### 3.1 Authentication & Authorization

- JWT token authentication (cookie storage)
- Two roles: Admin, User
- Session management
- Role-based access control

### 3.2 Player Management

- Add/edit/delete players (Admin only)
- Skill tiers: S, A, B, C, D
- Positions: PG, SG, SF, PF, C
- Player with multi-position support
- ~20 player roster

### 3.3 Team Generation

- Free Gemini API integration
- Input: available players list
- Output: 3 propositions
  - Position-focused
  - Skill-balanced
  - General balanced
- Dynamic team count: 2-4 teams based on player count
  - 10 players: 2 teams of 5
  - 15 players: 3 teams of 5
  - 20 players: 4 teams of 5
  - Uneven counts distributed (e.g., 11 players: 5-6 per team)
- No bench/starter distinction

### 3.4 Game Session Management

- Create game sessions by date
- Select available players for session
- Review AI propositions
- Manual player swaps between teams
- Confirm final teams
- Record game results (score) - multiple games per session
- Store historical data

### 3.5 Data Storage

- Player profiles
- Game sessions (date, selected players, propositions, final teams)
- Games (match results with scores) - linked to game sessions
- All generated propositions
- Final team compositions

## 4. Product Boundaries

### In Scope

- Single player group
- Basic authentication
- AI team generation
- Manual adjustments
- Result tracking
- View-only user access
- Edit game session details (date, description, players)

### Out of Scope

- Multiple groups
- Player feedback/ratings
- Performance analytics
- AI learning from history
- External integrations
- Monetization
- Engagement tracking

## 5. User Stories

### US-001

- ID: US-001
- Title: User Registration
- Description: As new user, I register account with username/password to access
  system
- Acceptance Criteria:
  - Username validation required
  - Password min 8 characters
  - Account created in database
  - Default role assigned (User)
  - JWT token generated

### US-002

- ID: US-002
- Title: User Login
- Description: As registered user, I log in to access application
- Acceptance Criteria:
  - Username/password authentication
  - JWT token stored in cookie
  - Redirect to games dashboard

### US-003

- ID: US-003
- Title: User Logout
- Description: As logged-in user, I log out to end session
- Acceptance Criteria:
  - JWT token cleared
  - Session terminated
  - Redirect to login page

### US-004

- ID: US-004
- Title: View Dashboard
- Description: As user, I view dashboard with upcoming games and recent results
- Acceptance Criteria:
  - Display next scheduled game
  - Show last games results
  - Access based on role

### US-005

- ID: US-005
- Title: Add Player
- Description: As admin, I add new player to roster
- Acceptance Criteria:
  - Name required
  - Skill tier selection (S-D)
  - Position selection (multiple allowed)
  - Player saved to database

### US-006

- ID: US-006
- Title: Edit Player
- Description: As admin, I edit existing player details
- Acceptance Criteria:
  - Update name, skill, positions
  - Changes saved to database

### US-007

- ID: US-007
- Title: Delete Player
- Description: As admin, I remove player from roster
- Acceptance Criteria:
  - Confirmation dialog required
  - Removed from available players

### US-008

- ID: US-008
- Title: View Player Roster
- Description: As user, I view all players with skills and positions
- Acceptance Criteria:
  - Display player name, tier, positions for admin user
  - Non admin users see only names
  - Sort by name or skill
  - Show active players only

### US-009

- ID: US-009
- Title: Create Game Session
- Description: As admin, I create new game session for specific date
- Acceptance Criteria:
  - Select date/time
  - Game session saved with pending status
  - Unique session ID generated

### US-010

- ID: US-010
- Title: Select Available Players
- Description: As admin, I select which players available for game session
- Acceptance Criteria:
  - Checkbox list of all active players
  - Min 10 players required
  - Max 20 players allowed
  - Selection saved to game session

### US-011

- ID: US-011
- Title: Generate Team Propositions
- Description: As admin, I generate AI team propositions
- Acceptance Criteria:
  - Call Gemini API with player data
  - Generate exactly 3 propositions
  - Display loading indicator
  - Show error if API fails
  - Store all propositions

### US-012

- ID: US-012
- Title: View Team Propositions
- Description: As admin, I review generated team propositions
- Acceptance Criteria:
  - Display 3 propositions side-by-side
  - Show team compositions
  - Indicate balance method used

### US-013

- ID: US-013
- Title: Adjust Team Composition
- Description: As admin, I manually swap players between teams before selection
- Acceptance Criteria:
  - Drag-drop or select-swap interface
  - Maintain team size balance
  - Track number of swaps made
  - Changes made to proposition preview only

### US-014

- ID: US-014
- Title: Select Final Teams
- Description: As admin, I select one proposition to use for game session
- Acceptance Criteria:
  - Select one proposition (original or after adjustments)
  - Save selected proposition to game session
  - Mark game session as confirmed
  - Selection is permanent (cannot change after selection)
  - Show success message

### US-015

- ID: US-015
- Title: Record Game Result
- Description: As admin, I enter final score after a match is played
- Acceptance Criteria:
  - Input scores for each team
  - Create new game (match) record linked to game session
  - Store result in database
  - Multiple games can be recorded per session

### US-016

- ID: US-016
- Title: View Game Session History
- Description: As user, I view past game sessions with teams and match results
- Acceptance Criteria:
  - List game sessions by date (descending)
  - Show final teams for each session
  - Display all games (matches) played in each session with scores

### US-017

- ID: US-017
- Title: View Game Session Details
- Description: As user, I view detailed information for specific game session
- Acceptance Criteria:
  - Display session date, final teams
  - Show all games (matches) played with scores
  - Show all generated propositions
  - Indicate which proposition was selected

### US-023

- ID: US-023
- Title: Handle Variable Player Count
- Description: As admin, system handles different player counts with flexible team configurations
- Acceptance Criteria:
  - Min 10 players: creates 2 teams
  - 11-14 players: creates 2 teams (distributed evenly)
  - 15-19 players: creates 3 teams (distributed evenly)
  - 20 players: creates 4 teams
  - Clear indication of team sizes
  - AI optimizes for fairness across all teams

## 6. Success Metrics

### Primary Metrics

- Team selection completion: <5 minutes (95% of game sessions)
- AI proposition acceptance: ≥1 proposition accepted with <3 swaps (80% of
  game sessions)

### Quality Indicators

- Manual adjustment count per game session
- Time from game session creation to confirmation
