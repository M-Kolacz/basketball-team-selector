import { prisma, type SkillTier, type Position } from '#app/lib/db.server'
import {
	type PlayersListAdminResponseDto,
	type PlayersListUserResponseDto,
	type PlayerAdminDto,
	type PlayerUserDto,
} from '#app/types/dto'

export type ListPlayersOptions = {
	page: number
	limit: number
	sort: 'name' | 'skillTier' | 'createdAt'
	skillTier?: SkillTier
	position?: Position
	isAdmin: boolean
}

/**
 * Retrieves a paginated list of players with role-based filtering and data exposure.
 * Admin users can filter by skill tier and position and receive full player details.
 * Regular users receive only basic player information without filtering.
 */
export async function listPlayers(
	options: ListPlayersOptions,
): Promise<PlayersListAdminResponseDto | PlayersListUserResponseDto> {
	const { page, limit, sort, skillTier, position, isAdmin } = options
	const skip = (page - 1) * limit

	// Build where clause (only apply filters for admin users)
	const where = isAdmin
		? {
				...(skillTier && { skillTier }),
				...(position && { positions: { has: position } }),
			}
		: {}

	// Build select clause based on role
	const select = isAdmin
		? {
				id: true,
				name: true,
				skillTier: true,
				positions: true,
				createdAt: true,
				updatedAt: true,
			}
		: {
				id: true,
				name: true,
				createdAt: true,
			}

	// Execute parallel queries for data and count
	const [players, total] = await Promise.all([
		prisma.player.findMany({
			where,
			select,
			skip,
			take: limit,
			orderBy: { [sort]: 'asc' },
		}),
		prisma.player.count({ where }),
	])

	const totalPages = Math.ceil(total / limit)

	// Return role-appropriate response
	if (isAdmin) {
		return {
			players: players as PlayerAdminDto[],
			pagination: {
				page,
				limit,
				total,
				totalPages,
			},
		}
	}

	return {
		players: players as PlayerUserDto[],
		pagination: {
			page,
			limit,
			total,
			totalPages,
		},
	}
}
