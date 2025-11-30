import { type Position, type SkillTier } from '#app/lib/db.server'

export const POSITION_LABELS: Record<Position, string> = {
	PG: 'Point Guard',
	SG: 'Shooting Guard',
	SF: 'Small Forward',
	PF: 'Power Forward',
	C: 'Center',
}

export const SKILL_TIER_LABELS: Record<SkillTier, string> = {
	S: 'S-Tier',
	A: 'A-Tier',
	B: 'B-Tier',
	C: 'C-Tier',
	D: 'D-Tier',
}

export const SKILL_TIER_COLORS: Record<SkillTier, string> = {
	S: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
	A: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
	B: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
	C: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
	D: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
}
