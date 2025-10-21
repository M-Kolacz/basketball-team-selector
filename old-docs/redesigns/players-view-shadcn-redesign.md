# Players View ShadCN Redesign Plan

## 1. Redesign Overview

This redesign plan modernizes the Players management view by fully leveraging ShadCN components already installed in the project. The goals are to:

- **Improve visual consistency** by replacing custom-styled components with ShadCN primitives
- **Enhance accessibility** through ShadCN's built-in ARIA attributes and keyboard navigation
- **Reduce code complexity** by using battle-tested component compositions
- **Maintain 100% functionality** - all features remain exactly as implemented
- **Better theming** through consistent use of design tokens and CSS variables
- **Improve form UX** by leveraging Conform integration with ShadCN Form components

The scope includes redesigning all components in the Players view hierarchy while preserving existing server actions, validation logic, and state management patterns.

## 2. Current vs. Redesigned Structure

### Current Structure

```
PlayersPage (Server Component)
└── PlayersList (Client Component)
    ├── AddPlayerForm (Client Component)
    │   ├── Custom collapsible (Button + conditional render)
    │   ├── Conform form with custom Field components
    │   ├── Custom select element (native HTML)
    │   └── Custom checkbox inputs
    ├── PlayersTable (Client Component)
    │   ├── Custom table markup with Tailwind classes
    │   └── PlayerRow components
    │       ├── Custom checkbox (native HTML)
    │       ├── Custom badges (Tailwind classes)
    │       └── Text button links
    ├── EditPlayerDialog (Client Component)
    │   ├── Custom modal overlay (fixed positioning)
    │   ├── Custom form with native inputs
    │   ├── Custom select (native HTML)
    │   └── Custom position toggle buttons
    └── DeleteConfirmationDialog (Client Component)
        ├── Custom modal overlay
        └── Custom button layout
```

### Redesigned Structure

```
PlayersPage (Server Component)
└── PlayersList (Client Component)
    ├── AddPlayerForm (Client Component)
    │   ├── Collapsible (ShadCN)
    │   │   ├── CollapsibleTrigger + Button
    │   │   └── CollapsibleContent
    │   ├── Form (ShadCN with Conform)
    │   │   ├── FormField + Input
    │   │   ├── FormField + Select
    │   │   └── FormField + CheckboxGroup
    │   └── Button components (ShadCN)
    ├── Card (ShadCN wrapper)
    │   └── PlayersTable (Client Component)
    │       ├── Table, TableHeader, TableBody (ShadCN)
    │       └── PlayerRow components
    │           ├── TableRow, TableCell (ShadCN)
    │           ├── Checkbox (ShadCN)
    │           ├── Badge (ShadCN)
    │           └── Button (ShadCN icon buttons)
    ├── EditPlayerDialog (Client Component)
    │   ├── Dialog, DialogContent, DialogHeader (ShadCN)
    │   ├── Form (ShadCN with Conform)
    │   │   ├── FormField + Input
    │   │   ├── FormField + Select
    │   │   └── FormField + ToggleGroup
    │   └── DialogFooter + Button components
    └── DeleteConfirmationDialog (Client Component)
        ├── AlertDialog, AlertDialogContent (ShadCN)
        ├── AlertDialogHeader, AlertDialogDescription
        └── AlertDialogFooter + AlertDialogAction/Cancel
```

## 3. ShadCN Component Mapping

| Current Element | Current Implementation | ShadCN Component | Component Path | Notes |
|-----------------|------------------------|------------------|----------------|-------|
| Page container | Custom div with Tailwind | Card | @/components/ui/card | Optional wrapper for consistency |
| Add player collapsible | Custom Button + conditional render | Collapsible | @/components/ui/collapsible | Native collapsible behavior |
| Add player form | Conform + custom Field | Form | @/components/ui/form | Conform integration built-in |
| Skill tier dropdown | Native `<select>` | Select | @/components/ui/select | Better styling, accessibility |
| Position checkboxes | Native checkboxes | Checkbox | @/components/ui/checkbox | Consistent styling |
| Players table container | Custom div + table | Table | @/components/ui/table | Semantic table components |
| Table rows | Custom `<tr>` | TableRow | @/components/ui/table | Hover states included |
| Table cells | Custom `<td>` | TableCell | @/components/ui/table | Consistent padding |
| Player selection checkbox | Native checkbox | Checkbox | @/components/ui/checkbox | Better a11y |
| Skill tier badge | Custom span with Tailwind | Badge | @/components/ui/badge | Variant support |
| Position badges | Custom span with Tailwind | Badge | @/components/ui/badge | Secondary variant |
| Edit/Delete buttons | Text buttons | Button | @/components/ui/button | Ghost/link variants |
| Edit dialog | Custom modal (fixed overlay) | Dialog | @/components/ui/dialog | Portal, focus trap, ESC handling |
| Dialog form inputs | Native input/select | Form + Input/Select | @/components/ui/form | Consistent validation display |
| Position toggle buttons | Custom button group | ToggleGroup | @/components/ui/toggle-group | Multi-select support |
| Delete confirmation | Custom modal | AlertDialog | @/components/ui/alert-dialog | Purpose-built for confirmations |
| Delete warning icon | Custom SVG | Alert or inline SVG | @/components/ui/alert | Semantic warning display |
| Submit buttons | Custom button | Button | @/components/ui/button | Loading states, variants |
| Toast notifications | Not implemented | Sonner | @/components/ui/sonner | Already available |

## 4. Component Redesign Details

### PlayersPage (Server Component)

**Current Implementation:**
- Fetches players and user via server actions
- Renders PlayersList with initial data

**Redesigned Implementation:**
- No changes needed - server component remains identical
- Continue using `getPlayers()` and `getCurrentUser()`

**Example:**
```tsx
// File: src/app/players/page.tsx - NO CHANGES
export default async function PlayersPage() {
  const [players, currentUser] = await Promise.all([
    getPlayers(),
    getCurrentUser(),
  ])
  const isAdmin = currentUser?.role === 'admin'
  return <PlayersList players={players} isAdmin={isAdmin} />
}
```

---

### PlayersList (Client Component)

**Current Implementation:**
- Manages all state (players, filters, selections, dialogs)
- Custom layout with Tailwind container classes
- No Card wrapper

**Redesigned Implementation:**
- State management remains identical
- Add Toaster component for notifications
- Wrap table in Card component for visual consistency
- Add toast notifications for CRUD operations

**Accessibility Improvements:**
- Toast notifications for screen readers
- Better visual feedback for actions

**Example Structure:**
```tsx
'use client'
import { Toaster } from '#app/components/ui/sonner'
import { toast } from 'sonner'

export function PlayersList({ players: initialPlayers, isAdmin }: PlayersListProps) {
  // ... existing state management ...

  const handleDeleteConfirm = async () => {
    // ... existing logic ...
    toast.success('Player deleted successfully')
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Players</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isAdmin ? 'Manage your basketball team roster' : 'View basketball team roster'}
        </p>
      </div>

      {isAdmin && <AddPlayerForm />}
      <PlayersTable {...tableProps} />
      {isAdmin && <EditPlayerDialog {...editProps} />}
      {isAdmin && <DeleteConfirmationDialog {...deleteProps} />}

      <Toaster />
    </div>
  )
}
```

---

### AddPlayerForm (Client Component)

**Current Implementation:**
- Custom collapsible using Button + conditional render
- Conform form with custom Field components
- Native `<select>` for skill tier (unstyled)
- Native checkboxes for positions (unstyled)
- Custom buttons

**Redesigned Implementation:**
- **ShadCN Components:** Collapsible, CollapsibleTrigger, CollapsibleContent, Form, FormField, FormItem, FormLabel, FormControl, FormMessage, Input, Select, Checkbox, Button
- **Form structure:** Use ShadCN Form with Conform integration
- **Select component:** Replace native select with ShadCN Select
- **Checkboxes:** Use ShadCN Checkbox components
- **Layout:** Card wrapper for visual consistency

**Props Mapping:**
- No prop changes - component remains self-contained
- Form state managed by Conform (existing)

**Behavior Changes:**
- Collapsible animation (smooth expand/collapse)
- Better keyboard navigation on Select
- Visual focus states on all inputs

**Accessibility Improvements:**
- ARIA labels automatically applied by Form components
- Better error announcement for screen readers
- Keyboard navigation on custom Select
- Focus management within Collapsible

**Example Code Structure:**
```tsx
'use client'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '#app/components/ui/collapsible'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '#app/components/ui/form'
import { Input } from '#app/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#app/components/ui/select'
import { Checkbox } from '#app/components/ui/checkbox'
import { Button } from '#app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#app/components/ui/card'
import { ChevronDown } from 'lucide-react'

export function AddPlayerForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [lastResult, formAction, isSubmitting] = useActionState(createPlayer, undefined)

  const [form, fields] = useForm({
    lastResult: lastResult?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CreatePlayerSchema })
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  })

  return (
    <Card className="mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="p-4">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <CardTitle>Add New Player</CardTitle>
              <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <form action={formAction} {...getFormProps(form)} className="space-y-4">
              <FormField
                control={form.control}
                name={fields.name.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player Name</FormLabel>
                    <FormControl>
                      <Input {...getInputProps(fields.name, { type: 'text' })} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={fields.skillTier.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Tier</FormLabel>
                    <Select name={fields.skillTier.name} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {skillTiers.map((tier) => (
                          <SelectItem key={tier} value={tier}>
                            {SKILL_TIER_LABELS[tier]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Positions</FormLabel>
                <div className="flex flex-wrap gap-3">
                  {getCollectionProps(fields.positions, {
                    type: 'checkbox',
                    options: positions,
                  }).map((props) => (
                    <FormItem key={props.id} className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox {...props} id={props.id} />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer" htmlFor={props.id}>
                        {props.value}
                      </FormLabel>
                    </FormItem>
                  ))}
                </div>
                <FormMessage />
              </FormItem>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Player'}
                </Button>
              </div>
            </form>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
```

---

### PlayersTable (Client Component)

**Current Implementation:**
- Custom table markup with Tailwind classes
- Manual border and spacing styling
- Native table elements

**Redesigned Implementation:**
- **ShadCN Components:** Card, Table, TableHeader, TableBody, TableHead, TableRow, TableCell
- **Wrapper:** Card component for elevated appearance
- **Table structure:** Use semantic ShadCN Table components

**Props Mapping:**
- All props remain identical - no changes

**Behavior Changes:**
- Hover states automatically applied by TableRow
- Consistent spacing from ShadCN defaults

**Accessibility Improvements:**
- Better semantic structure
- Consistent focus indicators

**Example Code Structure:**
```tsx
import { Card } from '#app/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#app/components/ui/table'

export function PlayersTable({
  players,
  isAdmin,
  selectedPlayerIds,
  onPlayerSelect,
  onEdit,
  onDelete,
}: PlayersTableProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            {isAdmin && <TableHead className="w-12"><span className="sr-only">Select</span></TableHead>}
            <TableHead>Name</TableHead>
            {isAdmin && (
              <>
                <TableHead>Skill Tier</TableHead>
                <TableHead>Positions</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 6 : 1} className="h-24 text-center text-muted-foreground">
                No players found.
              </TableCell>
            </TableRow>
          ) : (
            players.map((player) => (
              <PlayerRow
                key={player.id}
                player={player}
                isAdmin={isAdmin}
                isSelected={selectedPlayerIds.has(player.id)}
                onSelect={onPlayerSelect}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
```

---

### PlayerRow (Client Component)

**Current Implementation:**
- Custom `<tr>` with Tailwind hover states
- Native checkbox input
- Custom badge spans for skill tier and positions
- Text button links for edit/delete

**Redesigned Implementation:**
- **ShadCN Components:** TableRow, TableCell, Checkbox, Badge, Button
- **Badges:** Use Badge component with variants
- **Action buttons:** Button component with ghost variant and icons

**Props Mapping:**
- All props remain identical

**Behavior Changes:**
- Better hover/focus states from ShadCN
- Icon buttons with tooltips (optional enhancement)

**Accessibility Improvements:**
- Better checkbox accessibility
- Icon buttons with accessible labels
- Focus visible states

**Example Code Structure:**
```tsx
import { TableCell, TableRow } from '#app/components/ui/table'
import { Checkbox } from '#app/components/ui/checkbox'
import { Badge } from '#app/components/ui/badge'
import { Button } from '#app/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'

export function PlayerRow({ player, isAdmin, isSelected, onSelect, onEdit, onDelete }: PlayerRowProps) {
  const adminPlayer = isAdmin ? (player as PlayerAdminDto) : null

  return (
    <TableRow>
      {isAdmin && onSelect && (
        <TableCell>
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(player.id, checked === true)}
            aria-label={`Select ${player.name}`}
          />
        </TableCell>
      )}

      <TableCell className="font-medium">{player.name}</TableCell>

      {isAdmin && adminPlayer && (
        <TableCell>
          <Badge variant="secondary" className={SKILL_TIER_COLORS[adminPlayer.skillTier]}>
            {SKILL_TIER_LABELS[adminPlayer.skillTier]}
          </Badge>
        </TableCell>
      )}

      {isAdmin && adminPlayer && (
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {adminPlayer.positions.map((pos) => (
              <Badge key={pos} variant="outline">
                {POSITION_LABELS[pos]}
              </Badge>
            ))}
          </div>
        </TableCell>
      )}

      {isAdmin && (
        <TableCell className="text-muted-foreground text-sm">
          {formatDateTime(player.createdAt)}
        </TableCell>
      )}

      {isAdmin && adminPlayer && (
        <TableCell>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(adminPlayer)}
              aria-label={`Edit ${player.name}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete?.(player.id)}
              aria-label={`Delete ${player.name}`}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  )
}
```

---

### EditPlayerDialog (Client Component)

**Current Implementation:**
- Custom modal with fixed overlay and positioning
- Native input and select elements
- Custom button group for position toggles
- Manual focus management

**Redesigned Implementation:**
- **ShadCN Components:** Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Form, FormField, Input, Select, ToggleGroup, ToggleGroupItem, Button
- **Modal:** Use Dialog with portal and focus trap
- **Form:** ShadCN Form components
- **Position selection:** ToggleGroup with multiple selection

**Props Mapping:**
- `isOpen` → `open` (Dialog prop)
- All other props remain identical

**Behavior Changes:**
- Automatic focus trap
- ESC key closes dialog
- Click outside closes dialog
- Smooth animations

**Accessibility Improvements:**
- Focus trap built-in
- ARIA dialog role and labels
- Keyboard navigation (ESC, Tab)
- Screen reader announcements

**Example Code Structure:**
```tsx
'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#app/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '#app/components/ui/form'
import { Input } from '#app/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#app/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '#app/components/ui/toggle-group'
import { Button } from '#app/components/ui/button'
import { Alert, AlertDescription } from '#app/components/ui/alert'

export function EditPlayerDialog({
  isOpen,
  player,
  onSubmit,
  onCancel,
  isSubmitting,
  errors,
  errorMessage,
}: EditPlayerDialogProps) {
  const [formData, setFormData] = useState<EditPlayerFormData>({
    name: '',
    skillTier: 'C',
    positions: [],
  })

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name,
        skillTier: player.skillTier,
        positions: [...player.positions],
      })
    }
  }, [player])

  if (!player) return null

  const isDirty = hasPlayerChanged(player, formData)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(player.id, formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Player</DialogTitle>
          <DialogDescription>
            Update player information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <FormItem>
            <FormLabel>Player Name</FormLabel>
            <FormControl>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={isSubmitting}
                placeholder="Enter player name"
              />
            </FormControl>
            {errors?.name && <FormMessage>{errors.name.join(', ')}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel>Skill Tier</FormLabel>
            <Select
              value={formData.skillTier}
              onValueChange={(value) => setFormData(prev => ({ ...prev, skillTier: value as SkillTier }))}
              disabled={isSubmitting}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {skillTiers.map((tier) => (
                  <SelectItem key={tier} value={tier}>
                    {SKILL_TIER_LABELS[tier]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.skillTier && <FormMessage>{errors.skillTier.join(', ')}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel>Positions</FormLabel>
            <ToggleGroup
              type="multiple"
              value={formData.positions}
              onValueChange={(value) => setFormData(prev => ({ ...prev, positions: value as Position[] }))}
              disabled={isSubmitting}
              className="justify-start flex-wrap"
            >
              {positions.map((position) => (
                <ToggleGroupItem key={position} value={position} aria-label={POSITION_LABELS[position]}>
                  {POSITION_LABELS[position]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {errors?.positions && <FormMessage>{errors.positions.join(', ')}</FormMessage>}
          </FormItem>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? 'Updating...' : 'Update Player'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

---

### DeleteConfirmationDialog (Client Component)

**Current Implementation:**
- Custom modal with fixed overlay
- Custom layout and styling
- Inline SVG for warning icon

**Redesigned Implementation:**
- **ShadCN Components:** AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel
- **Purpose-built:** AlertDialog is specifically designed for confirmations
- **Icon:** Use lucide-react icon or Alert component

**Props Mapping:**
- `isOpen` → `open`
- `onConfirm` → handled by AlertDialogAction
- `onCancel` → handled by AlertDialogCancel

**Behavior Changes:**
- AlertDialog manages state internally
- Better keyboard handling
- Automatic role="alertdialog"

**Accessibility Improvements:**
- Purpose-built for destructive confirmations
- Better ARIA attributes
- Focus management for cancel vs confirm

**Example Code Structure:**
```tsx
'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#app/components/ui/alert-dialog'
import { AlertTriangle } from 'lucide-react'

export function DeleteConfirmationDialog({
  isOpen,
  playerName,
  isBulkDelete,
  deleteCount,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {isBulkDelete ? (
              <>
                Are you sure you want to delete <strong>{deleteCount}</strong>{' '}
                {deleteCount === 1 ? 'player' : 'players'}? This action cannot be undone.
              </>
            ) : (
              <>
                Are you sure you want to delete <strong>{playerName}</strong>? This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} onClick={onCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## 5. Visual Design Changes

### Typography
- **Headings:** Use ShadCN defaults (already aligned with Tailwind)
- **Body text:** Replace `text-gray-600` with `text-muted-foreground` for consistent theming
- **Labels:** Use FormLabel components for consistent weight and spacing
- **Error text:** Use FormMessage component (automatically styled as `text-destructive`)

### Spacing
- **Card padding:** Use ShadCN Card defaults (p-6 for CardContent)
- **Form fields:** Use `space-y-4` for consistent field spacing
- **Button groups:** Use `gap-2` for action buttons
- **Table cells:** ShadCN TableCell includes consistent padding (p-2)
- **Dialog content:** ShadCN Dialog includes gap-4 by default

### Colors
- **Backgrounds:** Use `bg-background`, `bg-card`, `bg-popover` instead of hard-coded colors
- **Text:** Use `text-foreground`, `text-muted-foreground` for adaptive theming
- **Borders:** Use `border` (maps to `border-border` CSS variable)
- **Destructive actions:** Use `text-destructive`, `bg-destructive`
- **Skill tier badges:** Keep existing color mappings but use Badge `variant="secondary"` as base
- **Position badges:** Use Badge `variant="outline"`

### Borders & Shadows
- **Cards:** ShadCN Card includes subtle border and no shadow by default
- **Dialogs:** ShadCN Dialog includes shadow-lg
- **Inputs:** Use ring-based focus states (`focus-visible:ring-2 focus-visible:ring-ring`)
- **Tables:** Borders handled by TableRow component

### Responsive Design
- **Breakpoints:** ShadCN components are mobile-first by default
- **Dialog:** `sm:max-w-lg` applied automatically
- **Table:** Horizontal scroll handled by Table wrapper
- **Form layout:** Stack vertically on mobile (ShadCN default)
- **Button groups:** DialogFooter stacks on mobile, horizontal on sm+

## 6. Functionality Preservation

### User Interactions

All user interactions remain **identical** - only the underlying components change:

| Interaction | Current Handler | Redesigned Handler | Changes |
|-------------|----------------|-------------------|---------|
| Toggle add form | `setIsExpanded(!isExpanded)` | `onOpenChange` from Collapsible | Prop name change only |
| Submit add form | `formAction` (Conform) | `formAction` (Conform) | No change |
| Select player checkbox | `onChange={(e) => onSelect(id, e.target.checked)}` | `onCheckedChange={(checked) => onSelect(id, checked === true)}` | Event type change |
| Click Edit button | `onClick={() => onEdit?.(player)}` | `onClick={() => onEdit?.(player)}` | No change |
| Click Delete button | `onClick={() => onDelete?.(id)}` | `onClick={() => onDelete?.(id)}` | No change |
| Submit edit form | `onSubmit={handleSubmit}` | `onSubmit={handleSubmit}` | No change |
| Close dialog (ESC/Cancel) | Manual `setIsOpen(false)` | `onOpenChange` from Dialog | Automatic ESC handling added |
| Confirm delete | `onClick={onConfirm}` | `onClick={onConfirm}` | No change |
| Change skill tier | `onChange={(e) => ...}` | `onValueChange={(value) => ...}` | Prop name change |
| Toggle position | Custom button toggle | `onValueChange` from ToggleGroup | API change but logic identical |

### Server Actions

All server action integrations remain **unchanged**:

- **getPlayers():** Called in PlayersPage server component - no changes
- **createPlayer():** Used with `useActionState` in AddPlayerForm - no changes
- Form data handling via Conform - no changes
- Validation schemas - no changes
- Error handling patterns - no changes

**Error Handling:**
- Conform errors displayed via FormMessage component
- Custom error messages shown in Alert components
- Toast notifications added for success/error feedback

### Validation

**Current Approach:**
- Conform validation with Zod schemas
- Client-side validation on blur/input
- Server-side validation in action
- Inline error display

**Redesigned Approach:**
- **Identical schema and timing** - no validation logic changes
- FormMessage component replaces manual error display
- Alert component for top-level errors
- All validation rules preserved exactly

**Error Display Pattern:**
```tsx
// Before
{errors?.name && <p className="mt-1 text-sm text-red-600">{errors.name.join(', ')}</p>}

// After
<FormMessage>{errors?.name?.join(', ')}</FormMessage>
```

### State Management

**No changes to state management:**

- `useState` for all local state - unchanged
- `useMemo` for filtered players - unchanged
- `useEffect` for dialog data sync - unchanged
- `useActionState` for form submission - unchanged
- All state variables remain identical
- All setter functions remain identical
- All computed values remain identical

**Custom Hooks:**
- No custom hooks currently used
- None needed for redesign

## 7. Accessibility Improvements

### ARIA Attributes

| Component | Current ARIA | ShadCN ARIA | Improvement |
|-----------|-------------|-------------|-------------|
| Collapsible | Manual `aria-expanded` | Automatic via Collapsible | Auto-managed |
| Dialog | Manual `role="dialog"`, `aria-labelledby` | Automatic via Dialog | Complete dialog pattern |
| AlertDialog | Manual `role="dialog"` | `role="alertdialog"` | Purpose-specific role |
| Form fields | Manual `aria-invalid`, `aria-describedby` | Automatic via FormField | Error association |
| Select | Native select (limited) | Radix Select (full ARIA) | Complete combobox pattern |
| Checkbox | Native checkbox | Radix Checkbox | Better state management |
| Table | Semantic HTML only | Semantic HTML + proper structure | Better SR navigation |

### Keyboard Navigation

**Improvements:**
- **Collapsible:** Space/Enter to toggle (automatic)
- **Dialog:** ESC to close, Tab trap (automatic)
- **Select:** Arrow keys, Home/End, type-ahead (Radix)
- **Checkbox:** Space to toggle (enhanced by Radix)
- **ToggleGroup:** Arrow key navigation between options
- **AlertDialog:** Default focus on cancel (safe default)

### Screen Reader Improvements

- **FormMessage:** Properly associated with inputs via `aria-describedby`
- **Dialog titles:** Automatically announced as dialog label
- **AlertDialog:** Announced as alert, higher priority
- **Loading states:** Better announcement of button state changes
- **Empty states:** Proper table cell announcement for "No players"
- **Toasts:** Announced via Sonner's ARIA live region

### Focus Management

- **Dialog open:** Focus moves to content (automatic)
- **Dialog close:** Focus returns to trigger (automatic)
- **Form submission:** Focus on first error (can add with Conform)
- **Delete confirmation:** Focus on cancel button (safer default)
- **Collapsible:** Focus remains on trigger when toggled

### Color Contrast

- **Improved:** Use of design tokens ensures WCAG AA compliance
- **Muted text:** `text-muted-foreground` maintains 4.5:1 ratio
- **Destructive:** `text-destructive` maintains contrast
- **Badges:** ShadCN variants ensure readable contrast
- **Focus rings:** Highly visible `ring-ring` color

## 8. Breaking Changes & Considerations

### Component API Changes

| Component | Breaking Change | Migration |
|-----------|----------------|-----------|
| EditPlayerDialog | `isOpen` → `open` | Rename prop in parent |
| DeleteConfirmationDialog | `isOpen` → `open` | Rename prop in parent |
| Checkbox onCheck | `onChange` → `onCheckedChange` | Update event handler |
| Select onChange | `onChange` → `onValueChange` | Update event handler |
| Collapsible trigger | Must use `asChild` pattern | Wrap Button in CollapsibleTrigger |

### Behavioral Differences

**Dialog closing:**
- **Before:** Only manual close via Cancel button
- **After:** ESC key and overlay click also close
- **Consideration:** Ensure unsaved data handling for EditPlayerDialog
- **Solution:** Add `onOpenChange` guard to prevent accidental close

**Select behavior:**
- **Before:** Native select (no search, simple keyboard nav)
- **After:** Custom select (search, advanced keyboard nav)
- **Consideration:** Users may notice richer interaction
- **Solution:** No action needed - improvement only

**Form submission:**
- **Before:** Native form submission with Conform
- **After:** Native form submission with Conform (no change)
- **Consideration:** None - identical behavior

### Migration Challenges

**Challenge 1: Conform integration with ShadCN Form**
- **Issue:** ShadCN Form expects react-hook-form, we use Conform
- **Solution:** Use FormItem, FormLabel, FormMessage as styled wrappers only; continue using Conform's `getInputProps`, `getFormProps`

**Challenge 2: Checkbox array for positions**
- **Issue:** Conform's `getCollectionProps` returns specific props
- **Solution:** Map over collection props and wrap each in FormItem + Checkbox

**Challenge 3: Native select in AddPlayerForm**
- **Issue:** Conform expects native inputs for server actions
- **Solution:** Keep native select in AddPlayerForm, use ShadCN Select only in EditPlayerDialog (client-side state)

**Challenge 4: ToggleGroup for positions**
- **Issue:** ToggleGroup returns array of strings, need to sync with formData
- **Solution:** Use controlled ToggleGroup with `value={formData.positions}` and `onValueChange`

### Testing Requirements

**Visual Regression:**
- Compare layout before/after for each component
- Test dark mode (ShadCN supports by default)
- Test all breakpoints (mobile, tablet, desktop)

**Functional Testing:**
- Test all CRUD operations (create, edit, delete)
- Test form validation (client + server)
- Test dialog open/close (keyboard + mouse)
- Test keyboard navigation through all interactive elements
- Test screen reader announcements

**Edge Cases:**
- Empty player list
- Very long player names
- Many positions selected
- Rapid dialog open/close
- Form submission during loading state

## 9. Implementation Steps

### 1. Preparation Phase

**1.1 Verify ShadCN components**
- [x] Confirm all required components are installed (from glob result)
- [x] Review component APIs in source files
- [ ] Test components in isolation (optional Storybook stories)

**1.2 Update type definitions (if needed)**
- [ ] Review dialog prop types (open vs isOpen)
- [ ] No new types needed - all existing types compatible

**1.3 Install missing dependencies**
- [ ] Check if Sonner is already integrated
- [ ] Verify lucide-react version compatibility

### 2. Component Migration (Bottom-Up)

**Phase 1: Leaf Components (No dependencies)**

**2.1 PlayerRow Component**
- [ ] Import ShadCN Table components
- [ ] Replace `<tr>` with `TableRow`
- [ ] Replace `<td>` with `TableCell`
- [ ] Replace native checkbox with ShadCN `Checkbox`
- [ ] Replace skill tier badge with `Badge` component
- [ ] Replace position badges with `Badge variant="outline"`
- [ ] Replace edit/delete text buttons with `Button variant="ghost"` + icons
- [ ] Test rendering and interactions
- [ ] Verify accessibility with keyboard navigation

**2.2 DeleteConfirmationDialog Component**
- [ ] Import AlertDialog components
- [ ] Replace custom modal with `AlertDialog` structure
- [ ] Update `isOpen` prop to `open`
- [ ] Replace custom header with `AlertDialogHeader` + `AlertDialogTitle`
- [ ] Replace message with `AlertDialogDescription`
- [ ] Replace custom footer with `AlertDialogFooter`
- [ ] Replace buttons with `AlertDialogCancel` and `AlertDialogAction`
- [ ] Test open/close with keyboard (ESC)
- [ ] Verify focus management

**Phase 2: Mid-Level Components**

**2.3 PlayersTable Component**
- [ ] Import Card and Table components
- [ ] Wrap table in `Card` component
- [ ] Replace `<table>` with `Table`
- [ ] Replace `<thead>` with `TableHeader`
- [ ] Replace `<tbody>` with `TableBody`
- [ ] Replace `<th>` with `TableHead`
- [ ] Add empty state row in TableBody
- [ ] Test with empty and populated data
- [ ] Verify responsive behavior
- [ ] Test horizontal scroll on mobile

**2.4 EditPlayerDialog Component**
- [ ] Import Dialog and Form components
- [ ] Replace custom modal with `Dialog` structure
- [ ] Update `isOpen` prop to `open`
- [ ] Add `DialogHeader`, `DialogTitle`, `DialogDescription`
- [ ] Replace native input with ShadCN `Input`
- [ ] Replace native select with ShadCN `Select`
- [ ] Replace position buttons with `ToggleGroup`
- [ ] Update `onChange` handlers to `onValueChange`
- [ ] Replace footer with `DialogFooter`
- [ ] Add `Alert` component for error messages
- [ ] Test form submission
- [ ] Test validation error display
- [ ] Test ESC and overlay close
- [ ] Verify focus trap

**2.5 AddPlayerForm Component**
- [ ] Import Collapsible, Card, and Form components
- [ ] Wrap in `Card` component
- [ ] Replace custom collapsible with `Collapsible` + `CollapsibleTrigger` + `CollapsibleContent`
- [ ] Keep native inputs for Conform compatibility
- [ ] Wrap fields in `FormItem` + `FormLabel` + `FormControl`
- [ ] Replace error display with `FormMessage`
- [ ] **Keep native select** (Conform requirement for server actions)
- [ ] Replace position checkboxes with ShadCN `Checkbox` components
- [ ] Test collapsible animation
- [ ] Test form submission with server action
- [ ] Verify Conform validation integration

**Phase 3: Container Components**

**2.6 PlayersList Component**
- [ ] Import `Toaster` from Sonner
- [ ] Add `<Toaster />` at bottom of component
- [ ] Update color classes to use design tokens (`text-muted-foreground`)
- [ ] Add toast notifications to CRUD operations:
  - [ ] Success toast on player add
  - [ ] Success toast on player update
  - [ ] Success toast on player delete
  - [ ] Error toasts for failures
- [ ] Update dialog prop names (`isOpen` → `open`)
- [ ] Test all state management flows
- [ ] Verify optimistic updates work with toasts

**2.7 PlayersPage Component**
- [ ] No changes needed
- [ ] Verify page still renders correctly
- [ ] Test server-side data fetching

### 3. Styling & Polish

**3.1 Color system migration**
- [ ] Find all `text-gray-600` → replace with `text-muted-foreground`
- [ ] Find all `text-gray-900` → replace with `text-foreground`
- [ ] Find all `bg-white` in containers → replace with `bg-card` (or remove, rely on Card)
- [ ] Find all `bg-gray-50` → replace with `bg-muted`
- [ ] Find all hard-coded border colors → replace with `border`
- [ ] Update focus ring colors to use `ring-ring`

**3.2 Spacing adjustments**
- [ ] Review Card padding (ensure consistency)
- [ ] Review form field spacing (ensure `space-y-4` pattern)
- [ ] Review button group gaps (ensure `gap-2` pattern)
- [ ] Review table cell padding (use TableCell defaults)

**3.3 Typography refinements**
- [ ] Ensure headings use proper semantic levels (h1, h2)
- [ ] Ensure FormLabel used for all labels
- [ ] Ensure FormMessage used for all errors
- [ ] Verify font weights match design (ShadCN defaults)

**3.4 Responsive design**
- [ ] Test on mobile (320px-640px)
- [ ] Test on tablet (640px-1024px)
- [ ] Test on desktop (1024px+)
- [ ] Verify table horizontal scroll on mobile
- [ ] Verify dialog sizing on mobile
- [ ] Test collapsible on mobile

### 4. Validation & Error Handling

**4.1 Form validation integration**
- [ ] Verify Conform schemas unchanged
- [ ] Test client-side validation (onBlur)
- [ ] Test server-side validation (onSubmit)
- [ ] Verify FormMessage displays errors correctly
- [ ] Test error clearing on re-input

**4.2 Error state testing**
- [ ] Test duplicate player name error
- [ ] Test empty required fields
- [ ] Test position count validation
- [ ] Test server action failures
- [ ] Verify toast error notifications

**4.3 Loading states**
- [ ] Verify button disabled during submission
- [ ] Verify button text changes ("Adding..." vs "Add Player")
- [ ] Test skeleton/spinner for data loading (if applicable)
- [ ] Verify no double-submission possible

### 5. Accessibility Testing

**5.1 Keyboard navigation**
- [ ] Tab through all form fields in order
- [ ] Test ESC key on dialogs
- [ ] Test Space/Enter on checkboxes and toggles
- [ ] Test Arrow keys on Select components
- [ ] Test Arrow keys on ToggleGroup
- [ ] Verify focus trap in dialogs
- [ ] Verify focus return after dialog close

**5.2 Screen reader testing**
- [ ] Test with NVDA (Windows) or VoiceOver (Mac)
- [ ] Verify form labels announced
- [ ] Verify error messages announced
- [ ] Verify dialog titles announced
- [ ] Verify toast notifications announced
- [ ] Verify table structure navigable
- [ ] Verify loading states announced

**5.3 ARIA verification**
- [ ] Inspect dialog ARIA attributes
- [ ] Inspect form field associations (aria-describedby)
- [ ] Inspect button ARIA labels
- [ ] Inspect checkbox ARIA states
- [ ] Verify no ARIA errors in browser console

**5.4 Color contrast**
- [ ] Check all text/background combinations (WCAG AA)
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Verify focus indicators visible
- [ ] Check muted text readable

### 6. Final Testing & Refinement

**6.1 Cross-browser testing**
- [ ] Test in Chrome/Edge
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Verify consistent behavior

**6.2 User interaction testing**
- [ ] Add player (full flow)
- [ ] Edit player (full flow)
- [ ] Delete player (full flow)
- [ ] Bulk select players
- [ ] Filter/search players (if implemented)
- [ ] Sort players (if implemented)

**6.3 Performance testing**
- [ ] Test with 100+ players
- [ ] Verify table renders smoothly
- [ ] Verify no layout shift
- [ ] Check bundle size impact (optional)

**6.4 Visual regression**
- [ ] Screenshot before/after comparison
- [ ] Verify spacing matches design
- [ ] Verify colors match theme
- [ ] Check dark mode appearance

**6.5 Edge case testing**
- [ ] Empty player list
- [ ] Player with very long name (overflow handling)
- [ ] Player with all 5 positions
- [ ] Rapid dialog open/close
- [ ] Form submission errors
- [ ] Network errors (server action failures)

## 10. Code Examples

### Before (Current Implementation)

**EditPlayerDialog - Custom Modal**
```tsx
// File: src/app/players/components/EditPlayerDialog.tsx
export function EditPlayerDialog({ isOpen, player, onSubmit, onCancel, isSubmitting, errors, errorMessage }: EditPlayerDialogProps) {
  // ... state management ...

  if (!isOpen || !player) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-gray-800" role="dialog" aria-labelledby="edit-dialog-title">
        <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 id="edit-dialog-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Edit Player
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="space-y-4">
            {errorMessage && (
              <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
                {errorMessage}
              </div>
            )}

            <div>
              <label htmlFor="edit-name" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Player Name <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                disabled={isSubmitting}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                placeholder="Enter player name"
                aria-invalid={!!errors?.name}
                aria-describedby={errors?.name ? 'edit-name-error' : undefined}
              />
              {errors?.name && (
                <p id="edit-name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name.join(', ')}
                </p>
              )}
            </div>

            {/* ... more fields ... */}
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
            <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || !isDirty} className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              {isSubmitting ? 'Updating...' : 'Update Player'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

**PlayerRow - Custom Table Row**
```tsx
// File: src/app/players/components/PlayerRow.tsx
export function PlayerRow({ player, isAdmin, isSelected, onSelect, onEdit, onDelete }: PlayerRowProps) {
  const adminPlayer = isAdmin ? (player as PlayerAdminDto) : null

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
      {isAdmin && onSelect && (
        <td className="px-4 py-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(player.id, e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
            aria-label={`Select ${player.name}`}
          />
        </td>
      )}

      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
        {player.name}
      </td>

      {isAdmin && adminPlayer && (
        <td className="px-4 py-3">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${SKILL_TIER_COLORS[adminPlayer.skillTier]}`}>
            {SKILL_TIER_LABELS[adminPlayer.skillTier]}
          </span>
        </td>
      )}

      {/* ... more cells ... */}

      {isAdmin && adminPlayer && (
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <button onClick={() => onEdit?.(adminPlayer)} className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" aria-label={`Edit ${player.name}`}>
              Edit
            </button>
            <button onClick={() => onDelete?.(player.id)} className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" aria-label={`Delete ${player.name}`}>
              Delete
            </button>
          </div>
        </td>
      )}
    </tr>
  )
}
```

### After (Redesigned with ShadCN)

**EditPlayerDialog - ShadCN Dialog**
```tsx
// File: src/app/players/components/EditPlayerDialog.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#app/components/ui/dialog'
import { FormControl, FormItem, FormLabel, FormMessage } from '#app/components/ui/form'
import { Input } from '#app/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#app/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '#app/components/ui/toggle-group'
import { Button } from '#app/components/ui/button'
import { Alert, AlertDescription } from '#app/components/ui/alert'
import { POSITION_LABELS, SKILL_TIER_LABELS } from '#app/app/players/constants'
import { hasPlayerChanged } from '#app/app/players/utils'
import type { EditPlayerFormData, ValidationErrors } from '#app/app/players/types'
import type { PlayerAdminDto, Position, SkillTier } from '#app/types/dto'

type EditPlayerDialogProps = {
  isOpen: boolean
  player: PlayerAdminDto | null
  onSubmit: (playerId: string, data: EditPlayerFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  errors?: ValidationErrors
  errorMessage?: string
}

const positions: Position[] = ['PG', 'SG', 'SF', 'PF', 'C']
const skillTiers: SkillTier[] = ['S', 'A', 'B', 'C', 'D']

export function EditPlayerDialog({
  isOpen,
  player,
  onSubmit,
  onCancel,
  isSubmitting = false,
  errors,
  errorMessage,
}: EditPlayerDialogProps) {
  const [formData, setFormData] = useState<EditPlayerFormData>({
    name: '',
    skillTier: 'C',
    positions: [],
  })

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name,
        skillTier: player.skillTier,
        positions: [...player.positions],
      })
    }
  }, [player])

  if (!player) return null

  const isDirty = hasPlayerChanged(player, formData)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(player.id, formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Player</DialogTitle>
          <DialogDescription>
            Update player information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <FormItem>
            <FormLabel>Player Name</FormLabel>
            <FormControl>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={isSubmitting}
                placeholder="Enter player name"
                aria-invalid={!!errors?.name}
              />
            </FormControl>
            {errors?.name && <FormMessage>{errors.name.join(', ')}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel>Skill Tier</FormLabel>
            <Select
              value={formData.skillTier}
              onValueChange={(value) => setFormData(prev => ({ ...prev, skillTier: value as SkillTier }))}
              disabled={isSubmitting}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {skillTiers.map((tier) => (
                  <SelectItem key={tier} value={tier}>
                    {SKILL_TIER_LABELS[tier]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.skillTier && <FormMessage>{errors.skillTier.join(', ')}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel>Positions</FormLabel>
            <FormControl>
              <ToggleGroup
                type="multiple"
                value={formData.positions}
                onValueChange={(value) => setFormData(prev => ({ ...prev, positions: value as Position[] }))}
                disabled={isSubmitting}
                className="justify-start flex-wrap"
              >
                {positions.map((position) => (
                  <ToggleGroupItem key={position} value={position} aria-label={POSITION_LABELS[position]}>
                    {POSITION_LABELS[position]}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FormControl>
            {errors?.positions && <FormMessage>{errors.positions.join(', ')}</FormMessage>}
          </FormItem>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? 'Updating...' : 'Update Player'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

**PlayerRow - ShadCN Table Components**
```tsx
// File: src/app/players/components/PlayerRow.tsx
import { TableCell, TableRow } from '#app/components/ui/table'
import { Checkbox } from '#app/components/ui/checkbox'
import { Badge } from '#app/components/ui/badge'
import { Button } from '#app/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { POSITION_LABELS, SKILL_TIER_LABELS, SKILL_TIER_COLORS } from '#app/app/players/constants'
import { formatDateTime } from '#app/app/players/utils'
import type { PlayerAdminDto, PlayerUserDto } from '#app/types/dto'

type PlayerRowProps = {
  player: PlayerAdminDto | PlayerUserDto
  isAdmin: boolean
  isSelected?: boolean
  onSelect?: (playerId: string, selected: boolean) => void
  onEdit?: (player: PlayerAdminDto) => void
  onDelete?: (playerId: string) => void
}

export function PlayerRow({
  player,
  isAdmin,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
}: PlayerRowProps) {
  const adminPlayer = isAdmin ? (player as PlayerAdminDto) : null

  return (
    <TableRow>
      {isAdmin && onSelect && (
        <TableCell>
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(player.id, checked === true)}
            aria-label={`Select ${player.name}`}
          />
        </TableCell>
      )}

      <TableCell className="font-medium">{player.name}</TableCell>

      {isAdmin && adminPlayer && (
        <TableCell>
          <Badge variant="secondary" className={SKILL_TIER_COLORS[adminPlayer.skillTier]}>
            {SKILL_TIER_LABELS[adminPlayer.skillTier]}
          </Badge>
        </TableCell>
      )}

      {isAdmin && adminPlayer && (
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {adminPlayer.positions.map((pos) => (
              <Badge key={pos} variant="outline">
                {POSITION_LABELS[pos]}
              </Badge>
            ))}
          </div>
        </TableCell>
      )}

      {isAdmin && (
        <TableCell className="text-muted-foreground text-sm">
          {formatDateTime(player.createdAt)}
        </TableCell>
      )}

      {isAdmin && adminPlayer && (
        <TableCell>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(adminPlayer)}
              aria-label={`Edit ${player.name}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete?.(player.id)}
              aria-label={`Delete ${player.name}`}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  )
}
```

## 11. Additional Recommendations

### Immediate Recommendations

1. **Add Search/Filter functionality**
   - Use ShadCN Input with search icon
   - Add Select filters for skill tier and position
   - Implement client-side filtering (already planned in implementation plan)

2. **Add Skeleton loading states**
   - Use ShadCN Skeleton component
   - Show skeletons while fetching initial data
   - Better perceived performance

3. **Add Empty state component**
   - Use ShadCN Empty component (if available) or create custom
   - Show helpful message when no players exist
   - Include "Add Player" CTA button

4. **Implement bulk delete**
   - Already partially implemented in state
   - Connect to BulkActionBar component
   - Use AlertDialog for confirmation

### Future Enhancements

1. **Data Table component**
   - Consider using TanStack Table with ShadCN
   - Built-in sorting, filtering, pagination
   - More powerful than manual implementation

2. **Command Palette**
   - Use ShadCN Command component
   - Quick actions (⌘K): "Add player", "Search players"
   - Improved power-user experience

3. **Player details sidebar**
   - Use ShadCN Sheet component
   - Slide-in panel with full player details
   - Alternative to dialog for viewing

4. **Drag-and-drop reordering**
   - Use dnd-kit library with ShadCN
   - Reorder players manually
   - Better UX for custom sorting

5. **Export functionality**
   - Export player list to CSV/PDF
   - Use ShadCN DropdownMenu for export options
   - Helpful for record-keeping

### Long-term Maintenance

1. **Component documentation**
   - Add JSDoc comments to all components
   - Document prop types and usage
   - Helpful for team collaboration

2. **Storybook stories**
   - Create stories for all ShadCN components
   - Document variants and states
   - Living component documentation

3. **Unit tests**
   - Test component rendering
   - Test user interactions
   - Test accessibility

4. **E2E tests**
   - Test full CRUD flows
   - Test form validation
   - Test role-based rendering

### Documentation Updates

1. **Update implementation plan**
   - Mark completed sections
   - Update with ShadCN component usage
   - Add screenshots of redesigned UI

2. **Create migration guide**
   - Document all breaking changes
   - Provide before/after examples
   - Help other developers migrate similar views

3. **Update README**
   - Document ShadCN usage
   - Link to component documentation
   - Note accessibility improvements

---

## Summary

This redesign plan provides a comprehensive path to modernize the Players view using ShadCN components while preserving 100% of existing functionality. The migration prioritizes:

- **Visual consistency** through design tokens and component composition
- **Accessibility** via built-in ARIA attributes and keyboard navigation
- **Developer experience** with simpler, more maintainable component APIs
- **User experience** through better animations, focus management, and feedback

All components, state management, server actions, and validation logic remain functionally identical - only the UI layer is modernized using battle-tested ShadCN primitives.
