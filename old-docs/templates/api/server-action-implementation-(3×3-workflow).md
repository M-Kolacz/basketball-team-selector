Your task is to implement a Next.js server action based on the provided
implementation plan. Your goal is to create a solid and well-organized
implementation that includes appropriate validation, error handling, and follows
all logical steps described in the plan.

First, carefully review the provided implementation plan:

<implementation_plan> @docs/backend/actions/user-register.md
</implementation_plan>

<types>
@src/types/dto.ts
</types>

<implementation_approach> Implement a maximum of 3 steps from the implementation
plan, briefly summarize what you've done, and describe the plan for the next 3
actions - stop work at this point and wait for my feedback.
</implementation_approach>

Now perform the following steps to implement the server action:

1. Analyze the implementation plan:
   - Determine the type of operation (create, read, update, delete, etc.)
   - List all expected input parameters
   - Understand the required business logic and data processing stages
   - Note any special requirements for validation or error handling.

2. Begin implementation:
   - Create the server action file with 'use server' directive
   - Define the async server action function
   - Configure function parameters based on expected inputs (FormData or typed
     objects)
   - Implement input validation for all parameters
   - Follow the logical steps described in the implementation plan
   - Implement error handling for each stage of the process
   - Ensure proper data processing and transformation according to requirements
   - Return appropriate response object with success/error states

3. Validation and error handling:
   - Implement thorough input validation for all parameters
   - Return structured error responses with clear messages
   - Handle potential exceptions that may occur during processing
   - Use try-catch blocks for database operations and external calls
   - Consider using zod or similar for schema validation

4. Testing considerations:
   - Consider edge cases and potential issues that should be tested.
   - Ensure the implementation covers all scenarios mentioned in the plan.

5. Documentation:
   - Add clear comments to explain complex logic or important decisions
   - Include JSDoc documentation for the server action and any helper functions.

After completing the implementation, ensure it includes all necessary imports,
function definitions, and any additional helper functions or classes required
for the implementation.

If you need to make any assumptions or have any questions about the
implementation plan, present them before writing code.

Remember to follow Next.js server action best practices, adhere to TypeScript
style guidelines, and ensure the code is clean, readable, and well-organized.
