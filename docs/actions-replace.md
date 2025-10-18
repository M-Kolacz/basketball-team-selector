You will be converting a Next.js project template from using REST API endpoints
to using Next.js server actions. The template is written in Markdown format and
contains instructions or examples that currently reference REST API patterns.

Here is the markdown template that needs to be converted:

<markdown_template> {{MARKDOWN_TEMPLATE}} </markdown_template>

Your task is to rewrite this template content to use Next.js server actions
instead of REST API endpoints, while maintaining the same overall structure and
purpose of the template.

Here are the key conversion principles to follow:

**REST API to Server Actions Conversions:**

- Replace references to API routes (like `/api/users`, `/api/posts`) with server
  action function calls
- Convert HTTP methods (GET, POST, PUT, DELETE) to appropriate server action
  patterns
- Replace `fetch()` calls with direct server action invocations
- Convert API endpoint creation instructions to server action function creation
- Replace middleware concepts with server action validation patterns
- Convert request/response handling to server action input/output patterns

**Common Pattern Conversions:**

- `POST /api/users` → `createUser()` server action
- `GET /api/users/:id` → `getUserById(id)` server action
- `PUT /api/users/:id` → `updateUser(id, data)` server action
- `DELETE /api/users/:id` → `deleteUser(id)` server action
- `fetch('/api/endpoint')` → `await serverAction()`
- API route files (`/api/users.js`) → server action files (`actions/users.js`)

**Technical Details to Update:**

- Replace `req.body`, `req.query` with function parameters
- Convert `res.json()` returns to direct return statements
- Update error handling from HTTP status codes to thrown errors or error objects
- Replace API middleware with server action validation
- Convert authentication checks to server action patterns
- Update file organization from `/pages/api/` to `/app/actions/` or similar

**Preserve:**

- The overall learning objectives and goals
- The step-by-step structure
- Code comments and explanations (but update their content)
- The complexity level and scope of examples

<scratchpad>
Before writing the converted template, I should:
1. Identify all REST API references in the original template
2. Plan how each API concept maps to server actions
3. Ensure the conversion maintains the educational value
4. Check that all code examples are updated consistently
5. Verify that the new approach follows Next.js server action best practices
</scratchpad>

Convert the template content systematically, ensuring that:

- All REST API terminology is replaced with server action equivalents
- Code examples demonstrate proper server action syntax and patterns
- The learning progression remains logical and clear
- Any file paths, imports, or project structure references are updated
  appropriately

Your final output should be the complete converted markdown template with all
REST API references replaced by Next.js server action patterns, maintaining the
same educational structure and clarity as the original.
