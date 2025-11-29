'use client'

import { parseWithZod } from '@conform-to/zod'
import { invariant } from '@epic-web/invariant'
import { createContext, use, useOptimistic } from 'react'
import { type GameSessions } from '#app/lib/actions/game-sessions'
import { type Players } from '#app/lib/actions/players'
import { CreateGameSessionSchema } from '#app/lib/validations/game-session'

type GamesContextValue = {
	players: Players
	gameSessions: GameSessions
	addOptimisticGameSession: (formData: FormData) => void
}

const GamesContext = createContext<null | GamesContextValue>(null)

export const GamesProvider = ({
	children,
	players,
	gameSessions,
}: {
	children: React.ReactNode
} & Omit<GamesContextValue, 'addOptimisticGameSession'>) => {
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

		const { gameDatetime } = submission.value
		addOptimisticGame({
			id: `temp-${Date.now()}`,
			gameDatetime: new Date(gameDatetime),
			gamesCount: 0,
			players: [],
			description: null,
			propositions: [],
		})
	}

	return (
		<GamesContext.Provider
			value={{
				players,
				gameSessions: optimisticGames,
				addOptimisticGameSession,
			}}
		>
			{children}
		</GamesContext.Provider>
	)
}

export const useGamesContext = () => {
	const context = use(GamesContext)
	invariant(context, 'useGamesContext must be used within a GamesProvider')

	return context
}
