'use server'

import { redirect } from 'next/navigation'
import { getCurrentUser } from '#app/lib/auth.server'
import { prisma } from '#app/lib/db.server'

export async function getAllGameSessionsAction() {
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

export type GameSessionAction = Awaited<
	ReturnType<typeof getAllGameSessionsAction>
>[number]
