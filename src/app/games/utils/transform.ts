import { type GameSessionWithRelations } from '#app/lib/actions/game-sessions'

export type GameWithTeams = { score: number; teamId: string }[][]

export type GameHistoryViewModel = {
	id: string
	gameDatetime: Date
	description: string | null
	games: GameWithTeams
	hasSelectedProposition: boolean
}

export function transformToViewModel(
	session: GameSessionWithRelations,
): GameHistoryViewModel {
	const hasProposition = session.selectedProposition !== null

	return {
		id: session.id,
		gameDatetime: session.gameDatetime,
		description: session.description,
		games: session.games as GameWithTeams,
		hasSelectedProposition: hasProposition,
	}
}
