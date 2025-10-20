import { type Metadata } from 'next'
import { getAllGameSessionsAction } from '#app/lib/actions/game-sessions'

export const metadata: Metadata = {
	title: 'Games - Basketball Team Selector',
	description: 'View and manage your basketball games',
}

export default async function GamesPage() {
	const gameSessions = await getAllGameSessionsAction()

	console.log(gameSessions)

	return (
		<main className="flex min-h-screen flex-col items-center justify-start p-4">
			<h1>Games</h1>
		</main>
	)
}
