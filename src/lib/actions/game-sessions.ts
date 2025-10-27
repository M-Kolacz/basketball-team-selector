'use server'

import { parseWithZod } from '@conform-to/zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { getCurrentUser, requireAdminUser } from '#app/lib/auth.server'
import { generatePropositions } from '#app/lib/createTeamPropositions'
import { prisma } from '#app/lib/db.server'
import {
	UpdateGameScoreSchema,
	GetGameSessionSchema,
	CreateGameSessionSchema,
	SelectPropositionSchema,
	GameResultSchema,
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
		const teams = []
		for (const team of proposition.teams) {
			const newTeam = await prisma.team.create({
				data: {
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

export async function selectPropositionAction(
	_prevState: unknown,
	formData: FormData,
) {
	const submission = await parseWithZod(formData, {
		schema: SelectPropositionSchema.transform(async (data, ctx) => {
			const user = await getCurrentUser()
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

export async function updatePropositionTeams(
	propositionId: string,
	teamUpdates: Array<{ teamId: string; playerIds: string[] }>,
) {
	await requireAdminUser()

	try {
		for (const update of teamUpdates) {
			await prisma.team.update({
				where: { id: update.teamId },
				data: {
					players: {
						set: update.playerIds.map((id) => ({ id })),
					},
				},
			})
		}

		revalidatePath(`/games`)
	} catch (error) {
		console.error('Error updating proposition teams:', error)
		throw new Error('Failed to update proposition teams')
	}
}

export async function recordGameResultAction(
	_prevState: unknown,
	formData: FormData,
) {
	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			GameResultSchema.transform(async (data, ctx) => {
				// Skip validation for intent submissions (Conform pattern)
				if (intent !== null) return data

				// Admin authorization check
				const user = await getCurrentUser()
				if (!user || user.role !== 'admin') {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Unauthorized access',
					})
					return z.NEVER
				}

				// Validate game session exists with selected proposition
				const gameSession = await prisma.gameSession.findUnique({
					where: { id: data.gameSessionId },
					include: {
						selectedProposition: {
							include: { teams: true },
						},
					},
				})

				if (!gameSession) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Game session not found',
						path: ['gameSessionId'],
					})
					return z.NEVER
				}

				if (!gameSession.selectedProposition) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'No proposition selected for this game session',
						path: ['gameSessionId'],
					})
					return z.NEVER
				}

				// Validate all teams belong to selected proposition
				const propositionTeamIds = gameSession.selectedProposition.teams.map(
					(t) => t.id,
				)
				const invalidTeams = data.scores.filter(
					(s) => !propositionTeamIds.includes(s.teamId),
				)

				if (invalidTeams.length > 0) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Some teams do not belong to the selected proposition',
						path: ['scores'],
					})
					return z.NEVER
				}

				// If updating, validate game exists and belongs to session
				if (data.gameId) {
					const existingGame = await prisma.game.findUnique({
						where: { id: data.gameId },
						select: { gameSessionId: true },
					})

					if (!existingGame) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: 'Game not found',
							path: ['gameId'],
						})
						return z.NEVER
					}

					if (existingGame.gameSessionId !== data.gameSessionId) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: 'Game does not belong to this game session',
							path: ['gameId'],
						})
						return z.NEVER
					}
				}

				return data
			}),
		async: true,
	})

	if (submission.status !== 'success') {
		return { result: submission.reply() }
	}

	const { gameSessionId, gameId, scores } = submission.value

	try {
		if (!gameId) {
			// Create Mode - Create new game with scores
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
		} else {
			// Update Mode - Delete old scores and create new ones
			await prisma.$transaction([
				prisma.score.deleteMany({
					where: { gameId },
				}),
				prisma.score.createMany({
					data: scores.map((score) => ({
						gameId,
						teamId: score.teamId,
						points: score.points,
					})),
				}),
			])
		}
	} catch (error) {
		console.error('Error recording game result:', error)
		throw new Error('Failed to record game result')
	}

	revalidatePath(`/games/${gameSessionId}`)
	redirect(`/games/${gameSessionId}`)
}
