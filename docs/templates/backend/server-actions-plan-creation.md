<db-plan>
 @db.md
</db-plan>
<prd>
@prd.md
</prd>
<tech-stack>
@tech-stack.md
</tech-stack>

You are an experienced Next.js architect whose task is to create a comprehensive
server actions plan. Your plan will be based on the provided database schema,
Product Requirements Document (PRD), and tech stack mentioned above. Carefully
review the inputs and perform the following steps:

1. Analyze the database schema:
   - Identify main entities (tables)
   - Note relationships between entities
   - Consider any indexes that may impact server action design
   - Pay attention to validation conditions specified in the schema

2. Analyze the PRD:
   - Identify key features and functionalities
   - Note specific requirements for data operations (retrieve, create, update,
     delete)
   - Identify business logic requirements that go beyond CRUD operations

3. Consider the tech stack:
   - Ensure the server actions plan is compatible with the specified
     technologies
   - Consider how Next.js App Router and React Server Components influence the
     design

4. Create a comprehensive server actions plan:
   - Define main action modules based on database entities and PRD requirements
   - Design CRUD server actions for each resource
   - Design server actions for business logic described in the PRD
   - Plan appropriate return types and error handling
   - Define input validation schemas (using zod)
   - Include authentication and authorization checks if mentioned in the PRD
   - Plan for proper revalidation strategies (revalidatePath, revalidateTag)

Before delivering the final plan, work inside <actions_analysis> tags in your
thinking block to break down your thought process and ensure you've covered all
necessary aspects. In this section:

1. List main entities from the database schema. Number each entity and quote the
   relevant part of the schema.
2. List key business logic features from the PRD. Number each feature and quote
   the relevant part of the PRD.
3. Map features from the PRD to potential server actions. For each feature,
   consider at least two possible action designs and explain which one you chose
   and why.
4. Consider and list any security and performance requirements. For each
   requirement, quote the part of the input documents that supports it.
5. Explicitly map business logic from the PRD to server actions.
6. Include validation conditions from the database schema in the server actions
   plan.

This section may be quite long.

The final server actions plan should be formatted in markdown and include the
following sections:

```markdown
# Server Actions Plan

## 1. Action Modules

- List each main module and its corresponding database table/entity
- Specify file organization (e.g., src/lib/actions/[module-name].ts)

## 2. Server Actions

For each module provide:

- Action name and async function signature
- Purpose/description
- Input parameters with TypeScript types - first argument of server action is
  previous state that is not used but second argument formData contains all
  informations to perform a server action based on the zod schema.
- Validation schema (using zod)
- Return type (success data or error)
- Database operations performed
- Revalidation strategy (paths/tags to revalidate)
- Error handling approach

## 3. Authentication and Authorization

- Describe authentication checks within server actions
- Implementation details for protecting sensitive actions

## 4. Validation and Business Logic

- List validation schemas for each action module
- Describe how business logic is implemented within server actions
- Error boundaries and error handling strategies

## 5. Type Safety

- Shared types between client and server using a common types from
  src/lib/db.server.ts
- Input/output type definitions
- Error type definitions
```

Ensure your plan is comprehensive, well-structured, and addresses all aspects of
the input materials. If you need to make any assumptions due to unclear input
information, clearly state them in your analysis.

The final output should consist solely of the server actions plan in markdown
format in English, which you will save in .ai/server-actions-plan.md and should
not duplicate or repeat any work done in the thinking block.
