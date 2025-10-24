You are a qualified frontend architect whose task is to create a comprehensive
user interface architecture based on the Product Requirements Document (PRD),
server actions plan, and planning session notes. Your goal is to design a user
interface structure that effectively meets product requirements, is compatible
with server actions capabilities, and incorporates insights from the planning
session.

First, carefully review the following documents:

Product Requirements Document (PRD): <prd> @prd.md </prd>

Server Actions Plan: <server_actions_plan> @server-actions-plan.md
</server_actions_plan>

Session Notes: <session_notes> # UI Architecture Plan - Basketball Team Selector
MVP

## 1. Route Structure

```
/                           → Login page (public)
/games                      → Games list (authenticated)
/games/new                  → Create game wizard (admin)
/games/[id]                 → Game details view (authenticated)
/players                    → Players management (authenticated)
/users                      → User management (admin)
```

## 2. Page Components

### Login Page (`/`)

- Simple centered form with username/password fields
- Single "Login" button
- Basic client-side validation
- Redirects to `/games` on success
- Inline error display for 401 responses

### Games List (`/games`)

- Basic HTML table with responsive wrapper
- Columns: Date, Status (Upcoming/Completed), Actions
- Admin actions: Create New, Edit, Delete buttons
- User view: Read-only table with clickable rows
- Uses Next.js `loading.tsx` for loading state

### Game Creation Wizard (`/games/new`)

- Single-page with 3 steps:
  - **Step 1**: Date/time picker form
  - **Step 2**: Player selection grid with checkboxes, search filter, bulk
    select
  - **Step 3**: Team generation and selection
    - Generate button → 3 team propositions in cards
    - Drag-and-drop adjustment using @dnd-kit/sortable
    - Select button for final choice
- Progress indicator: "Step X of 3"
- Previous/Next navigation buttons
- State maintained across steps using React useState

### Game Details (`/games/[id]`)

- Display selected teams in two columns
- Show game date, status, and results if completed
- Admin: Add results button (opens modal)
- CSS print styles for team printout

### Players Management (`/players`)

- Collapsible add-player form at top (admin only)
- Table/list of all players below
- Admin view: Shows name, skill tier, positions, inline edit/delete
- User view: Shows names only
- Inline editing using simple input fields
- Delete with `window.confirm()`

### User Management (`/users`)

- Admin-only page
- Add user form at top
- Table of users with username, role, created date
- Delete users with confirmation

## 3. Shared Components

### PlayerCard

```jsx
- Displays player name (always)
- Conditionally shows skill tier badge (admin only)
- Conditionally shows position tags (admin only)
- Used in team propositions and game details
```

### TeamProposition

```jsx
- Card layout with header "Team 1" / "Team 2"
- Vertical list of PlayerCard components
- Drag-and-drop zones for admin adjustments
- No additional statistics or metrics
```

### Navigation

```jsx
- Simple top navigation bar
- Logo/title on left
- Menu items based on user role
- Logout button on right
```

### ResultsModal

```jsx
- Simple modal for entering game results
- Score input fields for each team
- Save and Cancel buttons
- Basic validation for numeric scores
```

## 4. State Management

- Local component state using React useState
- No global state management
- No client-side caching
- JWT token stored only in httpOnly cookie
- Role-based rendering using JWT claims

## 5. Error Handling

- Inline error messages below form fields
- Server action validation errors mapped to specific fields
- Authentication failures redirect to login page
- Authorization failures show "Insufficient permissions" inline
- No toast notifications or error modals

## 6. Loading States

- Route-level: Next.js `loading.tsx` with centered spinner
- Component-level: Simple inline "Loading..." text
- AI generation: Inline message "Generating teams..."
- Form submission: `useFormStatus` for pending state

## 7. Form Patterns

- Server Actions with `action` attribute
- `useActionState` for form state management
- `useFormStatus` for submit button pending state
- Inline validation on submit via server actions
- Red text for error messages
- No real-time validation
- No optimistic updates

## 8. Responsive Design

- Mobile-first approach using Tailwind
- Tables with horizontal scroll on mobile
- Team propositions: Carousel on mobile, 3-column on desktop
- Breakpoint: 768px (md)

## 9. Authentication Flow

- All auth handled by httpOnly cookies
- No client-side token management
- Authentication checks in server actions
- No refresh token logic
- No "Remember me" functionality

## 10. Data Fetching

- Server Components where possible (Next.js 15)
- Client Components only for interactivity
- No client-side caching strategies
- Direct server action calls from Server Components
- Server action invocations from Client Components with useActionState
- No optimistic updates

## 11. User Flows

### Admin Flow

1. Login → Games List
2. Create New Game → 3-step wizard → Game Details
3. Manage Players → Add/Edit/Delete players
4. Enter Results → Modal → Save
5. Manage Users → Add/Delete users

### Regular User Flow

1. Login → Games List
2. View Game → See team compositions
3. View Players → See roster (no skill info)

## 12. Server Actions Integration Points

### Authentication

- `login(credentials)` - Login form submission
- `logout()` - Logout action
- `register(userData)` - Registration (if needed)

### Games

- `getGameSessions()` - Load games list
- `createGameSession(data)` - Create game (step 1)
- `setAvailablePlayers(id, playerIds)` - Set players (step 2)
- `generateTeamPropositions(id)` - Generate teams (step 3)
- `selectProposition(id, propositionId)` - Select final teams
- `updateGameResults(id, results)` - Enter results

### Players

- `getPlayers()` - Load players list
- `createPlayer(data)` - Add player
- `updatePlayer(id, data)` - Edit player
- `deletePlayer(id)` - Delete player

### Users

- `getUsers()` - Load users list
- `createUser(data)` - Add user
- `deleteUser(id)` - Delete user

## 13. Technical Decisions

- **Routing**: Next.js App Router (v15.5)
- **Styling**: Tailwind CSS v4
- **Components**: Shadcn/ui for base components
- **Drag & Drop**: @dnd-kit/sortable
- **Forms**: Server Actions with useActionState/useFormStatus
- **Modals**: Simple React portal implementation
- **Tables**: Basic HTML tables with Tailwind styling
- **Icons**: Lucide React for minimal icons

## 14. File Structure

```
app/
├── (auth)/
│   └── login/
│       └── page.tsx
├── (protected)/
│   ├── layout.tsx
│   ├── games/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── players/
│   │   └── page.tsx
│   └── users/
│       └── page.tsx
├── actions/
│   ├── auth.ts
│   ├── games.ts
│   ├── players.ts
│   └── users.ts
└── components/
    ├── PlayerCard.tsx
    ├── TeamProposition.tsx
    ├── Navigation.tsx
    ├── ResultsModal.tsx
    └── ui/
        └── [...shadcn components]
```

This architecture prioritizes simplicity and core functionality while avoiding
premature optimization, making it ideal for an MVP that can be built quickly and
expanded later. </session_notes>

Your task is to create a detailed user interface architecture that includes
necessary views, user journey mapping, navigation structure, and key elements
for each view. The design should consider user experience, accessibility, and
security.

Execute the following steps to complete the task:

1. Thoroughly analyze the PRD, server actions plan, and session notes.
2. Extract and list key requirements from the PRD.
3. Identify and list main server actions and their purposes.
4. Create a list of all necessary views based on the PRD, server actions plan,
   and session notes.
5. Determine the main purpose and key information for each view.
6. Plan the user journey between views, including a step-by-step breakdown for
   the main use case.
7. Design the navigation structure.
8. Propose key user interface elements for each view, considering UX,
   accessibility, and security.
9. Consider potential edge cases or error states.
10. Ensure the user interface architecture is compatible with the server actions
    plan.
11. Review and map all user stories from the PRD to the user interface
    architecture.
12. Explicitly map requirements to user interface elements.
13. Consider potential user pain points and how the user interface addresses
    them.

For each main step, work inside <ui_architecture_planning> tags in your thinking
block to break down your thought process before moving to the next step. This
section can be quite long. It's okay that this section can be quite long.

Present the final user interface architecture in the following Markdown format:

```markdown
# UI Architecture for [Product Name]

## 1. UI Structure Overview

[Provide a general overview of the UI structure]

## 2. View List

[For each view, provide:

- View name
- View path
- Main purpose
- Key information to display
- Key view components
- UX, accessibility, and security considerations]

## 3. User Journey Map

[Describe the flow between views and key user interactions]

## 4. Layout and Navigation Structure

[Explain how users will navigate between views]

## 5. Key Components

[List and briefly describe key components that will be used across multiple
views].
```

Focus exclusively on user interface architecture, user journey, navigation, and
key elements for each view. Do not include implementation details, specific
visual design, or code examples unless they are crucial to understanding the
architecture.

The final result should consist solely of the UI architecture in Markdown format
in English, which you will save in the .ai/ui-plan.md file. Do not duplicate or
repeat any work done in the thinking block.
