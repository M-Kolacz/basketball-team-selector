'use server'

import { parseWithZod } from '@conform-to/zod'
import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { z } from 'zod'
import { getOptionalUser, requireAdminUser } from '#app/lib/auth.server'
import { generatePropositions } from '#app/lib/createTeamPropositions'
import { prisma } from '#app/lib/db.server'
import {
	GetGameSessionSchema,
	CreateGameSessionSchema,
	SelectPropositionSchema,
	GameResultSchema,
	SavePropositionSchema,
	EditGameScoreSchema,
} from '#app/lib/validations/game-session'

export const getGameSessions = async () => {
	const gameSessions = await prisma.gameSession.findMany({
		orderBy: { gameDatetime: 'desc' },
		select: {
			id: true,
			gameDatetime: true,
			games: {
				select: {
					id: true,
				},
			},
		},
	})

	return gameSessions
}

export type GameSessions = Awaited<ReturnType<typeof getGameSessions>>

export const getGameSession = async (id: string) => {
	const { gameSessionId } = await GetGameSessionSchema.parseAsync({
		gameSessionId: id,
	})

	const gameSession = await prisma.gameSession.findUnique({
		where: { id: gameSessionId },

		select: {
			id: true,
			gameDatetime: true,
			description: true,

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
						select: {
							name: true,
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
							team: {
								select: {
									name: true,
								},
							},
						},
					},
				},
			},
		},
	})

	if (!gameSession) notFound()

	return gameSession
}

export type GameSession = Awaited<ReturnType<typeof getGameSession>>

export const createGameSessionAction = async (
	_prevState: unknown,
	formData: FormData,
) => {
	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			CreateGameSessionSchema.transform(async (data, ctx) => {
				if (intent !== null) return { ...data }

				const user = await getOptionalUser()
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

	const { gameDatetime, description, playerIds } = submission.value

	const players = await prisma.player.findMany({
		where: { id: { in: playerIds } },
	})

	const propositions = await generatePropositions(players)

	const gameSession = await prisma.gameSession.create({
		data: {
			gameDatetime: new Date(gameDatetime),
			description: description ?? null,
		},
		select: {
			id: true,
		},
	})

	for (const proposition of propositions.object.propositions) {
		const teams: string[] = []
		for (const team of proposition.teams) {
			const newTeam = await prisma.team.create({
				data: {
					name: `Team ${teams.length + 1}`,
					players: {
						connect: team.map((playerName) => {
							const player = players.find((p) => p.name === playerName)!
							return { id: player.id }
						}),
					},
				},
			})
			teams.push(newTeam.id)
		}

		await prisma.proposition.create({
			data: {
				type: 'general',
				teams: {
					connect: teams.map((teamId) => ({ id: teamId })),
				},
				gameSession: {
					connect: { id: gameSession.id },
				},
			},
		})
	}

	revalidatePath('/games')
	redirect('/games')
}

export const updateGameScore = async (
	_prevState: unknown,
	formData: FormData,
) => {
	await requireAdminUser()

	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			EditGameScoreSchema.transform(async (data, ctx) => {
				return data
			}),
		async: true,
	})

	if (submission.status !== 'success') {
		return { result: submission.reply() }
	}

	const { scores } = submission.value

	console.log({ scores })

	await prisma.$transaction(
		scores.map((score) =>
			prisma.score.update({
				where: { id: score.id },
				data: { points: score.points },
			}),
		),
	)

	return {}
}

export const selectPropositionAction = async (
	_prevState: unknown,
	formData: FormData,
) => {
	const submission = await parseWithZod(formData, {
		schema: SelectPropositionSchema.transform(async (data, ctx) => {
			const user = await getOptionalUser()
			if (!user || user.role !== 'admin') {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Unauthorized access',
				})
				return z.NEVER
			}

			const proposition = await prisma.proposition.findUnique({
				where: { id: data.propositionId },
				select: { gameSessionId: true },
			})

			if (!proposition) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Proposition not found',
					path: ['propositionId'],
				})
				return z.NEVER
			}

			if (proposition.gameSessionId !== data.gameSessionId) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Proposition does not belong to this game session',
					path: ['propositionId'],
				})
				return z.NEVER
			}

			const gameSession = await prisma.gameSession.findUnique({
				where: { id: data.gameSessionId },
				select: { selectedPropositionId: true },
			})

			if (!gameSession) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Game session not found',
					path: ['gameSessionId'],
				})
				return z.NEVER
			}

			if (gameSession.selectedPropositionId !== null) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						'A proposition has already been selected for this game session',
					path: ['propositionId'],
				})
				return z.NEVER
			}

			return data
		}),
		async: true,
	})

	if (submission.status !== 'success') {
		return { result: submission.reply() }
	}

	const { gameSessionId, propositionId } = submission.value

	try {
		await prisma.gameSession.update({
			where: { id: gameSessionId },
			data: { selectedPropositionId: propositionId },
		})
	} catch (error) {
		console.error('Error selecting proposition:', error)
		throw new Error('Failed to select proposition')
	}

	revalidatePath(`/games/${gameSessionId}`)
	redirect(`/games/${gameSessionId}`)
}

export const updatePropositionTeams = async (
	prevState: unknown,
	formData: FormData,
) => {
	await requireAdminUser()

	const submission = await parseWithZod(formData, {
		schema: SavePropositionSchema,
		async: true,
	})

	if (submission.status !== 'success') {
		return { result: submission.reply() }
	}

	const { updatedTeams } = submission.value

	await prisma.$transaction(
		updatedTeams.map((updatedTeam) =>
			prisma.team.update({
				where: { id: updatedTeam.id },
				data: {
					players: {
						set: updatedTeam.players.map((player) => ({ id: player.id })),
					},
				},
			}),
		),
	)

	revalidatePath(`/games`)
}

export const recordGameResultAction = async (
	_prevState: unknown,
	formData: FormData,
) => {
	await requireAdminUser()

	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			GameResultSchema.transform(async (data, ctx) => {
				if (intent !== null) return data

				const gameSession = await prisma.gameSession.findUnique({
					where: { id: data.gameSessionId },
					include: {
						selectedProposition: {
							include: { teams: true },
						},
					},
				})

				if (!gameSession || !gameSession.selectedProposition) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Game session not found',
						path: ['gameSessionId'],
					})
					return z.NEVER
				}

				return data
			}),
		async: true,
	})

	if (submission.status !== 'success') {
		return { result: submission.reply() }
	}

	const { gameSessionId, scores } = submission.value

	await prisma.game.create({
		data: {
			gameSessionId,
			scores: {
				create: scores.map((score) => ({
					teamId: score.teamId,
					points: score.points,
				})),
			},
		},
	})

	revalidatePath(`/games/${gameSessionId}`)
	redirect(`/games/${gameSessionId}`)
}
