'use server'

import { redirect } from 'next/navigation'
import { transformToViewModel } from '#app/app/games/utils/transform'
import { getCurrentUser } from '#app/lib/auth.server'
import { prisma } from '#app/lib/db.server'

export type GameSessionWithRelations = Awaited<
	ReturnType<
		typeof prisma.gameSession.findMany<{
			orderBy: { gameDatetime: 'desc' }
			include: {
				selectedProposition: {
					include: {
						teams: {
							include: {
								players: true
							}
						}
					}
				}
			}
		}>
	>
>[number]

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
			},
		})

		const gameSessions = rawGameSessions.map(transformToViewModel)

		return gameSessions
	} catch (error) {
		console.error('Error fetching game sessions:', error)
		throw new Error('Failed to fetch game sessions')
	}
}
