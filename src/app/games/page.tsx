import { type Metadata } from 'next'
import { GameHistoryList } from '#app/app/games/components/GameHistoryList'
import { getGameSessions } from '#app/lib/actions/game-sessions'
import { getPlayers } from '#app/lib/actions/players'
import { getOptionalUser } from '#app/lib/auth.server'

export const metadata: Metadata = {
	title: 'Games - Basketball Team Selector',
	description: 'View and manage your basketball games',
}

export default async function GamesPage() {
	const [gameSessions, currentUser, players] = await Promise.all([
		getGameSessions(),
		getOptionalUser(),
		getPlayers(),
	])

	const isAdmin = currentUser?.role === 'admin'

	return (
		<main className="container mx-auto px-4 py-8">
			<GameHistoryList
				players={players}
				gameSessions={gameSessions}
				isAdmin={isAdmin}
			/>
		</main>
	)
}
