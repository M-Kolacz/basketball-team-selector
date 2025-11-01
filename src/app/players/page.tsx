import { type Metadata } from 'next'
import { PlayersList } from '#app/app/players/components/PlayersList'
import { getPlayers } from '#app/lib/actions/players'
import { getOptionalUser } from '#app/lib/auth.server'

export const metadata: Metadata = {
	title: 'Players - Basketball Team Selector',
	description: 'Manage player roster',
}

export default async function PlayersPage() {
	const [players, currentUser] = await Promise.all([
		getPlayers(),
		getOptionalUser(),
	])

	const isAdmin = currentUser?.role === 'admin'

	return <PlayersList players={players} isAdmin={isAdmin} />
}
