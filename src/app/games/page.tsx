import { type Metadata } from 'next'
import { GameHistoryList } from '#app/app/games/components/GameHistoryList'
import { getGameSessionsAction } from '#app/lib/actions/game-sessions'

export const metadata: Metadata = {
	title: 'Games - Basketball Team Selector',
	description: 'View and manage your basketball games',
}

export default async function GamesPage() {
	const gameSessions = await getGameSessionsAction()

	return (
		<main className="container mx-auto px-4 py-8">
			<GameHistoryList gameSessions={gameSessions} />
		</main>
	)
}
