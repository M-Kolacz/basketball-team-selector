# Drizzle Schema Generation Prompt

````
You are a TypeScript and Database Schema Expert specializing in Drizzle ORM.
This project uses Drizzle ORM for type-safe database interactions and schema management.

Create a comprehensive Drizzle schema based on the following database documentation:

<db-documentation>
{{db-documentation}} <- pass reference to your database documentation
</db-documentation>

## Creating Schema Files

Given the context of the database documentation, create Drizzle schema files inside the folder `src/db/schema/`.

### File Structure Guidelines:
1. **Main schema file**: `src/db/schema/index.ts` - exports all table schemas
2. **Individual table files**: `src/db/schema/[tableName].ts` - one file per table or logical group
3. **Relations file**: `src/db/schema/relations.ts` - defines all table relationships
4. **Enums file** (if needed): `src/db/schema/enums.ts` - defines all enum types

File naming conventions:
- Use camelCase for file names (e.g., `userProfiles.ts`, `orderItems.ts`)
- Group related tables in the same file when appropriate
- Keep the schema modular and maintainable

## Drizzle Schema Guidelines

Write TypeScript code for Drizzle schema that:

### General Requirements:
- Uses appropriate Drizzle imports from the correct dialect package (e.g., `drizzle-orm/pg-core` for PostgreSQL, `drizzle-orm/mysql-core` for MySQL)
- Includes comprehensive JSDoc comments explaining the purpose of each table and column
- Follows TypeScript best practices with proper type annotations
- Uses consistent naming conventions (camelCase for schema objects, snake_case for database columns)

### Table Definition Requirements:
- Define tables using the appropriate table function (e.g., `pgTable`, `mysqlTable`, `sqliteTable`)
- Include all columns with proper data types and constraints
- Specify primary keys, foreign keys, and indexes
- Add default values where appropriate
- Include timestamps (createdAt, updatedAt) for audit trails
- Define unique constraints and check constraints as needed

### Column Definition Guidelines:
- Use the most specific column type available (e.g., `uuid()` instead of `text()` for UUIDs)
- Apply NOT NULL constraints appropriately
- Include column-level comments for documentation
- Use proper numeric types (integer, bigint, decimal, real) based on data requirements
- Implement proper string length limits where applicable
- Add custom validation using `.check()` when needed

### Relations Definition:
- Define all relationships using Drizzle's relations API
- Specify one-to-one, one-to-many, and many-to-many relationships clearly
- Include relation names for clarity
- Document cascade behaviors and referential actions

### Type Safety Requirements:
- Export inferred types for each table using Drizzle's type helpers
- Create insert and select schemas using Drizzle's schema helpers
- Define custom types for complex column types
- Ensure all schemas are fully type-safe

### Example Structure:

```typescript
// src/db/schema/users.ts
import { pgTable, uuid, text, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Users table storing authentication and profile information
 * @description Core table for user management with authentication details
 */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).unique(),
  hashedPassword: text('hashed_password').notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    emailIdx: index('email_idx').on(table.email),
    usernameIdx: index('username_idx').on(table.username),
  };
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
````

## Special Considerations:

1. **For PostgreSQL schemas:**
   - Use appropriate PostgreSQL-specific column types (uuid, jsonb, array types,
     etc.)
   - Implement RLS (Row Level Security) considerations in comments
   - Include schema names if using multiple schemas
   - Define custom types and domains where applicable

2. **For MySQL schemas:**
   - Use MySQL-specific types and constraints
   - Consider storage engine requirements (InnoDB for foreign keys)
   - Handle auto-increment properly

3. **For SQLite schemas:**
   - Work within SQLite's type limitations
   - Handle foreign key constraints appropriately
   - Consider WAL mode requirements

4. **Enum Handling:**
   - Define enums using Drizzle's pgEnum, mysqlEnum, or custom implementations
   - Export enum schemas for reuse
   - Document enum values and their meanings

5. **Index Strategy:**
   - Create indexes for foreign keys
   - Add composite indexes for common query patterns
   - Include partial indexes where beneficial
   - Document the reasoning behind each index

6. **Migration Compatibility:**
   - Ensure schema can be used with drizzle-kit for migration generation
   - Include migration markers and version comments
   - Consider backward compatibility

### Code Quality Requirements:

- Add ESLint disable comments only when necessary with explanations
- Follow the project's TypeScript configuration
- Ensure no circular dependencies between schema files
- Keep schema files focused and cohesive
- Use consistent formatting (Prettier-compatible)

### Documentation Requirements:

Each schema file should include:

- File header with purpose and dependencies
- Table-level JSDoc comments explaining business logic
- Column-level comments for non-obvious fields
- Relationship explanations in the relations file
- Example usage patterns in comments
- Security considerations and access patterns

The generated Drizzle schema should be production-ready, fully typed,
well-documented, and optimized for both development experience and runtime
performance.

```

```
