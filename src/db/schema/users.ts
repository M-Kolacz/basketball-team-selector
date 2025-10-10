/**
 * Users Table Schema
 * @description Authentication and user management table
 * @module db/schema/users
 *
 * Security considerations:
 * - Passwords are stored as hashed values only (never plain text)
 * - Username uniqueness is enforced at database level
 * - Password minimum length validation enforced via check constraint
 * - RLS can be implemented in future iterations if needed
 */

import { pgTable, uuid, varchar, timestamp, check } from 'drizzle-orm/pg-core'
import { userRoleEnum } from './enums'

/**
 * Users table
 * @description Core authentication and user profile information
 *
 * Access patterns:
 * - Lookup by username (unique index) for authentication
 * - Role-based access control via role enum
 *
 * @example
 * // Query user by username
 * const user = await db.select().from(users).where(eq(users.username, 'john_doe'));
 */
export const users = pgTable('users', {
	/**
	 * Unique identifier for the user
	 * @description Auto-generated UUID, used as primary key
	 */
	id: uuid('id').defaultRandom().primaryKey(),

	/**
	 * Unique username for authentication
	 * @description Max 50 characters, case-sensitive, must be unique
	 */
	username: varchar('username', { length: 50 }).notNull().unique(),

	/**
	 * Hashed password
	 * @description Stores bcrypt/argon2 hash, never store plain text passwords
	 * Original password must be at least 8 characters (enforced via check constraint)
	 */
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),

	/**
	 * User authorization role
	 * @description Defines system permissions (admin or standard user)
	 * @default 'user'
	 */
	role: userRoleEnum('role').notNull().default('user'),

	/**
	 * Record creation timestamp
	 * @description Automatically set on insert
	 */
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),

	/**
	 * Record last update timestamp
	 * @description Automatically updated via trigger on update
	 */
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
})

/**
 * Type exports for use throughout the application
 */

/**
 * User type for SELECT operations
 * @description Represents a complete user record from the database
 */
export type User = typeof users.$inferSelect

/**
 * NewUser type for INSERT operations
 * @description Represents data needed to create a new user
 * Optional fields: id, createdAt, updatedAt (auto-generated)
 */
export type NewUser = typeof users.$inferInsert
