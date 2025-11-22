'use client'

import { parseWithZod } from '@conform-to/zod'
import { useOptimistic } from 'react'
import { AddGameForm } from '#app/app/games/components/add-game-form'
import { createGameSessionColumns } from '#app/app/games/components/game-sessions-columns'
import { GameSessionsTable } from '#app/app/games/components/game-sessions-table'
import {
	Empty,
	EmptyHeader,
	EmptyTitle,
	EmptyDescription,
} from '#app/components/ui/empty'

import { type GameSessions } from '#app/lib/actions/game-sessions'
import { type Players } from '#app/lib/actions/players'
import { CreateGameSessionSchema } from '#app/lib/validations/game-session'

interface GameHistoryListProps {
	gameSessions: GameSessions
	isAdmin: boolean
	players: Players
}

export const GameHistory = ({
	gameSessions,

	isAdmin,
	players,
}: GameHistoryListProps) => {
	const [optimisticGames, addOptimisticGame] = useOptimistic<
		GameSessions,
		GameSessions[number]
	>(gameSessions, (state, newGame) => {
		return [newGame, ...state].sort(
			(a, b) => b.gameDatetime.getTime() - a.gameDatetime.getTime(),
		)
	})

	const addOptimisticGameSession = (formData: FormData) => {
		const submission = parseWithZod(formData, {
			schema: CreateGameSessionSchema,
		})
		if (submission.status !== 'success') return

		const { gameDatetime, playerIds, description } = submission.value
		addOptimisticGame({
			id: `temp-${Date.now()}`,
			gameDatetime: new Date(gameDatetime),
			gamesCount: 0,
			players: playerIds.map(
				(playerId) =>
					players.find((player) => player.id === playerId) ?? {
						id: '',
						name: '',
					},
			),
			description: description ?? null,
			propositions: [],
		})
	}

	if (optimisticGames.length === 0) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyTitle>No games found</EmptyTitle>
					<EmptyDescription>
						There are no game sessions recorded yet.
					</EmptyDescription>
				</EmptyHeader>
				{isAdmin && (
					<AddGameForm
						key={isAdmin.toString()}
						players={players}
						addOptimisticGameSession={addOptimisticGameSession}
					/>
				)}
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
				{isAdmin && (
					<AddGameForm
						players={players}
						addOptimisticGameSession={addOptimisticGameSession}
					/>
				)}
			</div>
			<GameSessionsTable
				columns={createGameSessionColumns({
					isAdmin,
					players,
				})}
				data={optimisticGames}
			/>
		</div>
	)
}
