/**
 * Database Schema Index
 * @description Central export point for all Drizzle ORM schema definitions
 * @module db/schema
 *
 * This file exports all tables, relations, types, and enums used throughout the application.
 * Import from this file rather than individual schema files for consistency.
 *
 * @example
 * // Import tables for queries
 * import { users, players, gameSessions, propositions } from '#app/db/schema';
 *
 * @example
 * // Import types for type safety
 * import type { User, NewPlayer, GameSession, Proposition } from '#app/db/schema';
 *
 * @example
 * // Import enums for validation
 * import { SkillTier, Position, PropositionType } from '#app/db/schema';
 */

// ============================================================================
// Enums
// ============================================================================
export {
	userRoleEnum,
	skillTierEnum,
	positionEnum,
	propositionTypeEnum,
	type UserRole,
	type SkillTier,
	type Position,
	type PropositionType,
} from './enums'

// ============================================================================
// Table Schemas
// ============================================================================

/**
 * Users table and types
 * @description Authentication and user management
 */
export { users, type User, type NewUser } from './users'

/**
 * Players table and types
 * @description Player roster with skill tiers and positions
 */
export { players, type Player, type NewPlayer } from './players'

/**
 * Game Sessions table and types
 * @description Basketball game events and scheduling
 */
export {
	gameSessions,
	type GameSession,
	type NewGameSession,
	type GameScore,
} from './gameSessions'

/**
 * Propositions table and types
 * @description Team composition proposals with balancing metrics
 */
export {
	propositions,
	type Proposition,
	type NewProposition,
	type TeamComposition,
	type TeamDetails,
	type TeamPlayer,
	type PositionCoverage,
} from './propositions'

// ============================================================================
// Relations
// ============================================================================

/**
 * Table relationships
 * @description Foreign key relationships and cascade behaviors
 */
export { gameSessionsRelations, propositionsRelations } from './relations'

// ============================================================================
// Schema Object for Drizzle Client
// ============================================================================

/**
 * Complete schema object containing all tables and relations
 * @description Use this when initializing the Drizzle client for relational queries
 *
 * @example
 * import { drizzle } from 'drizzle-orm/postgres-js';
 * import postgres from 'postgres';
 * import * as schema from '#app/db/schema';
 *
 * const client = postgres(process.env.DATABASE_URL!);
 * const db = drizzle(client, { schema });
 */
export * as schema from './index'
