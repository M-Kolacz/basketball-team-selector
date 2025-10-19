import {
	type SortOption,
	type FilterState,
	type ValidationErrors,
} from '#app/app/players/types'
import {
	type PlayerAdminDto,
	type PlayerUserDto,
	type Position,
	type SkillTier,
} from '#app/types/dto'

/**
 * Filter and sort players based on current filter state and sort option
 */
export function filterAndSortPlayers(
	players: PlayerAdminDto[] | PlayerUserDto[],
	filterState: FilterState,
	sortBy: SortOption,
	isAdmin: boolean,
): PlayerAdminDto[] | PlayerUserDto[] {
	let filtered = [...players]

	// Apply search filter
	if (filterState.searchQuery) {
		const query = filterState.searchQuery.toLowerCase()
		filtered = filtered.filter((player) =>
			player.name.toLowerCase().includes(query),
		)
	}

	// Apply admin-only filters
	if (isAdmin) {
		const adminPlayers = filtered as PlayerAdminDto[]

		if (filterState.skillTier) {
			filtered = adminPlayers.filter(
				(player) => player.skillTier === filterState.skillTier,
			)
		}

		if (filterState.position) {
			filtered = adminPlayers.filter((player) =>
				player.positions.includes(filterState.position!),
			)
		}
	}

	// Apply sorting
	filtered.sort((a, b) => {
		switch (sortBy) {
			case 'name':
				return a.name.localeCompare(b.name)
			case 'created_at':
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			case 'skill_tier':
				if (isAdmin) {
					const adminA = a as PlayerAdminDto
					const adminB = b as PlayerAdminDto
					const tierOrder = { S: 0, A: 1, B: 2, C: 3, D: 4 }
					return tierOrder[adminA.skillTier] - tierOrder[adminB.skillTier]
				}
				return 0
			default:
				return 0
		}
	})

	return filtered
}

/**
 * Validate player name
 */
export function validatePlayerName(
	name: string,
	existingNames?: string[],
): string[] {
	const errors: string[] = []

	if (!name || name.trim().length === 0) {
		errors.push('Name is required')
	} else if (name.trim().length < 2) {
		errors.push('Name must be at least 2 characters')
	} else if (name.trim().length > 50) {
		errors.push('Name must not exceed 50 characters')
	}

	if (existingNames && existingNames.includes(name.trim())) {
		errors.push('A player with this name already exists')
	}

	return errors
}

/**
 * Validate positions selection
 */
export function validatePositions(positions: Position[]): string[] {
	const errors: string[] = []

	if (!positions || positions.length === 0) {
		errors.push('At least one position must be selected')
	}

	return errors
}

/**
 * Validate skill tier
 */
export function validateSkillTier(skillTier: SkillTier | ''): string[] {
	const errors: string[] = []

	if (!skillTier) {
		errors.push('Skill tier is required')
	}

	const validTiers: SkillTier[] = ['S', 'A', 'B', 'C', 'D']
	if (skillTier && !validTiers.includes(skillTier as SkillTier)) {
		errors.push('Invalid skill tier')
	}

	return errors
}

/**
 * Validate entire player form
 */
export function validatePlayerForm(
	name: string,
	skillTier: SkillTier | '',
	positions: Position[],
	existingNames?: string[],
): ValidationErrors {
	const errors: ValidationErrors = {}

	const nameErrors = validatePlayerName(name, existingNames)
	if (nameErrors.length > 0) {
		errors.name = nameErrors
	}

	const skillTierErrors = validateSkillTier(skillTier)
	if (skillTierErrors.length > 0) {
		errors.skillTier = skillTierErrors
	}

	const positionsErrors = validatePositions(positions)
	if (positionsErrors.length > 0) {
		errors.positions = positionsErrors
	}

	return errors
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date
	return d.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})
}

/**
 * Format datetime for display
 */
export function formatDateTime(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date
	return d.toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

/**
 * Check if player data has changed
 */
export function hasPlayerChanged(
	original: PlayerAdminDto,
	updated: { name: string; skillTier: SkillTier; positions: Position[] },
): boolean {
	if (original.name !== updated.name) return true
	if (original.skillTier !== updated.skillTier) return true
	if (original.positions.length !== updated.positions.length) return true

	const originalPositionsSorted = [...original.positions].sort()
	const updatedPositionsSorted = [...updated.positions].sort()

	return !originalPositionsSorted.every(
		(pos, idx) => pos === updatedPositionsSorted[idx],
	)
}
