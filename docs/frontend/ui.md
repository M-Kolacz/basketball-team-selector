# UI Architecture for Basketball Team Selector

## 1. UI Structure Overview

Single-page application with role-based views. Fixed header with hamburger
navigation. Server-driven state via database. Forms use Conform validation with
explicit submissions. Desktop-optimized with mobile responsiveness at md:768px
breakpoint.

## 2. View List

### Login (/login)

- **Path**: /login
- **Purpose**: User authentication entry point
- **Key information**: Username/password fields, error messages
- **Components**:
  - Form with Conform validation
  - Submit button with loading state
  - Link to signup
- **Considerations**: Auto-focus username, password visibility toggle, redirect
  to intended page after login

### Sign Up (/signup)

- **Path**: /signup
- **Purpose**: New user registration
- **Key information**: Username, password, confirm password
- **Components**:
  - Form with real-time validation
  - Password match indicator
  - Submit with loading state
- **Considerations**: Username availability check, password strength
  requirements, accessible error announcements

### Dashboard (/)

- **Path**: /
- **Purpose**: Game overview and quick actions
- **Key information**: Next game, recent results (3-5 games)
- **Components**:
  - Single section layout
  - Game cards with inline scores
  - Action buttons (admin only)
  - Empty state messages
- **Considerations**: Role-based content (hide skills from users), responsive
  card layout

### Players Management (/players)

- **Path**: /players
- **Purpose**: Roster CRUD operations
- **Key information**: Player list with skills/positions (admin view)
- **Components**:
  - Shadcn Table
  - Add player form (admin)
  - Icon buttons for edit/delete (admin)
  - Position checkboxes
- **Considerations**: Immediate deletion without confirm, role-based column
  visibility

### Create Game (/games/new)

- **Path**: /games/new
- **Purpose**: Initialize game session with player selection
- **Key information**: Date/time, available players
- **Components**:
  - Single combined form
  - datetime-local input
  - Player checkbox list
  - Player count (10-20 validation)
  - Submit with loading
- **Considerations**: Min/max player validation, future date requirement, lock
  during submission

### Game Propositions (/games/[id]/propositions)

- **Path**: /games/[id]/propositions
- **Purpose**: Review/adjust AI teams
- **Key information**: 3 team propositions with different balancing
- **Components**:
  - Side-by-side cards (stacked mobile)
  - Drag-drop player lists
  - Drop zone highlighting
  - Player count badges
  - Selection buttons
- **Considerations**: UI lock during generation, visual feedback for valid
  drops, handle odd player counts

### Game Details (/games/[id])

- **Path**: /games/[id]
- **Purpose**: View teams and record results
- **Key information**: Final teams, scores, all propositions
- **Components**:
  - Team display cards
  - Score input fields (admin)
  - Proposition history
  - Selected indicator
- **Considerations**: Read-only for users, score validation (0-200), show
  generation history

### Game History (/games)

- **Path**: /games
- **Purpose**: Browse all past games
- **Key information**: Date, teams, scores list
- **Components**:
  - Game list/table
  - Inline score display
  - Click for details
  - No pagination (load all)
- **Considerations**: Absolute datetime format, descending order, responsive
  table

## 3. User Journey Map

**Primary Flow (Admin creates game):**

1. Login → Dashboard
2. Dashboard → "New Game" button → Create Game
3. Select date/time + choose 10-20 players → Submit
4. Auto-redirect → Game Propositions (AI generates)
5. Review 3 options → Optional drag-drop adjustments
6. Select proposition → Redirect to Game Details
7. Post-game: Enter scores → Submit → Updates history

**Secondary Flows:**

- User views games: Login → Dashboard → Game History → Game Details (read-only)
- Admin manages roster: Dashboard → Players → Add/Edit/Delete operations
- Quick game check: Dashboard shows next game + recent results

## 4. Layout and Navigation Structure

**Header (fixed):**

- Logo/Title (links to dashboard)
- Hamburger menu (mobile/desktop):
  - Dashboard
  - Players
  - Games
  - New Game (admin only)
  - Logout

**Layout:**

- Fixed header height: 64px
- Main content area with padding
- Max-width container (1280px)
- Responsive breakpoint: md (768px)

**Navigation patterns:**

- Server redirects after actions
- No breadcrumbs
- Direct action buttons on relevant pages
- URL-based routing

<!-- ## 5. Key Components

**FormField**: Conform-integrated input with inline errors, loading states

**PlayerCheckboxList**: Multi-select with count badge, min/max validation

**TeamCard**: Player list display, drag-drop support, skill tier badges

**GameCard**: Compact game display with date, teams, inline scores

**DataTable**: Shadcn Table wrapper with role-based columns, action buttons

**LoadingButton**: Submit button with spinner, disabled during action

**DragDropZone**: Visual highlighting, player swap logic, touch support

**EmptyState**: Text-only messages for no data scenarios

**RoleGuard**: Conditional rendering based on user.role

**ErrorBoundary**: Catch server action failures, show retry options -->
