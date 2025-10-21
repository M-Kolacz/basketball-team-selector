'use server'

import { parseWithZod } from '@conform-to/zod'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { requireAdminUser } from '#app/lib/auth.server'
import { prisma } from '#app/lib/db.server'
import { UpdateGameScoreSchema } from '#app/lib/validations/game-session'

const GetGameSessionSchema = z.object({
	gameSessionId: z.string().uuid('Invalid game session ID'),
})

export async function getGameSessionAction(gameSessionId: string) {
	await requireAdminUser()

	const { gameSessionId: validatedId } = GetGameSessionSchema.parse({
		gameSessionId,
	})

	const gameSession = await prisma.gameSession.findUnique({
		where: { id: validatedId },
		include: {
			selectedProposition: {
				include: {
					teams: {
						include: {
							players: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
				},
			},
			propositions: {
				include: {
					teams: {
						include: {
							players: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
				},
			},
		},
	})

	if (!gameSession) {
		redirect('/games')
	}

	return gameSession
}

export async function updateGameScoreAction(formData: FormData) {
	await requireAdminUser()

	const submission = parseWithZod(formData, {
		schema: UpdateGameScoreSchema,
	})

	if (submission.status !== 'success') {
		return submission.reply()
	}

	const { gameSessionId, gameIndex, scores } = submission.value

	const gameSession = await prisma.gameSession.findUnique({
		where: { id: gameSessionId },
		select: { games: true },
	})

	if (!gameSession) {
		return submission.reply({
			formErrors: ['Game session not found'],
		})
	}

	const games = Array.isArray(gameSession.games)
		? (gameSession.games as Array<Array<{ score: number; teamId: string }>>)
		: []

	if (gameIndex >= games.length) {
		return submission.reply({
			formErrors: ['Invalid game index'],
		})
	}

	games[gameIndex] = scores

	await prisma.gameSession.update({
		where: { id: gameSessionId },
		data: { games },
	})

	return submission.reply()
}
