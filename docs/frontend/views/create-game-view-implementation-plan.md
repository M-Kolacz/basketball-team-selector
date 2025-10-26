# View Implementation Plan: Create Game

## 1. Overview

Admin-only form view for creating game sessions. Combines date/time selection with player roster selection (10-20 players). Submits to `createGameSessionAction`, validates future date and player count, redirects to `/games` on success.

## 2. View Routing

- **Path**: `/games/new`
- **Access**: Admin only (redirect non-admin to `/games`)
- **Page type**: Client component with server action integration

## 3. Component Structure

```
CreateGamePage (app/games/new/page.tsx)
└── CreateGameForm (app/games/new/create-game-form.tsx) [client]
    ├── Card (shadcn/ui)
    │   ├── CardHeader
    │   │   └── CardTitle
    │   └── CardContent
    │       ├── Form (HTML form element)
    │       │   ├── FieldGroup
    │       │   │   ├── Field (datetime)
    │       │   │   │   ├── FieldLabel
    │       │   │   │   ├── Input (type="datetime-local")
    │       │   │   │   └── FieldError
    │       │   │   ├── Field (description)
    │       │   │   │   ├── FieldLabel
    │       │   │   │   ├── Textarea
    │       │   │   │   └── FieldError
    │       │   │   ├── Field (players)
    │       │   │   │   ├── FieldLabel
    │       │   │   │   ├── PlayerCheckboxList
    │       │   │   │   │   └── Checkbox[] (one per player)
    │       │   │   │   ├── PlayerCountIndicator
    │       │   │   │   └── FieldError
    │       │   │   └── FieldError (form-level)
    │       │   └── ButtonGroup
    │       │       ├── Button (Cancel)
    │       │       └── Button (Submit)
```

## 4. Component Details

### CreateGamePage

- **Description**: Server component page wrapper, fetches players via `getPlayers()`, renders `CreateGameForm`
- **Main elements**:
  - Container div with layout classes
  - CreateGameForm client component
- **Handled events**: None (server component)
- **Validation**: None
- **Types**: `Players` from `getPlayers()`
- **Props**: None (page component)

### CreateGameForm

- **Description**: Client form component managing game creation state via Conform, integrates `createGameSessionAction`
- **Main elements**:
  - `<form>` with Conform integration
  - Card wrapper for visual structure
  - FieldGroup containing all input fields
  - Datetime input for `gameDatetime`
  - Textarea for optional `description`
  - PlayerCheckboxList for `playerIds` selection
  - PlayerCountIndicator showing selected count
  - Submit/Cancel buttons
- **Handled events**:
  - Form submission via `useActionState`
  - Checkbox changes for player selection
  - Input validation on blur/input (Conform)
  - Cancel button click (navigate to `/games`)
- **Validation**:
  - `gameDatetime`: Required, must be valid datetime string format, must be future date (server validates)
  - `description`: Optional, max 500 chars
  - `playerIds`: Array of UUIDs, min 10, max 20 (client shows count, server enforces)
  - All players must exist in database (server validates)
- **Types**:
  - Props: `CreateGameFormProps { players: Players }`
  - Form fields derived from `CreateGameSessionSchema`
- **Props**: `{ players: Players }` - list of all active players from server

### PlayerCheckboxList

- **Description**: Renders checkbox list for player selection using Conform collection helpers
- **Main elements**:
  - Wrapper div with grid/scroll layout
  - Label + Checkbox per player
  - Player name display
- **Handled events**: Checkbox toggle (managed by Conform)
- **Validation**: None (handled by parent form)
- **Types**: `{ players: Players, fieldMeta: FieldMetadata<string[]> }`
- **Props**:
  - `players: Players` - player list to render
  - `fieldMeta: FieldMetadata<string[]>` - Conform field metadata for `playerIds`

### PlayerCountIndicator

- **Description**: Displays selected player count with validation feedback (10-20 range)
- **Main elements**:
  - Text showing "X players selected"
  - Visual indicator (color coding: red <10, yellow 10-20, green invalid >20)
- **Handled events**: None (reactive to form state)
- **Validation**: Visual only, reflects validation state
- **Types**: `{ count: number }`
- **Props**: `{ count: number }` - number of selected players

## 5. Types

### From Server Actions

```typescript
// Already exists in validations/game-session.ts
CreateGameSessionSchema = z.object({
  gameDatetime: z.string().datetime(),
  description: z.string().max(500).optional(),
  playerIds: z.array(z.string().uuid()),
})

type CreateGameSessionCommand = z.infer<typeof CreateGameSessionSchema>
```

### From Database Queries

```typescript
// From getPlayers() action
type Players = Array<{
  id: string
  name: string
  skillTier?: SkillTier  // Only if admin
  positions?: Position[] // Only if admin
  createdAt?: Date       // Only if admin
  updatedAt?: Date       // Only if admin
}>
```

### View-Specific Types

```typescript
// Component props
interface CreateGameFormProps {
  players: Players
}

interface PlayerCheckboxListProps {
  players: Players
  fieldMeta: FieldMetadata<string[]>
}

interface PlayerCountIndicatorProps {
  count: number
}

// Derived from Conform
type GameFormFields = {
  gameDatetime: FieldMetadata<string>
  description: FieldMetadata<string | undefined>
  playerIds: FieldMetadata<string[]>
}
```

## 6. State Management

### Form State (Conform)

Use `useForm` hook from `@conform-to/react`:

```typescript
const [form, fields] = useForm({
  lastResult,
  onValidate({ formData }) {
    return parseWithZod(formData, { schema: CreateGameSessionSchema })
  },
  shouldValidate: 'onBlur',
  shouldRevalidate: 'onInput',
})
```

Fields accessed via `fields.gameDatetime`, `fields.description`, `fields.playerIds`

### Server Action State

Use `useActionState` hook:

```typescript
const [lastResult, formAction, isSubmitting] = useActionState(
  createGameSessionAction,
  undefined
)
```

- `lastResult`: Server action response (undefined or `{ result: SubmissionResult }`)
- `formAction`: Form action function to bind to `<form>`
- `isSubmitting`: Boolean indicating pending submission

### Local UI State

- Player count: Computed from `fields.playerIds.value?.length ?? 0`
- Datetime min value: Computed from current date/time on mount (for HTML5 validation)
- No additional custom hooks required

## 7. Server Action Integration

### createGameSessionAction

**Import**: `import { createGameSessionAction } from '#app/lib/actions/game-sessions'`

**Input Parameters**:
- `_prevState: unknown` (managed by `useActionState`)
- `formData: FormData` containing:
  - `gameDatetime: string` (ISO datetime format)
  - `description?: string` (optional)
  - `playerIds: string[]` (UUID array via checkboxes)

**Return Type**:
- Success: Redirects to `/games` (no return value received)
- Validation error: `{ result: SubmissionResult }` where `SubmissionResult` contains:
  - `status: 'error'`
  - `error: Record<string, string[]>` for field errors
  - Possible field paths: `gameDatetime`, `description`, `playerIds`
  - Form-level error for unauthorized access

**Error Messages**:
- `gameDatetime`: "Invalid datetime format", "Game date must be in the future"
- `playerIds`: "Minimum 10 players required", "Maximum 20 players allowed", "Some players do not exist"
- `description`: "String must contain at most 500 character(s)"
- Form: "Unauthorized access"

### getPlayers

**Import**: `import { getPlayers } from '#app/lib/actions/players'`

**Input**: None

**Return Type**: `Promise<Players>` - Array of player objects with conditional fields based on user role

**Usage**: Called in server component (`CreateGamePage`) to fetch initial data

## 8. User Interactions

### Initial Load
1. Page fetches players via `getPlayers()`
2. Form renders with empty state
3. Datetime input shows current date/time as minimum
4. Player list displays all active players
5. Submit button enabled (validation occurs on submit)

### Datetime Selection
1. User clicks datetime input
2. Browser native picker opens
3. User selects date/time
4. Input validates on blur (format check)
5. Future date validation occurs on server submission

### Description Input
1. User types optional description
2. Character count validated on input (max 500)
3. Error shows if exceeded

### Player Selection
1. User clicks player checkboxes
2. Selected count updates immediately
3. Visual indicator changes color based on count:
   - Red: <10 players (invalid)
   - Yellow: 10-20 players (valid)
   - Red: >20 players (invalid)
4. No submit prevention - server validates final count

### Form Submission
1. User clicks "Create Game" button
2. Client validation runs (Conform + Zod schema)
3. If invalid, errors display inline
4. If valid, form submits to server action
5. Button shows loading state: "Creating game..."
6. Server validates (auth, future date, player count, player existence)
7. Success: Redirects to `/games`
8. Error: Form errors display, button re-enables

### Cancel Action
1. User clicks "Cancel" button
2. Navigate to `/games` without submission
3. No data persisted

## 9. Conditions and Validation

### Client-Side Validation (Pre-submission)

**Datetime Field**:
- Condition: Value must match `datetime-local` format (YYYY-MM-DDTHH:mm)
- Component: Input field
- Effect: Browser prevents submission if format invalid
- Feedback: Native HTML5 validation message

**Description Field**:
- Condition: Max 500 characters
- Component: Textarea
- Effect: Zod validation shows error on input
- Feedback: FieldError below input

**Player Selection Count**:
- Condition: Visual feedback only (10-20 range)
- Component: PlayerCountIndicator
- Effect: Color changes, no submission block
- Feedback: Text color (red/yellow/green)

### Server-Side Validation (Post-submission)

**Authorization**:
- Condition: User must be admin
- Verification: `getCurrentUser()` check in server action
- Effect on UI: Form-level error "Unauthorized access"
- Component affected: FieldError at form level

**Future Date**:
- Condition: `gameDatetime` must be > `new Date()`
- Verification: Date comparison in server action transform
- Effect on UI: Field error "Game date must be in the future"
- Component affected: gameDatetime FieldError

**Player Count**:
- Condition: 10 ≤ `playerIds.length` ≤ 20
- Verification: Array length check in server action transform
- Effect on UI: Field error "Minimum 10 players required" or "Maximum 20 players allowed"
- Component affected: playerIds FieldError

**Player Existence**:
- Condition: All `playerIds` must exist in database
- Verification: `prisma.player.findMany()` count match in server action
- Effect on UI: Field error "Some players do not exist"
- Component affected: playerIds FieldError

### Form State During Submission

- All inputs disabled (`disabled={isSubmitting}`)
- Submit button disabled
- Submit button text changes to "Creating game..."
- Cancel button disabled

## 10. Error Handling

### Network/Server Errors

**Scenario**: Database connection failure, unexpected server error
**Handling**: Next.js error boundary catches thrown errors
**UI**: Error page displays (app/games/new/error.tsx if exists, else default)
**Recovery**: User can refresh or navigate back

### Validation Errors

**Scenario**: Form validation fails (client or server)
**Handling**: Conform displays field-level errors via `FieldError` components
**UI**: Red text below relevant input, form stays populated
**Recovery**: User corrects input, re-submits

### Authorization Errors

**Scenario**: Non-admin user accesses `/games/new`
**Handling**: Server action returns form-level error
**UI**: Error displayed above submit button
**Recovery**: User navigates away (should be prevented by route protection)

### Data Consistency Errors

**Scenario**: Selected players deleted between load and submit
**Handling**: Server action validates player existence, returns error
**UI**: Field error "Some players do not exist"
**Recovery**: User refreshes page to reload player list, re-selects

### Edge Cases

**No players in database**:
- Form displays empty checkbox list
- Cannot submit (min 10 required)
- Consider showing empty state message

**Exactly 10-20 players in database**:
- User can select all
- No pagination needed (small roster per PRD)

**User navigates away during submission**:
- Next.js handles cleanup
- No orphaned game session (redirect ensures completion)

**Browser autocomplete interferes**:
- Datetime input may autofill
- Add `autoComplete="off"` if needed

## 11. Implementation Steps

1. **Create page structure**
   - Create `app/games/new/page.tsx` server component
   - Fetch players via `await getPlayers()`
   - Pass players to CreateGameForm

2. **Create form component**
   - Create `app/games/new/create-game-form.tsx` with `'use client'`
   - Import Conform hooks, UI components, server action
   - Setup `useActionState` with `createGameSessionAction`
   - Setup `useForm` with `CreateGameSessionSchema` validation

3. **Build form UI structure**
   - Wrap form in Card component
   - Add CardHeader with title "Create Game"
   - Create FieldGroup for form fields
   - Add form element with `getFormProps(form)` and `action={formAction}`

4. **Implement datetime field**
   - Add Field wrapper
   - Add FieldLabel "Game Date & Time"
   - Add Input with `type="datetime-local"`, `getInputProps(fields.gameDatetime)`
   - Add FieldError for `fields.gameDatetime.errors`
   - Compute and set `min` attribute to current datetime

5. **Implement description field**
   - Add Field wrapper
   - Add FieldLabel "Description (optional)"
   - Add Textarea with `getInputProps(fields.description)`
   - Add FieldError for `fields.description.errors`

6. **Implement player selection**
   - Create PlayerCheckboxList component
   - Use `getCollectionProps(fields.playerIds, { type: 'checkbox', options: players.map(p => p.id) })`
   - Map over players, render label + checkbox for each
   - Display player name next to checkbox
   - Add scroll container if player list long

7. **Create player count indicator**
   - Create PlayerCountIndicator component
   - Accept `count` prop
   - Display "X players selected"
   - Apply conditional color: `count < 10 || count > 20 ? 'text-destructive' : 'text-muted-foreground'`

8. **Add form-level error display**
   - Add FieldError for `form.errors` above buttons
   - Displays auth errors, unexpected errors

9. **Implement action buttons**
   - Create ButtonGroup wrapper
   - Add Cancel button: `variant="outline"`, `onClick={() => router.push('/games')}`
   - Add Submit button: `type="submit"`, disabled when `isSubmitting`
   - Change submit text: `isSubmitting ? 'Creating game...' : 'Create Game'`

10. **Add loading states**
    - Disable all inputs when `isSubmitting`
    - Disable both buttons when `isSubmitting`

11. **Setup routing**
    - Ensure `/games/new` route resolves to page
    - Add admin authorization check in page (redirect non-admin)

12. **Test validation flows**
    - Submit with <10 players, verify error
    - Submit with >20 players, verify error
    - Submit with past date, verify error
    - Submit with description >500 chars, verify error
    - Submit valid form, verify redirect to `/games`

13. **Polish UI**
    - Add responsive layout classes
    - Ensure proper spacing with FieldGroup/Field components
    - Add loading spinner to submit button if desired
    - Consider adding player count badge next to "Players" label
