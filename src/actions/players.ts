'use server'

import { redirect } from 'next/navigation'
import { getCurrentUser } from '#app/services/auth.server'
import { listAllPlayers } from '#app/services/player.service'

export async function getPlayers() {
	const currentUser = await getCurrentUser()

	if (!currentUser) redirect('/login')

	const players = await listAllPlayers(currentUser.role)

	return players
}
