import { type Metadata } from 'next'
import { GameHistory } from '#app/app/games/components/game-history'
import { GamesProvider } from '#app/app/games/lib/games-context'
import { getGameSessions } from '#app/lib/actions/game-sessions'
import { getPlayers } from '#app/lib/actions/players'

export const metadata: Metadata = {
	title: 'Games - Basketball Team Selector',
	description: 'View and manage your basketball games',
}

export default async function GamesPage() {
	const [gameSessions, players] = await Promise.all([
		getGameSessions(),
		getPlayers(),
	])

	return (
		<main className="container mx-auto px-4 py-8">
			<GamesProvider gameSessions={gameSessions} players={players}>
				<GameHistory />
			</GamesProvider>
		</main>
	)
}
