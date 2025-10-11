/**
 * Propositions Table Schema
 * @description Team composition proposals for game sessions
 * @module db/schema/propositions
 *
 * Business logic:
 * - Each proposition represents a different team balancing strategy
 * - Three types: position_focused, skill_balanced, and general
 * - Stores complete team compositions as JSONB for flexibility
 * - Tracks balancing metrics (skill differential, position coverage)
 * - Version field allows multiple iterations of same proposition type
 *
 * Relationships:
 * - Many-to-one with game_sessions (multiple proposals per session)
 * - One-to-one back reference from game_sessions (selected proposition)
 *
 * Index strategy:
 * - game_session_id for fetching all propositions for a session
 * - type for filtering by balancing strategy
 * - is_selected for quick lookup of selected propositions
 * - Composite index on (game_session_id, version) for versioning queries
 */

import {
	pgTable,
	uuid,
	integer,
	jsonb,
	decimal,
	boolean,
	timestamp,
	index,
} from 'drizzle-orm/pg-core'
import { propositionTypeEnum, type Position, type SkillTier } from './enums'

/**
 * Individual player information within a team composition
 */
export interface TeamPlayer {
	/** Player's unique identifier */
	id: string
	/** Player's full name */
	name: string
	/** Player's skill tier (S, A, B, C, or D) */
	skill_tier: SkillTier
	/** Positions the player can play */
	positions: Position[]
}

/**
 * Position coverage map for a team
 * @description Indicates whether each basketball position is covered by the team
 */
export interface PositionCoverage {
	/** Point Guard coverage */
	PG: boolean
	/** Shooting Guard coverage */
	SG: boolean
	/** Small Forward coverage */
	SF: boolean
	/** Power Forward coverage */
	PF: boolean
	/** Center coverage */
	C: boolean
}

/**
 * Single team composition details
 */
export interface TeamDetails {
	/** Array of players assigned to this team */
	players: TeamPlayer[]
	/** Sum of all players' skill points on this team */
	total_skill_points: number
	/** Map of positions covered by this team */
	position_coverage: PositionCoverage
}

/**
 * Complete team composition structure
 * @description Stores both teams with all balancing information
 */
export interface TeamComposition {
	/** Team A composition and statistics */
	team_a: TeamDetails
	/** Team B composition and statistics */
	team_b: TeamDetails
}

/**
 * Propositions table
 * @description Stores team composition proposals with balancing metrics
 *
 * Access patterns:
 * - Fetch all propositions for a game session (WHERE game_session_id = ?)
 * - Get selected proposition (WHERE is_selected = true AND game_session_id = ?)
 * - Filter by proposition type (WHERE type = ?)
 * - Get latest version of a type (ORDER BY version DESC LIMIT 1)
 *
 * @example
 * // Query all propositions for a game session
 * const proposals = await db.select().from(propositions)
 *   .where(eq(propositions.gameSessionId, sessionId))
 *   .orderBy(asc(propositions.type), desc(propositions.version));
 *
 * @example
 * // Create a new proposition
 * const newProposition = await db.insert(propositions).values({
 *   gameSessionId: sessionId,
 *   type: 'skill_balanced',
 *   teamComposition: { team_a: {...}, team_b: {...} },
 *   skillDifferential: 0.5,
 *   positionCoverageScore: 9.8
 * });
 */
export const propositions = pgTable(
	'propositions',
	{
		/**
		 * Unique identifier for the proposition
		 * @description Auto-generated UUID, used as primary key
		 */
		id: uuid('id').defaultRandom().primaryKey(),

		/**
		 * Reference to the parent game session
		 * @description Foreign key to game_sessions table
		 * Cascades on delete (if session deleted, all propositions deleted)
		 */
		gameSessionId: uuid('game_session_id').notNull(),

		/**
		 * Team balancing strategy type
		 * @description Indicates which algorithm was used to generate teams
		 * - position_focused: Prioritizes positional balance
		 * - skill_balanced: Prioritizes equal skill distribution
		 * - general: Balanced approach
		 */
		type: propositionTypeEnum('type').notNull(),

		/**
		 * Proposition version number
		 * @description Increments when proposition is regenerated
		 * Allows tracking multiple iterations of same type
		 * @default 1
		 */
		version: integer('version').notNull().default(1),

		/**
		 * Complete team composition data
		 * @description JSONB object containing both teams with all player details
		 * Includes players, skill points, and position coverage for each team
		 *
		 * @example
		 * {
		 *   "team_a": {
		 *     "players": [{ "id": "uuid", "name": "John", "skill_tier": "A", "positions": ["PG"] }],
		 *     "total_skill_points": 20,
		 *     "position_coverage": { "PG": true, "SG": true, "SF": true, "PF": true, "C": true }
		 *   },
		 *   "team_b": { ... }
		 * }
		 */
		teamComposition: jsonb('team_composition')
			.$type<TeamComposition>()
			.notNull(),

		/**
		 * Skill point difference between teams
		 * @description Absolute difference in total skill points
		 * Lower values indicate more balanced teams
		 * Precision: 5 digits total, 2 decimal places
		 *
		 * @example 0.50 means teams differ by 0.5 skill points (very balanced)
		 * @example 3.00 means teams differ by 3 skill points (less balanced)
		 */
		skillDifferential: decimal('skill_differential', {
			precision: 5,
			scale: 2,
		}).notNull(),

		/**
		 * Position coverage quality score
		 * @description Metric indicating how well positions are covered
		 * Higher scores indicate better positional balance
		 * Precision: 5 digits total, 2 decimal places
		 *
		 * @example 10.00 = perfect coverage (all positions covered on both teams)
		 * @example 8.00 = good coverage (most positions covered)
		 * @example 5.00 = poor coverage (significant position gaps)
		 */
		positionCoverageScore: decimal('position_coverage_score', {
			precision: 5,
			scale: 2,
		}).notNull(),

		/**
		 * Indicates if this proposition was selected by admin
		 * @description Only one proposition per session should have is_selected = true
		 * @default false
		 */
		isSelected: boolean('is_selected').default(false),

		/**
		 * Number of times this proposition has been regenerated
		 * @description Tracks how many times the algorithm was re-run
		 * @default 0
		 */
		regenerationCount: integer('regeneration_count').default(0),

		/**
		 * Record creation timestamp
		 * @description Automatically set on insert
		 */
		createdAt: timestamp('created_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => ({
		/**
		 * Index for fetching propositions by game session
		 * @description Primary access pattern for loading all proposals for a session
		 */
		gameSessionIdIdx: index('idx_propositions_game_session_id').on(
			table.gameSessionId,
		),

		/**
		 * Index for filtering by proposition type
		 * @description Enables quick filtering by balancing strategy
		 */
		typeIdx: index('idx_propositions_type').on(table.type),

		/**
		 * Index for finding selected propositions
		 * @description Optimizes queries for selected team compositions
		 */
		isSelectedIdx: index('idx_propositions_is_selected').on(table.isSelected),

		/**
		 * Composite index for version queries
		 * @description Enables efficient lookups of proposition versions within a session
		 * Useful for: "get latest version of each type for this session"
		 */
		gameSessionVersionIdx: index('idx_propositions_game_session_version').on(
			table.gameSessionId,
			table.version,
		),
	}),
)

/**
 * Type exports for use throughout the application
 */

/**
 * Proposition type for SELECT operations
 * @description Represents a complete proposition record from the database
 */
export type Proposition = typeof propositions.$inferSelect

/**
 * NewProposition type for INSERT operations
 * @description Represents data needed to create a new proposition
 * Optional fields: id, version (defaults to 1), isSelected (defaults to false),
 * regenerationCount (defaults to 0), createdAt (auto-generated)
 */
export type NewProposition = typeof propositions.$inferInsert
