/**
 * Database Relations Configuration
 * @description Defines all foreign key relationships between tables using Drizzle's relations API
 * @module db/schema/relations
 *
 * Relationship Overview:
 * 1. game_sessions -> propositions (one-to-many)
 *    - A game session can have multiple team propositions (different balancing strategies)
 *    - Cascade delete: deleting a session deletes all its propositions
 *
 * 2. game_sessions -> selected_proposition (one-to-one, nullable)
 *    - A game session can have one selected proposition for the final teams
 *    - Set null on delete: deleting a proposition nullifies the selection
 *
 * 3. propositions -> game_sessions (many-to-one)
 *    - Each proposition belongs to exactly one game session
 *
 * Note: The players and users tables don't have explicit relationships in the MVP,
 * but the schema is designed to support future relationships (e.g., users creating sessions)
 */

import { relations } from 'drizzle-orm'
import { gameSessions } from './gameSessions'
import { propositions } from './propositions'

/**
 * Game Sessions relations
 * @description Defines relationships from the game_sessions table perspective
 */
export const gameSessionsRelations = relations(
	gameSessions,
	({ many, one }) => ({
		/**
		 * One-to-many: Game session to propositions
		 * @description A game session can have multiple team composition proposals
		 * Each proposition represents a different balancing strategy (position_focused, skill_balanced, general)
		 *
		 * Cascade behavior: ON DELETE CASCADE
		 * - When a game session is deleted, all associated propositions are automatically deleted
		 *
		 * @example
		 * // Query session with all propositions
		 * const session = await db.query.gameSessions.findFirst({
		 *   where: eq(gameSessions.id, sessionId),
		 *   with: { propositions: true }
		 * });
		 */
		propositions: many(propositions),

		/**
		 * One-to-one: Game session to selected proposition (nullable)
		 * @description References the proposition that was chosen as the final team composition
		 * Nullable because:
		 * - New sessions don't have a selected proposition yet
		 * - Admin must explicitly select one of the generated propositions
		 *
		 * Cascade behavior: ON DELETE SET NULL
		 * - If the selected proposition is deleted, the reference is set to NULL
		 * - The game session remains but needs a new proposition to be selected
		 *
		 * @example
		 * // Query session with selected proposition details
		 * const session = await db.query.gameSessions.findFirst({
		 *   where: eq(gameSessions.id, sessionId),
		 *   with: { selectedProposition: true }
		 * });
		 */
		selectedProposition: one(propositions, {
			fields: [gameSessions.selectedPropositionId],
			references: [propositions.id],
		}),
	}),
)

/**
 * Propositions relations
 * @description Defines relationships from the propositions table perspective
 */
export const propositionsRelations = relations(propositions, ({ one }) => ({
	/**
	 * Many-to-one: Proposition to game session
	 * @description Each proposition belongs to exactly one game session
	 * Multiple propositions can share the same game session but use different balancing strategies
	 *
	 * Cascade behavior: ON DELETE CASCADE (from game_sessions side)
	 * - Deleting the parent session removes all child propositions
	 *
	 * @example
	 * // Query proposition with parent session details
	 * const proposition = await db.query.propositions.findFirst({
	 *   where: eq(propositions.id, propositionId),
	 *   with: { gameSession: true }
	 * });
	 */
	gameSession: one(gameSessions, {
		fields: [propositions.gameSessionId],
		references: [gameSessions.id],
	}),
}))

/**
 * Future relations to consider for post-MVP iterations:
 *
 * 1. users -> game_sessions (one-to-many)
 *    - Track which user created each game session
 *    - Enable user-specific session filtering
 *
 * 2. players -> propositions (many-to-many through JSONB)
 *    - Currently handled via JSONB in team_composition
 *    - Could be normalized to a join table for better querying
 *
 * 3. users -> propositions (one-to-many)
 *    - Track which user generated or modified each proposition
 *    - Enable audit trail for team changes
 */
