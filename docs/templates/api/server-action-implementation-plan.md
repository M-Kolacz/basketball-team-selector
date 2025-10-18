You are an experienced software architect whose task is to create a detailed
implementation plan for a Next.js server action. Your plan will guide the
development team in effectively and correctly implementing this server action.

Before we begin, review the following information:

1. Server action specification: <server_action_specification>

#### registerUser(data: RegisterUserInput): Promise<RegisterUserResult>

- **Description:** Register new user account (server action)
- **Location:** `src/actions/auth.ts`
- **Input Parameters:**

```typescript
{
	username: string; // max 50 chars
	password: string; // min 8 chars
	confirmPassword: string; // must match password
}
```

- **Return Value:**

```typescript
{
	success: true;
	data: {
		user: {
			id: string; // uuid
			username: string;
			role: "user";
		}
	}
}
// OR
{
	success: false;
	error: {
		code: "USERNAME_EXISTS" | "VALIDATION_ERROR";
		message: string;
		fields?: Record<string, string>; // field-specific errors
	}
}
```

- **Side Effects:** JWT token saved in cookie
- **Error Scenarios:**
  - Username already exists
  - Validation errors (password mismatch, invalid format, missing fields)

</server_action_specification>

2. Related database resources: <related_db_resources> @docs/db.md
   </related_db_resources>

3. Type definitions: <type_definitions> @src/types/dto.ts</type_definitions>

4. Tech stack: <tech_stack>@docs/tech-stack.md</tech_stack>

Your task is to create a comprehensive implementation plan for the server action.
Before delivering the final plan, use <analysis> tags to analyze the information
and outline your approach. In this analysis, ensure that:

1. Summarize key points of the server action specification.
2. List required and optional input parameters from the specification.
3. List necessary DTO types, Command Models, and Zod schemas.
4. Consider how to extract logic to a service (existing or new, if it doesn't
   exist).
5. Plan input validation using Zod schemas according to the server action
   specification, database resources, and implementation rules.
6. Determine how to log errors in the error table (if applicable).
7. Identify potential security threats based on the server action specification
   and tech stack.
8. Outline potential error scenarios and corresponding error codes/messages.

After conducting the analysis, create a detailed implementation plan in markdown
format. The plan should contain the following sections:

1. Server Action Overview
2. Input Details
3. Output Details
4. Data Flow
5. Security Considerations
6. Error Handling
7. Performance
8. Implementation Steps

Throughout the plan, ensure that you:

- Use consistent error response patterns:
  - Return `{ success: false, error: { code, message, fields? } }` for expected
    errors
  - Throw errors for unexpected/server errors
  - Use specific error codes (e.g., `USERNAME_EXISTS`, `VALIDATION_ERROR`)
  - Include field-level validation errors when applicable
- Adapt to the provided tech stack
- Follow the provided implementation rules
- Use Zod for input validation
- Properly mark server actions with `'use server'` directive
- Handle authorization checks within the action
- Return type-safe results

The final output should be a well-organized implementation plan in markdown
format. Here's an example of what the output should look like:

```markdown
# Server Action Implementation Plan: [Action Name]

## 1. Server Action Overview

[Brief description of server action purpose and functionality]

## 2. Input Details

- Function Name: [actionName]
- File Location: [path/to/file.ts]
- Parameters:
  - Required: [List of required parameters with types]
  - Optional: [List of optional parameters with types]
- Input Validation: [Zod schema or validation approach]

## 3. Used Types

[DTOs, Command Models, and Zod schemas necessary for implementation]

## 4. Output Details

[Expected return value structure for success and error cases]

## 5. Data Flow

[Description of data flow, including interactions with external services or
databases]

## 6. Security Considerations

[Authentication, authorization, and data validation details]

## 7. Error Handling

[List of potential errors and how to handle them with error codes]

## 8. Performance Considerations

[Potential bottlenecks and optimization strategies]

## 9. Implementation Steps

1. [Step 1]
2. [Step 2]
3. [Step 3] ...
```

The final output should consist solely of the implementation plan in markdown
format and should not duplicate or repeat any work done in the analysis section.

Remember to save your implementation plan as
@docs/actions/user-register-action.md. Ensure the plan is detailed, clear, and
provides comprehensive guidance for the development team.
