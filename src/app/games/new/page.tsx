import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { CreateGameForm } from '#app/app/games/new/create-game-form'
import { getPlayers } from '#app/lib/actions/players'
import { getCurrentUser } from '#app/lib/auth.server'

export const metadata: Metadata = {
	title: 'Create Game - Basketball Team Selector',
	description: 'Create a new game session',
}

export default async function CreateGamePage() {
	const currentUser = await getCurrentUser()

	if (!currentUser || currentUser.role !== 'admin') {
		redirect('/games')
	}

	const players = await getPlayers()

	return (
		<main className="container mx-auto px-4 py-8">
			<CreateGameForm players={players} />
		</main>
	)
}
