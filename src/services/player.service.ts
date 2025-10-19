import {
	prisma,
	type SkillTier,
	type Position,
	type User,
} from '#app/lib/db.server'
import {
	type PlayersListAdminResponseDto,
	type PlayersListUserResponseDto,
	type PlayerAdminDto,
	type PlayerUserDto,
	type CreatePlayerCommandDto,
	type UpdatePlayerCommandDto,
} from '#app/types/dto'

export type ListPlayersOptions = {
	page: number
	limit: number
	sort: 'name' | 'skillTier' | 'createdAt'
	skillTier?: SkillTier
	position?: Position
	isAdmin: boolean
}

export type ListAllPlayersOptions = {
	sort?: 'name' | 'skillTier' | 'createdAt'
	skillTier?: SkillTier
	position?: Position
	isAdmin: boolean
}

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

const options = {
	user: {
		select: { id: true, name: true, createdAt: true },
	},
	admin: {
		select: {
			id: true,
			name: true,
			skillTier: true,
			positions: true,
			createdAt: true,
			updatedAt: true,
		},
	},
} as const

export async function listAllPlayers(
	userRole: User['role'],
): Promise<PlayerAdminDto[] | PlayerUserDto[]> {
	const players = await prisma.player.findMany({
		select: options[userRole].select,
	})

	return players
}

export async function createPlayer(
	data: CreatePlayerCommandDto,
): Promise<PlayerAdminDto> {
	const player = await prisma.player.create({
		data: {
			name: data.name,
			skillTier: data.skillTier,
			positions: data.positions,
		},
		select: {
			id: true,
			name: true,
			skillTier: true,
			positions: true,
			createdAt: true,
			updatedAt: true,
		},
	})

	return player
}

export async function deletePlayer(id: string): Promise<void> {
	await prisma.player.delete({
		where: { id },
	})
}

export async function updatePlayer(
	id: string,
	data: UpdatePlayerCommandDto,
): Promise<PlayerAdminDto> {
	const player = await prisma.player.update({
		where: { id },
		data: {
			...data,
		},
		select: {
			id: true,
			name: true,
			skillTier: true,
			positions: true,
			createdAt: true,
			updatedAt: true,
		},
	})

	return player
}
