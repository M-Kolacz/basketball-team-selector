import { type Metadata } from 'next'
import { GameHistory } from '#app/app/games/components/game-history'
import { GamesProvider } from '#app/app/games/games-context'
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
			<GamesProvider isAdmin={isAdmin} players={players}>
				<GameHistory gameSessions={gameSessions} />
			</GamesProvider>
		</main>
	)
}
