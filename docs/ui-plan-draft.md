# UI Architecture Plan - Basketball Team Selector MVP

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
- API validation errors (422) mapped to specific fields
- 401 errors redirect to login page
- 403 errors show "Insufficient permissions" inline
- No toast notifications or error modals

## 6. Loading States

- Route-level: Next.js `loading.tsx` with centered spinner
- Component-level: Simple inline "Loading..." text
- AI generation: Inline message "Generating teams..."

## 7. Form Patterns

- Basic HTML form elements
- Inline validation on submit
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
- 401 responses trigger redirect to login
- No refresh token logic
- No "Remember me" functionality

## 10. Data Fetching

- Server Components where possible (Next.js 15)
- Client Components only for interactivity
- No client-side caching strategies
- Direct API calls using fetch
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

## 12. API Integration Points

### Authentication

- `POST /api/auth/login` - Login form
- `POST /api/auth/logout` - Logout button
- `POST /api/auth/register` - Registration (if needed)

### Games

- `GET /api/game-sessions` - Games list
- `POST /api/game-sessions` - Create game (step 1)
- `PUT /api/game-sessions/{id}/available-players` - Set players (step 2)
- `POST /api/game-sessions/{id}/propositions/generate` - Generate teams (step 3)
- `PUT /api/game-sessions/{id}/select-proposition` - Select final teams
- `PUT /api/game-sessions/{id}/results` - Enter results

### Players

- `GET /api/players` - Players list
- `POST /api/players` - Add player
- `PUT /api/players/{id}` - Edit player
- `DELETE /api/players/{id}` - Delete player

### Users

- `GET /api/users` - Users list
- `POST /api/users` - Add user
- `DELETE /api/users/{id}` - Delete user

## 13. Technical Decisions

- **Routing**: Next.js App Router (v15.5)
- **Styling**: Tailwind CSS v4
- **Components**: Shadcn/ui for base components
- **Drag & Drop**: @dnd-kit/sortable
- **Forms**: Native HTML forms with React
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
├── api/
│   └── [...API routes]
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
expanded later.
