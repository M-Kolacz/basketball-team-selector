<conversation_summary> <decisions>

1. Dashboard displays upcoming games and recent results in single section
2. Non-admin users see only player names, no skills/positions
3. Team propositions displayed side-by-side
4. Drag-and-drop for player swaps between teams
5. Inline form errors using Conform library
6. Team propositions stored in database, no client state needed
7. Simple spinner for loading states
8. Hamburger menu navigation using Shadcn components
9. Failed server actions show form errors with resubmit
10. Checkbox list for player selection
11. Single form combining date and player selection
12. Inline score display in game lists
13. Table layout for player roster using Shadcn Table
14. Icon buttons for edit/delete in rows
15. Lock UI during AI generation
16. Separate login page for authentication
17. Native HTML datetime-local input
18. Text-only empty states
19. Fixed header with hamburger menu
20. Checkboxes for multiple position selection
21. Immediate player deletion without confirmation
22. Explicit form submission for all actions
23. Player count badges on teams for odd distributions
24. No breadcrumb navigation
25. Loading state in submit buttons
26. Highlight valid drop zones during drag
27. Tailwind default breakpoints (md: 768px)
28. Load all games at once, no pagination
29. Page updates via navigation, no toast notifications
30. Absolute datetime format for games </decisions> <matched_recommendations>

MVP-focused simplicity: single sections, no tabs, minimal UI complexity
Role-based visibility: hide sensitive data (skills/positions) from non-admins
Desktop-optimized layouts: side-by-side propositions, table for data Progressive
enhancement: drag-drop with clear visual feedback Server action integration:
Conform validation, database storage, explicit submissions Shadcn components:
consistent UI with hamburger menu, tables, buttons Mobile responsiveness: fixed
header, Tailwind breakpoints, native inputs Clear user feedback: inline errors,
loading states in buttons, count badges Simplified navigation: no breadcrumbs,
redirects over notifications Direct actions: immediate deletion, icon buttons
for speed </matched_recommendations>

<ui_architecture_planning_summary> Main UI Architecture Requirements:

Single-page forms with explicit submission to server actions Role-based
rendering (admin vs user views) Database-driven state (no complex client state)
5-minute team selection workflow priority

Key Views & User Flows:

Auth: Separate login/signup pages → redirect to dashboard Dashboard: Single
section showing games + results Players: Table view with inline CRUD for admins
Game Creation: Date/players form → AI generation → proposition display Team
Management: Side-by-side cards with drag-drop swapping → final selection

API Integration & State Management:

Server actions handle all mutations via Conform forms Database stores all
persistent state (propositions, teams) URL state for navigation only React state
for temporary UI (drag-drop) No client-side caching needed

Responsiveness & Accessibility:

Tailwind breakpoints (md: 768px) Fixed header + hamburger (mobile) Native form
inputs for compatibility Checkbox patterns for multi-select Shadcn components
ensure ARIA compliance

Security Considerations:

JWT authentication via cookies Role checks in server action transforms UI locks
during async operations Separate pages for auth (proper redirects)
</ui_architecture_planning_summary>

<unresolved_issues>

Drag-drop library selection not specified (recommend @dnd-kit for React 19)
Error boundary strategy for server action failures Session timeout handling
approach Offline capability requirements Team proposition comparison metrics
display format </unresolved_issues>

</conversation_summary>
