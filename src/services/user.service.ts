import { prisma } from '#app/lib/db.server'
import {
	type UsersListResponseDto,
	type UserWithTimestampsDto,
} from '#app/types/dto'

export type ListUsersOptions = {
	page: number
	limit: number
	sort: 'username' | 'created_at'
}

export async function listUsers(
	options: ListUsersOptions,
): Promise<UsersListResponseDto> {
	const { page, limit, sort } = options
	const skip = (page - 1) * limit

	const orderByField = sort === 'created_at' ? 'createdAt' : 'username'

	const [users, total] = await Promise.all([
		prisma.user.findMany({
			skip,
			take: limit,
			orderBy: { [orderByField]: 'asc' },
			select: {
				id: true,
				username: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
		}),
		prisma.user.count(),
	])

	const totalPages = Math.ceil(total / limit)

	return {
		users: users as UserWithTimestampsDto[],
		pagination: {
			page,
			limit,
			total,
			totalPages,
		},
	}
}
