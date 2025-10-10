/**
 * Players Table Schema
 * @description Player roster and skill information for team selection
 * @module db/schema/players
 *
 * Business logic:
 * - Each player has a skill tier (S through D) used for balancing teams
 * - Players can have multiple positions (e.g., PG/SG combo guard)
 * - Position array stored as PostgreSQL array type for efficient querying
 *
 * Index strategy:
 * - skill_tier indexed for quick filtering during team generation
 * - positions GIN indexed for array containment queries
 * - name indexed for search functionality
 */

import { pgTable, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core'
import { skillTierEnum, positionEnum } from './enums'

/**
 * Players table
 * @description Stores player information including skill levels and positions
 *
 * Access patterns:
 * - Filter by skill tier for team balancing algorithms
 * - Search by name for player selection UI
 * - Query by position for position-focused team generation
 *
 * @example
 * // Query players by skill tier
 * const aPlayers = await db.select().from(players).where(eq(players.skillTier, 'A'));
 *
 * @example
 * // Query players who can play point guard
 * const pointGuards = await db.select().from(players)
 *   .where(sql`${players.positions} && ARRAY['PG']::position_enum[]`);
 */
export const players = pgTable(
	'players',
	{
		/**
		 * Unique identifier for the player
		 * @description Auto-generated UUID, used as primary key
		 */
		id: uuid('id').defaultRandom().primaryKey(),

		/**
		 * Player's full name
		 * @description Max 100 characters, must be unique across all players
		 */
		name: varchar('name', { length: 100 }).notNull().unique(),

		/**
		 * Player's skill tier
		 * @description Used in team balancing calculations
		 * Point values: S=5, A=4, B=3, C=2, D=1
		 */
		skillTier: skillTierEnum('skill_tier').notNull(),

		/**
		 * Basketball positions the player can play
		 * @description PostgreSQL array of position enums
		 * Can be empty array if positions not yet assigned
		 * Multiple positions indicate positional versatility
		 *
		 * @example ['PG', 'SG'] for a combo guard
		 * @example ['C'] for a traditional center
		 */
		positions: positionEnum('positions').array().notNull().default([]),

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
	},
	(table) => ({
		/**
		 * Index for filtering players by skill tier
		 * @description Used in team generation algorithms to group players by skill level
		 */
		skillTierIdx: index('idx_players_skill_tier').on(table.skillTier),

		/**
		 * Index for searching players by name
		 * @description Supports player search functionality in the UI
		 */
		nameIdx: index('idx_players_name').on(table.name),

		/**
		 * GIN index for position array queries
		 * @description Enables efficient array containment queries (e.g., finding all PGs)
		 * Uses GIN (Generalized Inverted Index) for array operations
		 */
		positionsIdx: index('idx_players_positions').using('gin', table.positions),
	}),
)

/**
 * Type exports for use throughout the application
 */

/**
 * Player type for SELECT operations
 * @description Represents a complete player record from the database
 */
export type Player = typeof players.$inferSelect

/**
 * NewPlayer type for INSERT operations
 * @description Represents data needed to create a new player
 * Optional fields: id, positions (defaults to []), createdAt, updatedAt (auto-generated)
 */
export type NewPlayer = typeof players.$inferInsert
