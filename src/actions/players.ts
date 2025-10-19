'use server'

import { redirect } from 'next/navigation'
import { type SkillTier, type Position } from '#app/lib/db.server'
import { CreatePlayerSchema } from '#app/lib/validations/player'
import { getCurrentUser } from '#app/services/auth.server'
import {
	listAllPlayers,
	createPlayer as createPlayerService,
} from '#app/services/player.service'

export async function getPlayers() {
	const currentUser = await getCurrentUser()

	if (!currentUser) redirect('/login')

	const players = await listAllPlayers(currentUser.role)

	return players
}

export async function createPlayer(
	name: string,
	skillTier: SkillTier,
	positions: Position[],
) {
	const currentUser = await getCurrentUser()

	if (!currentUser) {
		return {
			success: false,
			error: {
				code: 'UNAUTHORIZED',
				message: 'Authentication required',
			},
		}
	}

	if (currentUser.role !== 'admin') {
		return {
			success: false,
			error: {
				code: 'UNAUTHORIZED',
				message: 'Insufficient permissions',
			},
		}
	}

	const validationResult = CreatePlayerSchema.safeParse({
		name,
		skillTier,
		positions,
	})

	if (!validationResult.success) {
		const fieldErrors = validationResult.error.flatten().fieldErrors
		return {
			success: false,
			error: {
				code: 'VALIDATION_ERROR',
				message: 'Invalid player data',
				fields: fieldErrors,
			},
		}
	}

	const player = await createPlayerService(validationResult.data)

	return {
		success: true,
		player,
	}
}
