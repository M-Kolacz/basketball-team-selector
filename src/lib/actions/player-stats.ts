'use server'

import { invariant } from '@epic-web/invariant'
import { getOptionalUser } from '#app/lib/auth.server'
import { prisma } from '#app/lib/db.server'
import { requireRateLimit } from '#app/lib/rate-limit.server'
import { formatPlayerName } from '#app/lib/utils/anonymize-player'

export const getPlayerStats = async () => {
	const rateLimit = await requireRateLimit('general')
	invariant(
		rateLimit.status === 'success',
		`Too many requests. Try again in ${rateLimit.retryAfterSeconds} second${rateLimit.retryAfterSeconds !== 1 ? 's' : ''}.`,
	)

	const currentUser = await getOptionalUser()
	const isAdmin = currentUser?.role === 'admin'

	const players = await prisma.player.findMany({
		select: {
			id: true,
			name: true,
			teams: {
				select: {
					id: true,
					scores: {
						select: {
							points: true,
							game: {
								select: {
									gameSessionId: true,
									id: true,
									scores: {
										select: {
											points: true,
											teamId: true,
										},
									},
								},
							},
						},
					},
				},
			},
		},
	})

	const playerStats = players.map((player) => {
		let gamesPlayed = 0
		let gamesWon = 0
		let gamesLost = 0

		// Track unique games to avoid counting the same game multiple times
		const processedGames = new Set<string>()
		const uniqueGameSessions = new Set<string>()

		player.teams.forEach((team) => {
			team.scores.forEach((score) => {
				const gameId = score.game.id
				const gameSessionId = score.game.gameSessionId

				// Skip if we already processed this game
				if (processedGames.has(gameId)) return

				processedGames.add(gameId)
				uniqueGameSessions.add(gameSessionId)
				gamesPlayed++

				// Find all scores for this game
				const allScores = score.game.scores
				const myTeamScore = allScores.find((s) => s.teamId === team.id)
				const opponentScore = allScores.find((s) => s.teamId !== team.id)

				// Determine if player's team won or lost
				if (myTeamScore && opponentScore) {
					if (myTeamScore.points > opponentScore.points) {
						gamesWon++
					} else if (myTeamScore.points < opponentScore.points) {
						gamesLost++
					}
				}
			})
		})

		const winRatio = gamesPlayed > 0 ? (gamesWon / gamesPlayed) * 100 : 0

		return {
			id: player.id,
			name: formatPlayerName(player.name, isAdmin),
			gameSessions: uniqueGameSessions.size,
			totalGames: gamesPlayed,
			gamesWon,
			gamesLost,
			winRatio,
		}
	})

	// Sort by win ratio descending, then by total games
	playerStats.sort((a, b) => {
		if (b.winRatio !== a.winRatio) {
			return b.winRatio - a.winRatio
		}
		return b.totalGames - a.totalGames
	})

	return playerStats
}

export type PlayersStatisticts = Awaited<ReturnType<typeof getPlayerStats>>
