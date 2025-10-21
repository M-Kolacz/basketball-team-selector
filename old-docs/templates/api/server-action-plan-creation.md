<db-plan>
{{db-plan}} <- replace with reference to @db-plan.md
</db-plan>

<prd>
{{prd}} <- replace with reference to @prd.md
</prd>

<tech-stack>
{{tech-stack}} <- replace with reference to @tech-stack.md
</tech-stack>

You are an experienced Next.js architect whose task is to create a comprehensive
server actions plan. Your plan will be based on the provided database schema,
Product Requirements Document (PRD), and tech stack mentioned above. Carefully
review the inputs and perform the following steps:

1. Analyze the database schema:
   - Identify main entities (tables)
   - Note relationships between entities
   - Consider any indexes that may impact server action design
   - Pay attention to validation conditions specified in the schema.

2. Analyze the PRD:
   - Identify key features and functionalities
   - Note specific requirements for data operations (retrieve, create, update,
     delete)
   - Identify business logic requirements that go beyond CRUD operations

3. Consider the tech stack:
   - Ensure the server actions plan is compatible with the specified
     technologies.
   - Consider how these technologies may influence server action design

4. Create a comprehensive server actions plan:
   - Define main server actions based on database entities and PRD requirements
   - Design CRUD actions for each resource
   - Design actions for business logic described in the PRD
   - Include pagination, filtering, and sorting for list actions.
   - Plan appropriate function signatures and parameters
   - Define input parameter structures and return types
   - Include authentication and authorization mechanisms if mentioned in the PRD
   - Consider rate limiting and other security measures

Before delivering the final plan, work inside <action_analysis> tags in your
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

## 1. Resources

- List each main resource and its corresponding database table

## 2. Server Actions

For each resource provide:

- Action name (function name)
- Brief description
- Input parameters (with types)
- Return type structure
- Success return structure
- Error handling approach (thrown errors or error objects)

## 3. Authentication and Authorization

- Describe authentication mechanism and implementation details
- Explain how auth is verified within server actions

## 4. Validation and Business Logic

- List validation conditions for each resource
- Describe how business logic is implemented in server actions
- Explain use of 'use server' directive and server-side validation

## 5. File Organization

- Describe where server actions will be located (e.g., src/actions/)
- Explain grouping strategy (by resource, by feature, etc.)
```

Ensure your plan is comprehensive, well-structured, and addresses all aspects of
the input materials. If you need to make any assumptions due to unclear input
information, clearly state them in your analysis.

The final output should consist solely of the server actions plan in markdown
format in English, which you will save in .ai/server-actions-plan.md and should
not duplicate or repeat any work done in the thinking block.
