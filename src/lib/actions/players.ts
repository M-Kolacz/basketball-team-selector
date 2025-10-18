'use server'

import { playersListQuerySchema } from '#app/lib/validations/player'
import { listPlayers } from '#app/services/player.service'
import {
	type PlayersListAdminResponseDto,
	type PlayersListUserResponseDto,
} from '#app/types/dto'

/**
 * TODO: Import from auth utilities when implemented
 * This should return the current user from session/JWT
 */
async function getUser() {
	// Placeholder - will be implemented with auth system
	// For now, return null (unauthenticated user)
	return null as { id: string; username: string; role: 'admin' | 'user' } | null
}

export type GetPlayersParams = {
	page?: number
	limit?: number
	sort?: 'name' | 'skill_tier' | 'created_at'
	skillTier?: 'S' | 'A' | 'B' | 'C' | 'D'
	position?: 'PG' | 'SG' | 'SF' | 'PF' | 'C'
}

/**
 * Retrieves a paginated list of players with role-based filtering.
 * Admin users can filter by skill tier and position and receive full player details.
 * Regular users receive only basic player information without filtering.
 *
 * @param params - Optional query parameters for pagination, sorting, and filtering
 * @returns Role-appropriate player list with pagination metadata
 * @throws Error if validation fails or database operation fails
 *
 * @example
 * // Admin user with filters
 * const result = await getPlayersAction({
 *   page: 1,
 *   limit: 20,
 *   sort: 'skill_tier',
 *   skillTier: 'S',
 *   position: 'PG'
 * })
 *
 * @example
 * // Regular user (filters ignored)
 * const result = await getPlayersAction({ page: 1 })
 */
export async function getPlayersAction(
	params?: GetPlayersParams,
): Promise<PlayersListAdminResponseDto | PlayersListUserResponseDto> {
	try {
		// 1. Get current user and determine admin role
		const user = await getUser()
		const isAdmin = user?.role === 'admin'

		// 2. Validate input parameters with defaults
		const validatedParams = playersListQuerySchema.parse(params ?? {})

		// 3. Transform sort field from snake_case to camelCase for Prisma
		const sortField =
			validatedParams.sort === 'skill_tier'
				? 'skillTier'
				: validatedParams.sort === 'created_at'
					? 'createdAt'
					: 'name'

		// 4. Filter out admin-only parameters for non-admin users (security)
		const serviceOptions = {
			page: validatedParams.page,
			limit: validatedParams.limit,
			sort: sortField as 'name' | 'skillTier' | 'createdAt',
			// Only pass filters if user is admin, otherwise silently ignore
			...(isAdmin && validatedParams.skillTier
				? { skillTier: validatedParams.skillTier }
				: {}),
			...(isAdmin && validatedParams.position
				? { position: validatedParams.position }
				: {}),
			isAdmin,
		}

		// 5. Call service layer
		const result = await listPlayers(serviceOptions)

		return result
	} catch (error) {
		// Log error for monitoring (in production, use proper logging service)
		console.error('Failed to fetch players:', error)

		// Throw generic error to avoid exposing internal details
		if (error instanceof Error && error.name === 'ZodError') {
			throw new Error('Invalid query parameters')
		}

		throw new Error('Failed to fetch players')
	}
}
