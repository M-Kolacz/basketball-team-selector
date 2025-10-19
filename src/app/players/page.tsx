import { type Metadata } from 'next'
import { getPlayers } from '#app/actions/players'
import { PlayersList } from '#app/app/players/components/PlayersList'
import { getCurrentUser } from '#app/services/auth.server'

export const metadata: Metadata = {
	title: 'Players - Basketball Team Selector',
	description: 'Manage player roster',
}

export default async function PlayersPage() {
	const [players, currentUser] = await Promise.all([
		getPlayers(),
		getCurrentUser(),
	])

	const isAdmin = currentUser?.role === 'admin'

	return <PlayersList players={players} isAdmin={isAdmin} />
}
