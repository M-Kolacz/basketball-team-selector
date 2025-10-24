As a senior frontend developer, your task is to create a detailed implementation
plan for a new view in a web application. This plan should be comprehensive and
clear enough for another frontend developer to implement the view correctly and
efficiently.

First, review the following information:

1. Product Requirements Document (PRD): <prd> @docs/prd.md </prd>

2. View Description: <view_description> ### Login Page

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
  - ARIA labels for screen readers </view_description>

3. User Stories: <user_stories> ### Primary Journey: Admin Game Creation and
   Team Selection

1. **Authentication Phase**
   - Admin arrives at login page (/)
   - Enters credentials and submits form
   - System validates and redirects to games list (/games) </user_stories>

1. Server Action Description: <server_action_description>
   {{server-action-description}} <- paste server action descriptions from
   server-actions-plan.md that the view will use </server_action_description>

1. Server Action Implementation: <server_action_implementation>

   </server_action_implementation>

1. Type Definitions: <type_definitions>@src/types/dto.ts </type_definitions>

1. Tech Stack: <tech_stack> @docs/tech-stack.md </tech_stack>

Before creating the final implementation plan, conduct analysis and planning
inside <implementation_breakdown> tags in your thinking block. This section can
be quite long, as it's important to be thorough.

In your implementation breakdown, execute the following steps:

1. For each input section (PRD, User Stories, Server Action Description, Server
   Action Implementation, Type Definitions, Tech Stack):

- Summarize key points
- List any requirements or constraints
- Note any potential challenges or important issues

2. Extract and list key requirements from the PRD
3. List all needed main components, along with a brief description of their
   purpose, needed types, handled events, and validation conditions
4. Create a high-level component tree diagram
5. Identify required DTOs and custom ViewModel types for each view component.
   Explain these new types in detail, breaking down their fields and associated
   types.
6. Identify potential state variables and custom hooks, explaining their purpose
   and how they'll be used
7. List required server actions and corresponding frontend integrations
8. Map each user story to specific implementation details, components, or
   functions
9. List user interactions and their expected outcomes
10. List conditions required by server actions and how to verify them at the
    component level
11. Identify potential error scenarios and suggest how to handle them
12. List potential challenges related to implementing this view and suggest
    possible solutions

After conducting the analysis, provide an implementation plan in Markdown format
with the following sections:

1. Overview: Brief summary of the view and its purpose.
2. View Routing: Specify the path where the view should be accessible.
3. Component Structure: Outline of main components and their hierarchy.
4. Component Details: For each component, describe:

- Component description, its purpose and what it consists of
- Main HTML elements and child components that build the component
- Handled events
- Validation conditions (detailed conditions, according to server action
  requirements)
- Types (DTO and ViewModel) required by the component
- Props that the component accepts from parent (component interface)

5. Types: Detailed description of types required for view implementation,
   including exact breakdown of any new types or view models by fields and
   types.
6. State Management: Detailed description of how state is managed in the view,
   specifying whether a custom hook is required.
7. Server Action Integration: Explanation of how to integrate with the provided
   server actions. Precisely indicate input parameters and return types.
8. User Interactions: Detailed description of user interactions and how to
   handle them.
9. Conditions and Validation: Describe what conditions are verified by the
   interface, which components they concern, and how they affect the interface
   state
10. Error Handling: Description of how to handle potential errors or edge cases
    from server actions.
11. Implementation Steps: Step-by-step guide for implementing the view.

Ensure your plan is consistent with the PRD, user stories, and includes the
provided tech stack.

The final output should be in English and saved in a file named
/docs/pages/login.md Do not include any analysis and planning in the final
output.

Here's an example of what the output file should look like (content is to be
replaced):

```markdown
# View Implementation Plan [View Name]

## 1. Overview

[Brief description of the view and its purpose]

## 2. View Routing

[Path where the view should be accessible]

## 3. Component Structure

[Outline of main components and their hierarchy]

## 4. Component Details

### [Component Name 1]

- Component description [description]
- Main elements: [description]
- Handled interactions: [list]
- Handled validation: [list, detailed]
- Types: [list]
- Props: [list]

### [Component Name 2]

[...]

## 5. Types

[Detailed description of required types]

## 6. State Management

[Description of state management in the view]

## 7. Server Action Integration

[Explanation of integration with provided server actions, indication of input
parameters and return types]

## 8. User Interactions

[Detailed description of user interactions]

## 9. Conditions and Validation

[Detailed description of conditions and their validation]

## 10. Error Handling

[Description of handling potential errors]

## 11. Implementation Steps

1. [Step 1]
2. [Step 2]
3. [...]
```

Begin analysis and planning now. Your final output should consist solely of the
implementation plan in English in markdown format, which you will save in the
/docs/pages/login-view-implementation-plan.md file and should not duplicate or
repeat any work done in the implementation breakdown.
