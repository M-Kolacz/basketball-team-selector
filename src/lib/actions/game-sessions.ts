'use server'

import { parseWithZod } from '@conform-to/zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { getCurrentUser, requireAdminUser } from '#app/lib/auth.server'
import { prisma } from '#app/lib/db.server'
import {
	UpdateGameScoreSchema,
	GetGameSessionSchema,
	CreateGameSessionSchema,
} from '#app/lib/validations/game-session'

export async function getGameSessions() {
	const currentUser = await getCurrentUser()

	if (!currentUser) redirect('/login')

	try {
		const rawGameSessions = await prisma.gameSession.findMany({
			orderBy: { gameDatetime: 'desc' },
			include: {
				selectedProposition: {
					include: {
						teams: {
							include: {
								players: true,
							},
						},
					},
				},
				games: {
					include: {
						scores: {
							select: {
								id: true,
								points: true,
								teamId: true,
							},
						},
					},
				},
			},
		})

		const gameSessions = rawGameSessions.map((rawGameSession) => {
			const hasProposition = rawGameSession.selectedProposition !== null

			return {
				id: rawGameSession.id,
				gameDatetime: rawGameSession.gameDatetime,
				description: rawGameSession.description,
				games: rawGameSession.games,
				hasSelectedProposition: hasProposition,
			}
		})

		return gameSessions
	} catch (error) {
		console.error('Error fetching game sessions:', error)
		throw new Error('Failed to fetch game sessions')
	}
}

export type GameSessions = Awaited<ReturnType<typeof getGameSessions>>

export async function getGameSession(gameSessionId: string) {
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
			games: {
				include: {
					scores: {
						select: {
							id: true,
							points: true,
							teamId: true,
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

export type GameSession = Awaited<ReturnType<typeof getGameSession>>

export async function createGameSessionAction(
	_prevState: unknown,
	formData: FormData,
) {
	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			CreateGameSessionSchema.transform(async (data, ctx) => {
				if (intent !== null) return { ...data }

				const user = await getCurrentUser()
				if (!user || user.role !== 'admin') {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Unauthorized access',
					})
					return z.NEVER
				}

				// Future date validation
				const gameDate = new Date(data.gameDatetime)
				if (gameDate <= new Date()) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Game date must be in the future',
						path: ['gameDatetime'],
					})
					return z.NEVER
				}

				// Player count validation
				if (data.playerIds.length < 10) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Minimum 10 players required',
						path: ['playerIds'],
					})
					return z.NEVER
				}
				if (data.playerIds.length > 20) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Maximum 20 players allowed',
						path: ['playerIds'],
					})
					return z.NEVER
				}

				const players = await prisma.player.findMany({
					where: { id: { in: data.playerIds } },
				})
				if (players.length !== data.playerIds.length) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Some players do not exist',
						path: ['playerIds'],
					})
					return z.NEVER
				}

				return { ...data, players }
			}),
		async: true,
	})

	if (submission.status !== 'success') {
		return { result: submission.reply() }
	}

	const { gameDatetime, description } = submission.value

	await prisma.gameSession.create({
		data: {
			gameDatetime: new Date(gameDatetime),
			description: description ?? null,
		},
		select: {
			id: true,
		},
	})

	revalidatePath('/games')
	redirect('/games')
}

export async function updateGameScore(_prevState: unknown, formData: FormData) {
	await requireAdminUser()

	const submission = parseWithZod(formData, {
		schema: UpdateGameScoreSchema,
	})

	if (submission.status !== 'success') {
		return submission.reply()
	}

	const { firstScoreId, firstScorePoints, secondScoreId, secondScorePoints } =
		submission.value

	await prisma.score.update({
		where: {
			id: firstScoreId,
		},
		data: {
			points: firstScorePoints,
		},
	})

	await prisma.score.update({
		where: {
			id: secondScoreId,
		},
		data: {
			points: secondScorePoints,
		},
	})

	return submission.reply()
}
