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
  - "Create new account" link
- **UX, accessibility, and security considerations:**
  - Auto-focus on username field
  - Password field with masked input
  - Clear error messages for failed authentication
  - Keyboard navigation support
  - Secure password handling (no client-side storage)
  - ARIA labels for screen readers

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
- **UX, accessibility, and security considerations:**
  - Real-time password strength feedback
  - Clear validation messages
  - Password requirements clearly stated

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
- **UX, accessibility, and security considerations:**
  - Sortable columns (date, status)
  - Mobile-responsive table with horizontal scroll
  - Clickable rows for quick navigation
  - Confirmation dialog for destructive actions
  - Loading states during data fetch
  - Clear visual hierarchy for game status

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
- **UX, accessibility, and security considerations:**
  - State preservation across steps
  - Clear step instructions
  - Visual feedback for drag-and-drop
  - Keyboard navigation support
  - Confirmation before final selection
  - Error recovery without data loss

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
- **UX, accessibility, and security considerations:**
  - Print-optimized CSS styles
  - Conditional rendering based on user role
  - Mobile-responsive team layout
  - Clear team identification (Team 1/Team 2)
  - Accessible modal for result entry

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
  - Search/filter input
  - Inline edit mode (admin)
  - Delete confirmation dialog
- **UX, accessibility, and security considerations:**
  - Graceful degradation for non-admin users
  - Optimistic UI updates with error recovery
  - Batch operations support
  - Mobile-friendly table layout
  - Clear visual feedback for CRUD operations

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
- **UX, accessibility, and security considerations:**
  - Admin-only access enforcement
  - Password security requirements
  - Prevention of self-deletion
  - Clear role indicators
  - Audit trail considerations

## 3. User Journey Map

### Primary Journey: Admin Game Creation and Team Selection

1. **Authentication Phase**
   - Admin arrives at login page (/)
   - Enters credentials and submits form
   - System validates and redirects to games list (/games)

2. **Game Initiation**
   - Admin views existing games in list
   - Clicks "Create New Game" button
   - Navigates to game creation wizard (/games/new)

3. **Game Configuration (Step 1)**
   - Selects date and time for the game
   - Optionally adds description
   - Validates no duplicate games on selected date
   - Clicks "Next" to proceed

4. **Player Selection (Step 2)**
   - Views complete player roster with checkboxes
   - Uses search to find specific players if needed
   - Selects available players (minimum 10 required)
   - System shows count and validates minimum
   - Clicks "Next" to proceed

5. **Team Generation (Step 3)**
   - Clicks "Generate Teams" button
   - System displays loading state during AI processing
   - Three propositions appear side-by-side
   - Reviews each proposition type:
     - Position-focused
     - Skill-balanced
     - General balanced
   - Optionally adjusts teams via drag-and-drop
   - Selects preferred proposition
   - Confirms selection in dialog
   - System saves and redirects to game details (/games/[id])

6. **Post-Game Activities**
   - After physical game completion
   - Admin returns to game details page
   - Clicks "Enter Results" button
   - Enters scores in modal
   - Saves results

### Secondary Journey: Regular User Game Viewing

1. **Login**
   - User authenticates at login page
   - Redirected to games list

2. **Browse Games**
   - Views list of upcoming and past games
   - Clicks on specific game for details

3. **View Teams**
   - Sees team compositions (without skill information)
   - Can print team lineup for physical reference

### Auxiliary Journeys

**Player Management Flow (Admin):**

- Navigate to Players page
- Add new players via form
- Edit existing players inline
- Delete players with confirmation

**User Management Flow (Admin):**

- Navigate to Users page
- Create new user accounts
- Manage existing users
- Delete users with confirmation

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
session information. Includes logout functionality and mobile-responsive
hamburger menu. Maintains fixed position for constant accessibility.

### ResultsModal

Overlay dialog for entering game results post-completion. Contains score input
fields for each team with numeric validation. Provides save and cancel actions
with confirmation. Implements accessible modal patterns with focus management
and keyboard navigation support.

### LoadingSpinner

Reusable loading indicator for asynchronous operations. Provides consistent
visual feedback during data fetching, AI generation, and form submissions.
Includes contextual loading messages for different operations.

### ErrorBoundary

Catches and gracefully handles component-level errors. Displays user-friendly
error messages with recovery options. Logs errors for debugging while
maintaining application stability.

### ConfirmationDialog

Reusable modal for confirming destructive actions. Used for deletion operations
and final selections. Provides clear action descriptions and cancel options.
Implements accessible dialog patterns.

### EmptyState

Displays helpful messages and actions when no data exists. Used for empty game
lists, player rosters, and search results. Provides contextual calls-to-action
based on user permissions.

### FormField

Standardized form input wrapper providing consistent styling, validation
display, and accessibility features. Handles label association, error messages,
and help text. Supports various input types with unified behavior.

### DataTable

Responsive table component with sorting, filtering, and pagination. Adapts to
mobile screens with horizontal scrolling. Supports row actions and bulk
operations. Implements accessible table markup.
