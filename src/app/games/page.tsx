import { type Metadata } from 'next'
import { GameHistoryList } from '#app/app/games/components/GameHistoryList'
import { transformToViewModel } from '#app/app/games/utils/transform'
import { getAllGameSessionsAction } from '#app/lib/actions/game-sessions'

export const metadata: Metadata = {
	title: 'Games - Basketball Team Selector',
	description: 'View and manage your basketball games',
}

export default async function GamesPage() {
	const gameSessions = await getAllGameSessionsAction()

	return (
		<main className="container mx-auto px-4 py-8">
			<GameHistoryList games={gameSessions} />
		</main>
	)
}
