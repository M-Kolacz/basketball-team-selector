/**
 * Database Enum Types
 * @description PostgreSQL enum types used across the Basketball Team Selector schema
 * @module db/schema/enums
 */

import { pgEnum } from 'drizzle-orm/pg-core'

/**
 * User role enum
 * @description Defines the authorization levels for users in the system
 * - admin: Full system access with administrative privileges
 * - user: Standard user access with limited permissions
 */
export const userRoleEnum = pgEnum('user_role_enum', ['admin', 'user'])

/**
 * Skill tier enum
 * @description Player skill tiers used for team balancing calculations
 * Point values used in application logic:
 * - S = 5 points (Elite/Professional level)
 * - A = 4 points (Advanced/Highly skilled)
 * - B = 3 points (Intermediate/Competent)
 * - C = 2 points (Beginner/Developing)
 * - D = 1 point (Novice/Learning)
 */
export const skillTierEnum = pgEnum('skill_tier_enum', [
	'S',
	'A',
	'B',
	'C',
	'D',
])

/**
 * Basketball position enum
 * @description Standard basketball positions for player classification
 * - PG: Point Guard (primary ball handler and playmaker)
 * - SG: Shooting Guard (perimeter scoring and defense)
 * - SF: Small Forward (versatile wing player)
 * - PF: Power Forward (inside-outside game, rebounding)
 * - C: Center (rim protection, post play)
 */
export const positionEnum = pgEnum('position_enum', [
	'PG',
	'SG',
	'SF',
	'PF',
	'C',
])

/**
 * Proposition type enum
 * @description Team generation strategies for creating balanced matchups
 * - position_focused: Prioritizes positional coverage and balance
 * - skill_balanced: Focuses on equal skill point distribution between teams
 * - general: Balanced approach considering both positions and skills
 */
export const propositionTypeEnum = pgEnum('proposition_type_enum', [
	'position_focused',
	'skill_balanced',
	'general',
])

/**
 * Type exports for use in application code
 */
export type UserRole = (typeof userRoleEnum.enumValues)[number]
export type SkillTier = (typeof skillTierEnum.enumValues)[number]
export type Position = (typeof positionEnum.enumValues)[number]
export type PropositionType = (typeof propositionTypeEnum.enumValues)[number]
