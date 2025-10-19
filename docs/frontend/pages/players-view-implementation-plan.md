# View Implementation Plan: Players Management

## 1. Overview

The Players Management view provides a comprehensive interface for managing the
basketball player roster. Admin users can add, edit, and delete players with
full access to skill tier and position information, while regular users have
read-only access to basic player information (name and creation date). The view
implements role-based rendering, and comprehensive CRUD operations with
validation and error handling.

## 2. View Routing

- **Path**: `/players`
- **Access**: Authenticated users only (redirects to `/login` if
  unauthenticated)
- **Role-based rendering**: Different UI elements visible based on user role
  (Admin vs User)

## 3. Component Structure

```
PlayersPage (Server Component)
├── PlayersList (Client Component)
│   ├── AddPlayerForm (Client Component - Admin only)
│   │   ├── Input (name field)
│   │   ├── Select (skill tier dropdown)
│   │   └── CheckboxGroup (positions)
│   ├── PlayersTable (Client Component)
│   │   ├── TableHeader
│   │   │   ├── SearchInput
│   │   │   ├── FilterControls (Admin only)
│   │   │   └── BulkActionBar (Admin only)
│   │   ├── TableBody
│   │   │   └── PlayerRow (multiple instances)
│   │   │       ├── PlayerCell (name - all users)
│   │   │       ├── SkillTierCell (Admin only)
│   │   │       ├── PositionsCell (Admin only)
│   │   │       └── ActionsCell (Admin only)
│   │   │           ├── EditButton
│   │   │           └── DeleteButton
│   │   └── TableFooter
│   │       └── SortControls
│   ├── EditPlayerDialog (Client Component - Admin only)
│   │   ├── Input (name field)
│   │   ├── Select (skill tier dropdown)
│   │   └── CheckboxGroup (positions)
│   └── DeleteConfirmationDialog (Client Component - Admin only)
└── ErrorBoundary
```

## 4. Component Details

### PlayersPage (Server Component)

- **Description**: Root page component that fetches initial player data and
  determines user role for conditional rendering.
- **Main elements**:
  - Page container with proper metadata
  - PlayersList component (client component for interactivity)
- **Handled interactions**: None (server component)
- **Handled validation**: Authentication check (redirects if not authenticated)
- **Types**:
  - `PlayerAdminDto[]` or `PlayerUserDto[]` (from server action)
  - `UserRole` (from auth context)
- **Props**: None (page component)

**Implementation details**:

```typescript
// File: src/app/players/page.tsx
export const metadata: Metadata = {
  title: 'Players - Basketball Team Selector',
  description: 'Manage player roster'
}

export default async function PlayersPage() {
  const players = await getPlayers()
  return <PlayersList initialPlayers={players} />
}
```

### PlayersList (Client Component)

- **Description**: Main container component managing player list state and bulk
  operations.
- **Main elements**:
  - Collapsible AddPlayerForm (admin only)
  - PlayersTable with all player rows
  - EditPlayerDialog modal
  - DeleteConfirmationDialog modal
  - Toast notifications for success/error feedback
- **Handled interactions**:
  - Bulk selection state
  - Bulk action triggers
- **Handled validation**: None (delegates to child components)
- **Types**:
  - `PlayersListViewModel` (custom type)
  - `PlayerAdminDto` or `PlayerUserDto`
  - `BulkSelectionState` (custom type)
- **Props**:

```typescript
interface PlayersListProps {
	initialPlayers: PlayerAdminDto[] | PlayerUserDto[]
}
```

### AddPlayerForm (Client Component - Admin only)

- **Description**: Collapsible form for creating new players. Validates input
  and provides real-time feedback. Hidden for non-admin users.
- **Main elements**:
  - Collapsible trigger button ("Add Player")
  - Form with controlled inputs:
    - Text input for player name
    - Select dropdown for skill tier (S/A/B/C/D)
    - Checkbox group for positions (PG/SG/SF/PF/C)
  - Submit button
  - Cancel/Reset button
- **Handled interactions**:
  - Form collapse/expand toggle
  - Input field changes with validation
  - Form submission
  - Form reset/cancel
- **Handled validation**:
  - Name: Required, min 2 characters, max 50 characters
  - Skill tier: Required, must be one of S/A/B/C/D
  - Positions: Required, at least 1 position must be selected
  - Duplicate name warning (client-side check against current players list)
- **Types**:
  - `AddPlayerFormData` (view model)
  - `CreatePlayerCommandDto`
  - `ValidationErrors` (custom type)
- **Props**:

```typescript
interface AddPlayerFormProps {
	onPlayerAdded: (player: PlayerAdminDto) => void
	existingPlayerNames: string[]
}
```

### PlayersTable (Client Component)

- **Description**: Data table displaying player information with role-based
  column visibility, and bulk selection capabilities.
- **Main elements**:
  - Table header with:
    - Search input
    - Select all checkbox (admin only)
    - Bulk action menu (admin only, visible when selections exist)
  - Table body with PlayerRow components
  - Table footer with sort controls
  - Empty state when no players match filters
- **Handled interactions**:
  - Select all checkbox toggle
  - Individual row selection
- **Handled validation**: None (display component)
- **Types**:
  - `PlayerTableViewModel` (custom type)
  - `SortOption` (custom type)
  - `FilterState` (custom type)
- **Props**:

```typescript
interface PlayersTableProps {
	players: PlayerAdminDto[] | PlayerUserDto[]
	isAdmin: boolean
	searchQuery: string
	onSearchChange: (query: string) => void
	sortBy: SortOption
	onSortChange: (sort: SortOption) => void
	selectedPlayerIds: Set<string>
	onSelectionChange: (playerIds: Set<string>) => void
	onEdit: (playerId: string) => void
	onDelete: (playerId: string) => void
}
```

### PlayerRow (Client Component)

- **Description**: Individual table row displaying player information with
  inline edit/delete actions for admins.
- **Main elements**:
  - Selection checkbox (admin only)
  - Name cell
  - Skill tier cell (admin only)
  - Positions cell with badge display (admin only)
  - Actions cell with edit/delete buttons (admin only)
- **Handled interactions**:
  - Row selection checkbox toggle
  - Edit button click
  - Delete button click
- **Handled validation**: None (display component)
- **Types**:
  - `PlayerAdminDto` or `PlayerUserDto`
- **Props**:

```typescript
interface PlayerRowProps {
	player: PlayerAdminDto | PlayerUserDto
	isAdmin: boolean
	isSelected: boolean
	onSelect: (playerId: string, selected: boolean) => void
	onEdit: (playerId: string) => void
	onDelete: (playerId: string) => void
}
```

### EditPlayerDialog (Client Component - Admin only)

- **Description**: Modal dialog for editing existing player information.
  Pre-populates with current values and validates changes.
- **Main elements**:
  - Modal overlay and dialog container
  - Form with controlled inputs:
    - Text input for player name (pre-filled)
    - Select dropdown for skill tier (pre-filled)
    - Checkbox group for positions (pre-filled)
  - Save button
  - Cancel button
  - Loading state during save
- **Handled interactions**:
  - Dialog open/close
  - Input field changes with validation
  - Form submission
  - Cancel action
- **Handled validation**:
  - Name: Required, min 2 characters, max 50 characters
  - Skill tier: Required, must be one of S/A/B/C/D
  - Positions: Required, at least 1 position must be selected
  - Check if any changes were made (disable save if no changes)
- **Types**:
  - `EditPlayerFormData` (view model)
  - `UpdatePlayerCommandDto`
  - `PlayerAdminDto`
  - `ValidationErrors`
- **Props**:

```typescript
interface EditPlayerDialogProps {
	player: PlayerAdminDto | null
	isOpen: boolean
	onClose: () => void
	onPlayerUpdated: (player: PlayerAdminDto) => void
}
```

### DeleteConfirmationDialog (Client Component - Admin only)

- **Description**: Modal dialog confirming player deletion with player name
  display and warning message.
- **Main elements**:
  - Modal overlay and dialog container
  - Warning icon
  - Player name display
  - Warning message text
  - Confirm delete button (destructive style)
  - Cancel button
  - Loading state during deletion
- **Handled interactions**:
  - Dialog open/close
  - Confirm deletion
  - Cancel deletion
- **Handled validation**: None (confirmation only)
- **Types**:
  - `PlayerAdminDto` or `PlayerUserDto`
- **Props**:

```typescript
interface DeleteConfirmationDialogProps {
	player: PlayerAdminDto | PlayerUserDto | null
	isOpen: boolean
	onClose: () => void
	onConfirmDelete: (playerId: string) => void
}
```

### BulkActionBar (Client Component - Admin only)

- **Description**: Action bar that appears when players are selected, providing
  bulk operations menu.
- **Main elements**:
  - Selected count display
  - Dropdown menu with bulk actions
  - Clear selection button
- **Handled interactions**:
  - Bulk action selection
  - Clear all selections
- **Handled validation**: Minimum 1 player must be selected
- **Types**:
  - `BulkAction` (enum/type)
- **Props**:

```typescript
interface BulkActionBarProps {
	selectedCount: number
	onBulkAction: (action: BulkAction) => void
	onClearSelection: () => void
}
```

## 5. Types

### DTOs (from `src/types/dto.ts`)

Already defined in the codebase:

```typescript
// Admin response - full player details
export type PlayerAdminDto = Pick<
	Player,
	'id' | 'name' | 'skillTier' | 'positions' | 'createdAt' | 'updatedAt'
>

// User response - limited player details
export type PlayerUserDto = Pick<Player, 'id' | 'name' | 'createdAt'>

// Create player command
export type CreatePlayerCommandDto = {
	name: string
	skillTier: SkillTier
	positions: Position[]
}

// Update player command
export type UpdatePlayerCommandDto = Partial<CreatePlayerCommandDto>

// Enums
export type SkillTier = 'S' | 'A' | 'B' | 'C' | 'D'
export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C'
```

### View Models (New - in component files or shared types)

```typescript
// File: src/app/players/types.ts

export type SortOption = 'name' | 'skill_tier' | 'created_at'

export type FilterState = {
	skillTier?: SkillTier
	position?: Position
	searchQuery: string
}

export type BulkSelectionState = {
	selectedPlayerIds: Set<string>
	isAllSelected: boolean
}

export type BulkAction =
	| 'mark_available'
	| 'mark_unavailable'
	| 'delete_selected'

export type PlayersListViewModel = {
	players: PlayerAdminDto[] | PlayerUserDto[]
	filteredPlayers: PlayerAdminDto[] | PlayerUserDto[]
	isAdmin: boolean
	filterState: FilterState
	sortBy: SortOption
	bulkSelection: BulkSelectionState
}

export type AddPlayerFormData = {
	name: string
	skillTier: SkillTier | ''
	positions: Position[]
}

export type EditPlayerFormData = {
	name: string
	skillTier: SkillTier
	positions: Position[]
}

export type ValidationErrors = {
	name?: string[]
	skillTier?: string[]
	positions?: string[]
}

export type FormState =
	| { status: 'idle' }
	| { status: 'submitting' }
	| { status: 'success'; message: string }
	| { status: 'error'; message: string; errors?: ValidationErrors }
```

### Position Display Constants

```typescript
// File: src/app/players/constants.ts

export const POSITION_LABELS: Record<Position, string> = {
	PG: 'Point Guard',
	SG: 'Shooting Guard',
	SF: 'Small Forward',
	PF: 'Power Forward',
	C: 'Center',
}

export const SKILL_TIER_LABELS: Record<SkillTier, string> = {
	S: 'S-Tier',
	A: 'A-Tier',
	B: 'B-Tier',
	C: 'C-Tier',
	D: 'D-Tier',
}

export const SKILL_TIER_COLORS: Record<SkillTier, string> = {
	S: 'bg-purple-100 text-purple-800',
	A: 'bg-blue-100 text-blue-800',
	B: 'bg-green-100 text-green-800',
	C: 'bg-yellow-100 text-yellow-800',
	D: 'bg-gray-100 text-gray-800',
}
```

## 7. Server Action Integration

### Available Server Actions

The view integrates with the following server actions from
`src/actions/players.ts`:

#### `getPlayers()`

**Purpose**: Fetch all players with role-based field filtering

**Return Type** (Admin):

```typescript
{
  success: true
  players: PlayerAdminDto[]  // includes skillTier and positions
}
```

**Return Type** (User):

```typescript
{
  success: true
  players: PlayerUserDto[]  // only id, name, createdAt
}
```

**Usage**: Called once on initial page load (server-side) to fetch initial
player list.

## 8. User Interactions

### 8.1 View Player List (All Users)

**Trigger**: Page load

**Flow**:

1. User navigates to `/players`
2. Server component fetches players via `getPlayers()`
3. Players displayed in table
4. Admin users see all columns (name, skill tier, positions, actions)
5. Regular users see limited columns (name, created date)

**Expected outcome**: Player list displayed with role-appropriate columns

### 8.5 Add New Player (Admin Only)

**Trigger**: Admin clicks "Add Player" and submits form

**Flow**:

1. Admin clicks "Add Player" button (form expands)
2. Admin fills in name, selects skill tier, checks positions
3. Client-side validation runs on blur/change
4. Admin clicks "Submit"
5. Form validation runs (all fields required, name min 2 chars, duplicate check)
6. If valid:
   - Optimistic update: temp player added to list
   - Server action `createPlayer()` called
   - On success: temp player replaced with real player, success toast shown
   - On error: optimistic update reverted, error toast shown with details
7. Form resets and collapses

**Expected outcome**: New player appears in list immediately (optimistic),
confirmed via server action

### 8.6 Edit Player (Admin Only)

**Trigger**: Admin clicks edit button on player row

**Flow**:

1. Admin clicks edit icon in actions column
2. Edit dialog opens with pre-filled form (current player data)
3. Admin modifies fields
4. Client-side validation runs
5. Admin clicks "Save"
6. If valid:
   - Optimistic update: player data updated in list
   - Server action `updatePlayer()` called
   - On success: success toast shown, dialog closes
   - On error: optimistic update reverted, error shown in dialog
7. Admin can cancel to close dialog without changes

**Expected outcome**: Player information updated immediately (optimistic),
confirmed via server action

### 8.7 Delete Player (Admin Only)

**Trigger**: Admin clicks delete button and confirms

**Flow**:

1. Admin clicks delete icon in actions column
2. Confirmation dialog opens showing player name and warning
3. Admin clicks "Confirm Delete"
4. Optimistic update: player removed from list
5. Server action `deletePlayer()` called
6. On success: success toast shown, dialog closes
7. On error:
   - If `PLAYER_IN_USE`: optimistic update reverted, error toast explains player
     is in active games
   - Other errors: optimistic update reverted, generic error shown

**Expected outcome**: Player removed from list immediately (optimistic),
confirmed via server action

### 8.8 Bulk Selection (Admin Only)

**Trigger**: Admin checks player selection checkboxes

**Flow**:

1. Admin checks individual player checkboxes or "select all"
2. `selectedPlayerIds` state updates
3. Bulk action bar appears showing count
4. Admin can clear selection or perform bulk action
5. Bulk actions (future feature) trigger confirmation dialogs

**Expected outcome**: Visual feedback of selection state, bulk action bar
displayed

## 9. Conditions and Validation

### 9.1 Authentication Conditions

**Component**: PlayersPage (server component)

**Condition**: User must be authenticated

**Verification**:

- Server action `getPlayers()` checks authentication
- If not authenticated, redirects to `/login`

**UI Impact**: Page only renders for authenticated users

## 11. Implementation Steps

### Step 1: Set up file structure

Create necessary files and directories:

- `src/app/players/page.tsx` - Server component page
- `src/app/players/types.ts` - View models and types
- `src/app/players/constants.ts` - Display constants
- `src/app/players/utils.ts` - Helper functions
- `src/app/players/hooks/usePlayerManagement.ts` - Custom state hook
- `src/app/players/components/PlayersList.tsx` - Main client component
- `src/app/players/components/AddPlayerForm.tsx`
- `src/app/players/components/PlayersTable.tsx`
- `src/app/players/components/PlayerRow.tsx`
- `src/app/players/components/EditPlayerDialog.tsx`
- `src/app/players/components/DeleteConfirmationDialog.tsx`
- `src/app/players/components/BulkActionBar.tsx`

### Step 2: Implement type definitions

1. Create view model types in `types.ts`
2. Define constants in `constants.ts` (position labels, skill tier colors)
3. Export all types for use across components

### Step 3: Implement helper functions

1. Create `filterAndSortPlayers()` function in `utils.ts`
2. Implement validation functions:
   - `validatePlayerName()`
   - `validatePositions()`
   - `validateSkillTier()`
3. Add error formatting helpers
4. Add date formatting helpers for display

### Step 4: Build presentation components (bottom-up)

**5.1 PlayerRow component**

- Accept player data and callbacks as props
- Render cells conditionally based on `isAdmin` prop
- Implement selection checkbox (admin only)
- Add edit/delete buttons (admin only)
- Add hover effects and visual feedback

**5.2 BulkActionBar component**

- Display selected count
- Render action menu
- Implement clear selection button
- Add slide-in animation

**5.3 DeleteConfirmationDialog component**

- Create modal with Shadcn Dialog component
- Display player name and warning
- Add confirm/cancel buttons
- Implement loading state

**5.4 AddPlayerForm component**

- Create collapsible form with Shadcn Collapsible
- Add controlled inputs for all fields
- Implement real-time validation
- Add submit/cancel handlers
- Display validation errors inline

**5.5 EditPlayerDialog component**

- Create modal with Shadcn Dialog
- Pre-populate form with player data
- Implement controlled inputs with validation
- Add save/cancel handlers
- Track dirty state (changes made)

**5.6 PlayersTable component**

- Build table structure with Shadcn Table components
- Implement search input with debouncing
- Add filter controls (admin only)
- Create select-all checkbox (admin only)
- Render PlayerRow components
- Add empty state component
- Implement responsive mobile layout

### Step 5: Build container component

**PlayersList component**

- Render all child components
- Pass state and callbacks as props
- Implement server action integration
- Add toast notifications (Shadcn Sonner)
- Handle optimistic updates and rollbacks

### Step 7: Create server page component

**PlayersPage component**

- Add page metadata
- Call `getPlayers()` server action
- Determine user role
- Render PlayersList with initial data
- Add error boundary

### Step 10: Styling and responsive design

1. Add Tailwind classes for layout and spacing
2. Implement responsive breakpoints for mobile/tablet/desktop
3. Add dark mode support (if required)
4. Create loading skeletons for async operations
5. Add animations and transitions (subtle)
6. Ensure accessibility (ARIA labels, keyboard navigation)

### Step 13: Integration with navigation

1. Add "Players" link to main navigation menu
2. Highlight active route when on `/players`
3. Add route guards if needed
4. Test navigation flow from other pages
