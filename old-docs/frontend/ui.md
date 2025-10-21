# UI Architecture for Basketball Team Selector

## 1. UI Structure Overview

The Basketball Team Selector is a web application with a role-based interface
architecture designed for rapid team generation and game management. The UI is
structured around a streamlined workflow that enables administrators to create
balanced teams in under 5 minutes while providing read-only access for regular
users to view team compositions and game details.

The architecture follows a progressive disclosure pattern with a wizard-based
game creation flow, responsive design for mobile and desktop access, and clear
separation between administrative and user-facing features. Authentication is
handled through JWT tokens stored in httpOnly cookies, with role-based rendering
throughout the application.

## 2. View List

### Login Page

- **View path:** `/`
- **Main purpose:** Authenticate users and provide entry point to the
  application
- **Key information to display:**
  - Application branding/logo
  - Username and password input fields
  - Login status and error messages
  - Link to registration page
- **Key view components:**
  - Centered authentication card
  - Form with username/password inputs
  - Submit button with loading state
  - Error message display area
  - "Create new account" link Validates credentials and sets auth cookie
- **UX, accessibility, and security considerations:**
  - Auto-focus on username field
  - Password field with masked input
  - Clear error messages for failed authentication
  - Keyboard navigation support
  - Secure password handling (no client-side storage)
  - ARIA labels for screen readers
  - Server action called on form submission with validation

### Registration Page

- **View path:** `/register`
- **Main purpose:** Allow new users to create accounts
- **Key information to display:**
  - Registration form fields
  - Password requirements
  - Validation feedback
- **Key view components:**
  - Username input with availability indicator
  - Password and confirm password fields
  - Register button with loading state
  - "Back to login" navigation link
- **Server actions:**
  - `checkUsernameAvailability(username)` - Real-time username validation
  - `registerUser(userData)` - Creates new user account
- **UX, accessibility, and security considerations:**
  - Real-time password strength feedback
  - Clear validation messages
  - Password requirements clearly stated
  - Server-side validation via server actions

### Games List

- **View path:** `/games`
- **Main purpose:** Central hub for viewing all games and accessing game
  management
- **Key information to display:**
  - List of all games (past and upcoming)
  - Game date, status, and scores
  - Quick access to game details
  - Admin actions for game management
- **Key view components:**
  - Header with "Create New Game" button (admin only)
  - Responsive data table
  - Status badges (Upcoming/Completed)
  - Score display for completed games
  - Action buttons (View/Edit/Delete)
  - Empty state message when no games exist
  - Pagination controls
- **Server actions:**
  - `getGames(filters)` - Fetches games list with optional filtering/pagination
  - `deleteGame(gameId)` - Removes game (admin only)
- **UX, accessibility, and security considerations:**
  - Sortable columns (date, status)
  - Mobile-responsive table with horizontal scroll
  - Clickable rows for quick navigation
  - Confirmation dialog for destructive actions
  - Loading states during server action execution
  - Clear visual hierarchy for game status
  - Optimistic UI updates with revalidation

### Game Creation Wizard

- **View path:** `/games/new`
- **Main purpose:** Guide administrators through game setup and team generation
- **Key information to display:**
  - Current step progress
  - Step-specific forms and controls
  - AI-generated team propositions
  - Team balance metrics
- **Key view components:**
  - **Step 1 - Game Details:**
    - Date/time picker
    - Optional description field
    - Validation messages
  - **Step 2 - Player Selection:**
    - Player grid with checkboxes
    - Search/filter input
    - Select all/deselect all controls
    - Available player count
    - Minimum player requirement indicator
  - **Step 3 - Team Generation:**
    - Generate button with loading state
    - Three proposition cards displayed side-by-side
    - Drag-and-drop zones for manual adjustment
    - Team balance indicators
    - Select button for each proposition
    - Regenerate option
  - **Navigation:**
    - Progress indicator (Step X of 3)
    - Previous/Next buttons
    - Cancel with confirmation
- **Server actions:**
  - `validateGameDate(date)` - Checks for duplicate games on date
  - `getAvailablePlayers()` - Fetches active player roster
  - `generateTeamPropositions(playerIds)` - AI generates three balanced teams
  - `saveGameWithTeams(gameData)` - Persists game and selected team composition
- **UX, accessibility, and security considerations:**
  - State preservation across steps (using client state)
  - Clear step instructions
  - Visual feedback for drag-and-drop
  - Keyboard navigation support
  - Confirmation before final selection
  - Error recovery without data loss
  - Server actions validate all data server-side
  - Loading states during AI team generation

### Game Details

- **View path:** `/games/[id]`
- **Main purpose:** Display complete game information and team compositions
- **Key information to display:**
  - Game date and time
  - Selected teams with player lists
  - Game results (if completed)
  - Team balance information (admin only)
- **Key view components:**
  - Game header with date/status
  - Two-column team display
  - PlayerCard components for each player
  - Results section (scores if completed)
  - "Enter Results" button/modal (admin only)
  - Print button with optimized layout
  - Back navigation to games list
- **Server actions:**
  - `getGameById(gameId)` - Fetches complete game data with teams
  - `updateGameResults(gameId, scores)` - Saves final scores (admin only)
- **UX, accessibility, and security considerations:**
  - Print-optimized CSS styles
  - Conditional rendering based on user role
  - Mobile-responsive team layout
  - Clear team identification (Team 1/Team 2)
  - Accessible modal for result entry
  - Server actions enforce role-based permissions

### Players Management

- **View path:** `/players`
- **Main purpose:** Manage the complete player roster
- **Key information to display:**
  - Complete player list
  - Player details (name, skill tier, positions)
  - Add/edit/delete capabilities (admin)
- **Key view components:**
  - Collapsible "Add Player" form (admin only)
    - Name input
    - Skill tier selector (S/A/B/C/D)
    - Position checkboxes (PG/SG/SF/PF/C)
  - Players table/list
    - Name column (all users)
    - Skill tier column (admin only)
    - Positions column (admin only)
    - Action buttons (admin only)
  - Inline edit mode (admin)
  - Delete confirmation dialog
- **Server actions:**
  - `getPlayers()` - Fetches player list
  - `createPlayer(playerData)` - Adds new player (admin only)
  - `updatePlayer(playerId, playerData)` - Updates player info (admin only)
  - `deletePlayer(playerId)` - Removes player (admin only)
- **UX, accessibility, and security considerations:**
  - Graceful degradation for non-admin users
  - Optimistic UI updates with error recovery
  - Batch operations support
  - Mobile-friendly table layout
  - Clear visual feedback for CRUD operations
  - All mutations validated via server actions
  - Automatic revalidation after changes

### User Management

- **View path:** `/users`
- **Main purpose:** Administrator manages system users
- **Key information to display:**
  - List of all users
  - User roles and creation dates
  - User management actions
- **Key view components:**
  - Users table
    - Username, role, created date columns
    - Delete action buttons
  - Confirmation dialogs for deletions
- **Server actions:**
  - `getUsers()` - Fetches all users (admin only)
  - `createUser(userData)` - Adds new user (admin only)
  - `deleteUser(userId)` - Removes user (admin only, prevents self-deletion)
- **UX, accessibility, and security considerations:**
  - Admin-only access enforcement via server actions
  - Password security requirements
  - Prevention of self-deletion (validated server-side)
  - Clear role indicators
  - Audit trail considerations
  - All operations validate admin role in server actions

## 3. User Journey Map

### Primary Journey: Admin Game Creation and Team Selection

1. **Authentication Phase**
   - Admin arrives at login page (/)
   - Enters credentials and submits form
   - Form calls `authenticateUser(credentials)` server action
   - Server action validates and sets auth cookie
   - System redirects to games list (/games)

2. **Game Initiation**
   - Page calls `getGames()` server action to load data
   - Admin views existing games in list
   - Clicks "Create New Game" button
   - Navigates to game creation wizard (/games/new)

3. **Game Configuration (Step 1)**
   - Selects date and time for the game
   - Optionally adds description
   - Form calls `validateGameDate(date)` on blur/change
   - Server action checks for duplicate games
   - Clicks "Next" to proceed

4. **Player Selection (Step 2)**
   - Page calls `getAvailablePlayers()` to load roster
   - Views complete player roster with checkboxes
   - Uses search to find specific players if needed
   - Selects available players (minimum 10 required)
   - System shows count and validates minimum client-side
   - Clicks "Next" to proceed

5. **Team Generation (Step 3)**
   - Clicks "Generate Teams" button
   - Calls `generateTeamPropositions(playerIds)` server action
   - System displays loading state during AI processing
   - Server action returns three propositions
   - Three propositions appear side-by-side
   - Reviews each proposition type:
     - Position-focused
     - Skill-balanced
     - General balanced
   - Optionally adjusts teams via drag-and-drop
   - Selects preferred proposition
   - Confirms selection in dialog
   - Calls `saveGameWithTeams(gameData)` server action
   - System saves and redirects to game details (/games/[id])

6. **Post-Game Activities**
   - After physical game completion
   - Admin returns to game details page
   - Page calls `getGameById(gameId)` to load data
   - Clicks "Enter Results" button
   - Enters scores in modal
   - Calls `updateGameResults(gameId, scores)` server action
   - Saves results with automatic revalidation

### Secondary Journey: Regular User Game Viewing

1. **Login**
   - User authenticates at login page via `authenticateUser()` action
   - Redirected to games list

2. **Browse Games**
   - Page loads games via `getGames()` server action
   - Views list of upcoming and past games
   - Clicks on specific game for details

3. **View Teams**
   - Page loads game data via `getGameById(gameId)` action
   - Sees team compositions (without skill information)
   - Can print team lineup for physical reference

### Auxiliary Journeys

**Player Management Flow (Admin):**

- Navigate to Players page
- Page calls `getPlayers()` server action
- Add new players via form calling `createPlayer(playerData)`
- Edit existing players inline calling `updatePlayer(playerId, data)`
- Delete players with confirmation calling `deletePlayer(playerId)`

**User Management Flow (Admin):**

- Navigate to Users page
- Page calls `getUsers()` server action
- Create new user accounts via `createUser(userData)`
- Delete users with confirmation via `deleteUser(userId)`

## 4. Layout and Navigation Structure

### Global Navigation Layout

```
┌─────────────────────────────────────────────────┐
│ [Logo] Basketball Team Selector                 │
│                                                  │
│ Games | Players | Users* | [Username] | Logout  │
└─────────────────────────────────────────────────┘
│                                                  │
│                 [Page Content]                   │
│                                                  │
└─────────────────────────────────────────────────┘

* Users link only visible to administrators
```

### Navigation Hierarchy

- **Public Routes:**
  - `/` - Login page
  - `/register` - Registration page

- **Protected Routes:**
  - `/games` - Games list (all authenticated users)
    - `/games/new` - Create game wizard (admin only)
    - `/games/[id]` - Game details (all authenticated users)
  - `/players` - Players management (all authenticated users)
  - `/users` - User management (admin only)

### Navigation Patterns

- **Breadcrumb Trail:** Not required due to shallow hierarchy
- **Tab Navigation:** Used within game creation wizard for steps
- **Contextual Actions:** Appear based on user role and current context
- **Mobile Navigation:** Responsive menu with hamburger toggle on small screens
- **Logout:** Calls `logoutUser()` server action to clear auth cookie

## 5. Key Components

### PlayerCard

Displays individual player information with role-based content visibility. Used
across team displays, propositions, and player lists. Conditionally shows skill
tier badge and position tags for administrators while displaying only names for
regular users. Supports drag-and-drop functionality in team adjustment
scenarios.

### TeamProposition

Container component for displaying AI-generated team suggestions. Renders team
header, list of PlayerCard components, and team metrics. Provides drop zones for
drag-and-drop player exchanges. Includes selection button and visual indicators
for team balance. Mobile-responsive with carousel layout on small screens.

### Navigation

Global navigation bar providing consistent access to main application sections.
Implements role-based menu visibility, active route highlighting, and user
session information. Includes logout functionality (via `logoutUser()` server
action) and mobile-responsive hamburger menu. Maintains fixed position for
constant accessibility.

### ResultsModal

Overlay dialog for entering game results post-completion. Contains score input
fields for each team with numeric validation. Calls `updateGameResults()` server
action on save. Provides save and cancel actions with confirmation. Implements
accessible modal patterns with focus management and keyboard navigation support.

### LoadingSpinner

Reusable loading indicator for asynchronous operations. Provides consistent
visual feedback during server action execution, AI generation, and form
submissions. Includes contextual loading messages for different operations.

### ErrorBoundary

Catches and gracefully handles component-level errors. Displays user-friendly
error messages with recovery options. Logs errors for debugging while
maintaining application stability. Handles server action errors appropriately.

### ConfirmationDialog

Reusable modal for confirming destructive actions. Used for deletion operations
and final selections. Provides clear action descriptions and cancel options.
Implements accessible dialog patterns. Executes server actions on confirmation.

### EmptyState

Displays helpful messages and actions when no data exists. Used for empty game
lists, player rosters, and search results. Provides contextual calls-to-action
based on user permissions.

### FormField

Standardized form input wrapper providing consistent styling, validation
display, and accessibility features. Handles label association, error messages,
and help text. Supports various input types with unified behavior. Compatible
with server action form submission patterns.

### DataTable

Responsive table component with sorting, filtering, and pagination. Adapts to
mobile screens with horizontal scrolling. Supports row actions calling server
actions for mutations. Implements accessible table markup. Handles optimistic
updates and revalidation.
