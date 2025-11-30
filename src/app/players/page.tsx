import { type Metadata } from 'next'
import { PlayersList } from '#app/app/players/components/player-list'
import { getPlayers } from '#app/lib/actions/players'

export const metadata: Metadata = {
	title: 'Players - Basketball Team Selector',
	description: 'Manage player roster',
}

export default async function PlayersPage() {
	const players = await getPlayers()

	return <PlayersList players={players} />
}
