You are an experienced software architect whose task is to create a detailed
implementation plan for a Next.js Server Action. Your plan will guide the
development team in effectively and correctly implementing this server action.

Before we begin, review the following information:

1. Server Action specification: <server_action_specification>

#### registerUser Server Action

- **Description:** Register new user account (server-side mutation)
- **Function Signature:** `async function registerUser(formData: FormData): Promise<ActionResult<User>>`
- **Input Parameters:**

```typescript
{
	username: string // max 50 chars
	password: string // min 8 chars
	confirmPassword: string // must match password
}
```

- **Return Type:**

```typescript
{
	success: true
	data: {
		id: string // uuid
		username: string
		role: "user"
	}
}
// OR
{
	success: false
	error: {
		message: string
		fieldErrors?: Record<string, string[]>
	}
}
```

- **Success:** User created, JWT token saved in cookie, returns user data
- **Errors:**
  - Username already exists
  - Validation errors (password mismatch, invalid format, missing fields)

    </server_action_specification>

2. Related database resources: <related_db_resources> @docs/db.md
   </related_db_resources>

3. Type definitions: <type_definitions> @src/types/dto.ts</type_definitions>

4. Tech stack: <tech_stack>@docs/tech-stack.md</tech_stack>

Your task is to create a comprehensive implementation plan for the Server Action.
Before delivering the final plan, use <analysis> tags to analyze the
information and outline your approach. In this analysis, ensure that:

1. Summarize key points of the server action specification.
2. List required and optional parameters from the specification.
3. List necessary DTO types, validation schemas, and result types.
4. Consider how to extract logic to a service (existing or new, if it doesn't
   exist).
5. Plan input validation using Zod or similar (according to specification, database
   resources, and implementation rules).
6. Determine how to log errors in the error table (if applicable).
7. Identify potential security threats (considering server actions run server-side).
8. Outline potential error scenarios and how to return structured errors.

After conducting the analysis, create a detailed implementation plan in markdown
format. The plan should contain the following sections:

1. Server Action Overview
2. Input Details
3. Return Type Details
4. Data Flow
5. Security Considerations
6. Error Handling
7. Performance Considerations
8. Implementation Steps

Throughout the plan, ensure that you:

- Use 'use server' directive appropriately
- Handle FormData extraction and validation properly
- Return structured ActionResult types (success/error objects)
- Consider revalidation and cache invalidation strategies
- Implement proper error handling without exposing sensitive details
- Follow Next.js server action best practices
- Adapt to the provided tech stack
- Follow the provided implementation rules

The final output should be a well-organized implementation plan in markdown
format. Here's an example of what the output should look like:

```markdown

# Server Action Implementation Plan: [Action Name]

## 1. Server Action Overview

[Brief description of server action purpose and functionality]

## 2. Input Details

- Function Signature: [TypeScript function signature]
- Input Source: [FormData/direct parameters]
- Parameters:
  - Required: [List of required parameters with types]
  - Optional: [List of optional parameters with types]
- Validation Schema: [Zod schema structure]

## 3. Used Types

[DTOs, validation schemas, and result types necessary for implementation]

## 4. Return Type Details

[Expected return structure for success and error cases]

## 5. Data Flow

[Description of data flow, including:
- Input extraction and validation
- Service layer interactions
- Database operations
- Cookie/session management
- Revalidation/cache invalidation]

## 6. Security Considerations

[Authentication, authorization, input sanitization, and rate limiting details]

## 7. Error Handling

[List of potential errors and how to handle them:
- Validation errors (field-level)
- Business logic errors
- Database errors
- Unexpected errors]

## 8. Performance Considerations

[Potential bottlenecks and optimization strategies:
- Database query optimization
- Caching strategies
- Revalidation strategies]

## 9. Implementation Steps

1. [Step 1]
2. [Step 2]
3. [Step 3] ...

```

The final output should consist solely of the implementation plan in markdown format and should not duplicate or repeat any work done in the analysis section.

Remember to save your implementation plan as @docs/actions/[action-name].md. Ensure the plan is detailed, clear, and provides comprehensive guidance for the development team.
