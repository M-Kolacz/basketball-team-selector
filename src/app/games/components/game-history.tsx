'use client'

import { AddGameForm } from '#app/app/games/components/add-game-form'
import { GameSessionsTable } from '#app/app/games/components/game-sessions-table'
import { useGamesContext } from '#app/app/games/lib/games-context'
import {
	Empty,
	EmptyHeader,
	EmptyTitle,
	EmptyDescription,
} from '#app/components/ui/empty'
import { useOptionalUser } from '#app/lib/contexts/user-context'

export const GameHistory = () => {
	const user = useOptionalUser()
	const isAdmin = user?.role === 'admin'
	const { gameSessions } = useGamesContext()

	if (gameSessions.length === 0) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyTitle>No games found</EmptyTitle>
					<EmptyDescription>
						There are no game sessions recorded yet.
					</EmptyDescription>
				</EmptyHeader>
				{isAdmin && <AddGameForm key={isAdmin.toString()} />}
			</Empty>
		)
	}

	return (
		<div className="w-full">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Game History</h1>
					<p className="text-muted-foreground">
						View all past basketball game sessions
					</p>
				</div>
				{isAdmin && <AddGameForm />}
			</div>
			<GameSessionsTable />
		</div>
	)
}
