'use server'

import { redirect } from 'next/navigation'
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

export async function getAllGameSessionsAction(): Promise<
	GameSessionWithRelations[]
> {
	const currentUser = await getCurrentUser()

	if (!currentUser) redirect('/login')

	try {
		const gameSessions = await prisma.gameSession.findMany({
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

		return gameSessions
	} catch (error) {
		console.error('Error fetching game sessions:', error)
		throw new Error('Failed to fetch game sessions')
	}
}
