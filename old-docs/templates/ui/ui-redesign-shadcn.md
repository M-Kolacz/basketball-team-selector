As a senior frontend architect, your task is to redesign an existing UI view
using ShadCN components that are already installed in this project. This
redesign should modernize the interface, improve consistency, enhance
accessibility, and maintain all existing functionality while leveraging the
ShadCN component library.

First, review the following information:

1. Current View Implementation: <current_view> {{current-view-file-path}} <-
   paste the path to the existing view file </current_view>

2. Product Requirements Document (PRD): <prd> @docs/prd.md </prd>

3. View Implementation Plan (if exists): <view_plan>
   {{view-implementation-plan-path}} <- paste the path if exists, or indicate
   "N/A" </view_plan>

4. Available ShadCN Components: <shadcn_components> @src/components/ui/
   </shadcn_components>

5. ShadCN Configuration: <shadcn_config> @components.json </shadcn_config>

6. Type Definitions: <type_definitions> @src/types/dto.ts </type_definitions>

7. Tech Stack: <tech_stack> @docs/tech-stack.md </tech_stack>

Before creating the final redesign plan, conduct analysis inside
<redesign_analysis> tags in your thinking block. This section should be
thorough.

In your redesign analysis, execute the following steps:

1. **Current Implementation Analysis:**
   - List all existing components and their structure
   - Identify current UI patterns and custom components
   - Note existing user interactions and behaviors
   - Document current state management approach
   - Identify server action integrations
   - List accessibility features currently implemented

2. **ShadCN Component Mapping:**
   - For each current UI element, identify the appropriate ShadCN component
     replacement
   - List ShadCN components available in the project (from src/components/ui/)
   - Note any custom components that should remain
   - Identify gaps where ShadCN components may need customization
   - Document component composition opportunities (e.g., Card + Form + Button)

3. **Design Improvements:**
   - Identify visual consistency improvements through ShadCN
   - Note accessibility enhancements from ShadCN components
   - Suggest UX improvements while maintaining functionality
   - Document spacing, typography, and color system improvements
   - Identify responsive design enhancements

4. **Migration Strategy:**
   - List components to replace in priority order
   - Identify breaking changes or behavior differences
   - Note any props or API changes required
   - Document state management adjustments needed
   - List validation and error handling changes

5. **Functionality Preservation:**
   - Ensure all user interactions remain functional
   - Verify server action integrations are maintained
   - Confirm validation logic is preserved
   - Check that all error states are handled
   - Ensure loading states are properly displayed

6. **Accessibility & Performance:**
   - Document accessibility improvements from ShadCN
   - Note ARIA attributes and keyboard navigation
   - Identify performance optimizations
   - List SEO improvements if applicable

After conducting the analysis, provide a redesign plan in Markdown format with
the following sections:

## 1. Redesign Overview

Brief summary of the redesign goals, scope, and expected improvements.

## 2. Current vs. Redesigned Structure

### Current Structure

[Outline of current component hierarchy and UI elements]

### Redesigned Structure

[Outline of new component hierarchy using ShadCN components]

## 3. ShadCN Component Mapping

Table mapping current UI elements to ShadCN components:

| Current Element | Current Implementation | ShadCN Component | Component Path         | Notes                           |
| --------------- | ---------------------- | ---------------- | ---------------------- | ------------------------------- |
| Login form      | Custom form            | Form + Card      | @/components/ui/form   | Use react-hook-form integration |
| Submit button   | Custom button          | Button           | @/components/ui/button | Multiple variants available     |
| ...             | ...                    | ...              | ...                    | ...                             |

## 4. Component Redesign Details

### [Component Name 1]

**Current Implementation:**

- Description of current approach
- Current props and behavior

**Redesigned Implementation:**

- ShadCN components to use
- New composition structure
- Props mapping from current to new
- Behavior changes (if any)
- Accessibility improvements
- Example code structure

### [Component Name 2]

[...]

## 5. Visual Design Changes

- **Typography:** Changes to font sizes, weights, line heights using ShadCN
  defaults
- **Spacing:** Improvements to padding, margins, gaps using Tailwind spacing
  scale
- **Colors:** Migration to ShadCN/Tailwind color system and CSS variables
- **Borders & Shadows:** Consistent use of ShadCN styling patterns
- **Responsive Design:** Breakpoint and layout improvements

## 6. Functionality Preservation

### User Interactions

- List of all user interactions and how they're maintained in the redesign
- Event handler mapping from current to redesigned implementation

### Server Actions

- List of server actions and their integration points
- Any changes to how server actions are called or handled
- Error handling approach with ShadCN components

### Validation

- Current validation approach
- How validation will work with ShadCN Form components
- Error display using ShadCN patterns

### State Management

- Current state management
- Any changes needed for ShadCN components
- Custom hooks that need updating

## 7. Accessibility Improvements

- ARIA attributes provided by ShadCN components
- Keyboard navigation enhancements
- Screen reader improvements
- Focus management improvements
- Color contrast and visual accessibility

## 8. Breaking Changes & Considerations

- List of any breaking changes in component APIs
- Behavioral differences to be aware of
- Migration challenges and solutions
- Testing requirements

## 9. Implementation Steps

1. **Preparation Phase**
   - Review all ShadCN components to be used
   - Verify components are installed and properly configured
   - Update type definitions if needed

2. **Component Migration** (in priority order)
   - Step-by-step replacement of components
   - Testing after each major component replacement
   - Maintaining functionality throughout

3. **Styling & Polish**
   - Apply consistent spacing and typography
   - Implement responsive design improvements
   - Fine-tune colors and visual hierarchy

4. **Validation & Error Handling**
   - Integrate validation with ShadCN Form components
   - Implement error states using ShadCN patterns
   - Test all error scenarios

5. **Accessibility Testing**
   - Keyboard navigation testing
   - Screen reader testing
   - ARIA attribute verification

6. **Final Testing & Refinement**
   - Cross-browser testing
   - Responsive design testing
   - User interaction testing
   - Performance testing

## 10. Code Examples

### Before (Current Implementation)

```tsx
[Example of current component code]
```

### After (Redesigned with ShadCN)

```tsx
[Example of redesigned component code using ShadCN]
```

## 11. Additional Recommendations

- Suggestions for further improvements beyond the immediate redesign
- Opportunities to leverage other ShadCN components
- Long-term maintenance considerations
- Documentation updates needed

---

Ensure your redesign plan:

- Maintains all existing functionality
- Uses only ShadCN components available in the project
- Follows the existing tech stack and conventions
- Improves accessibility and user experience
- Provides clear migration path from current to redesigned implementation
- Includes concrete code examples for complex changes

The final output should be in English and saved in a file named:
`/docs/redesigns/[view-name]-shadcn-redesign.md`

Do not include the analysis in the final output - only the redesign plan.
