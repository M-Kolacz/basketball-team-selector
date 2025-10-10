/**
 * Game Sessions Table Schema
 * @description Manages basketball game events and their associated team selections
 * @module db/schema/gameSessions
 *
 * Business logic:
 * - A game session represents a scheduled basketball event
 * - Can have multiple team propositions (different balancing strategies)
 * - One proposition can be selected as the final team composition
 * - Game scores are stored as JSONB array for flexibility
 *
 * Relationships:
 * - One-to-many with propositions (session can have multiple team proposals)
 * - One-to-one with selected proposition (nullable, set when admin selects final teams)
 *
 * Index strategy:
 * - game_datetime indexed for chronological queries and event listing
 * - selected_proposition_id indexed for joining selected teams
 */

import {
	pgTable,
	uuid,
	timestamp,
	text,
	jsonb,
	index,
} from 'drizzle-orm/pg-core'

/**
 * Structure for individual game scores
 * @description Represents the score of a single game played during the session
 */
export interface GameScore {
	/** Team A's final score */
	team_a_score: number
	/** Team B's final score */
	team_b_score: number
}

/**
 * Game Sessions table
 * @description Stores information about basketball game events and results
 *
 * Access patterns:
 * - Query upcoming games (ORDER BY game_datetime ASC)
 * - Query past games with results (WHERE game_datetime < NOW())
 * - Fetch session with selected teams (JOIN on selected_proposition_id)
 *
 * @example
 * // Query upcoming game sessions
 * const upcoming = await db.select().from(gameSessions)
 *   .where(gte(gameSessions.gameDateTime, new Date()))
 *   .orderBy(asc(gameSessions.gameDateTime));
 *
 * @example
 * // Create a new game session
 * const newSession = await db.insert(gameSessions).values({
 *   gameDateTime: new Date('2025-10-15T18:00:00Z'),
 *   description: 'Weekly pickup game at Main Court',
 *   games: []
 * });
 */
export const gameSessions = pgTable(
	'game_sessions',
	{
		/**
		 * Unique identifier for the game session
		 * @description Auto-generated UUID, used as primary key
		 */
		id: uuid('id').defaultRandom().primaryKey(),

		/**
		 * Scheduled date and time for the game
		 * @description Used to organize and filter past/upcoming games
		 */
		gameDateTime: timestamp('game_datetime', { withTimezone: true }).notNull(),

		/**
		 * Optional description or notes about the game
		 * @description Can include location, special rules, or event details
		 * @example 'Weekly pickup at Main Court, bring white/dark jerseys'
		 */
		description: text('description'),

		/**
		 * Array of game scores played during this session
		 * @description JSONB array storing multiple game results
		 * Default empty array for new sessions
		 *
		 * @example
		 * [
		 *   { "team_a_score": 32, "team_b_score": 28 },
		 *   { "team_a_score": 32, "team_b_score": 30 }
		 * ]
		 */
		games: jsonb('games').$type<GameScore[]>().notNull().default([]),

		/**
		 * Reference to the selected team proposition
		 * @description Foreign key to propositions table, nullable until admin selects teams
		 * Set to NULL if selected proposition is deleted (ON DELETE SET NULL)
		 */
		selectedPropositionId: uuid('selected_proposition_id'),

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
		 * Index for chronological queries
		 * @description Enables efficient sorting and filtering by date (DESC for recent first)
		 * Used in: upcoming games list, past games history
		 */
		gameDateTimeIdx: index('idx_game_sessions_game_datetime').on(
			table.gameDateTime.desc(),
		),

		/**
		 * Index for selected proposition joins
		 * @description Optimizes lookups when fetching selected team compositions
		 */
		selectedPropositionIdx: index('idx_game_sessions_selected_proposition').on(
			table.selectedPropositionId,
		),
	}),
)

/**
 * Type exports for use throughout the application
 */

/**
 * GameSession type for SELECT operations
 * @description Represents a complete game session record from the database
 */
export type GameSession = typeof gameSessions.$inferSelect

/**
 * NewGameSession type for INSERT operations
 * @description Represents data needed to create a new game session
 * Optional fields: id, games (defaults to []), selectedPropositionId, createdAt, updatedAt
 */
export type NewGameSession = typeof gameSessions.$inferInsert
