import {
	type GameDetailsViewModel,
	type GameScoreViewModel,
	type PlayerViewModel,
	type PropositionViewModel,
	type TeamViewModel,
} from '#app/app/games/[id]/types'
import { type Prisma } from '#app/../generated/prisma'

type GameSessionWithDetails = Prisma.GameSessionGetPayload<{
	include: {
		selectedProposition: {
			include: {
				teams: {
					include: {
						players: true
					}
				}
			}
		}
		propositions: {
			include: {
				teams: {
					include: {
						players: true
					}
				}
			}
		}
	}
}>

export function transformToGameDetailsViewModel(
	session: GameSessionWithDetails,
): GameDetailsViewModel {
	const games = Array.isArray(session.games)
		? (session.games as GameScoreViewModel[])
		: []

	const selectedProposition = session.selectedProposition
		? {
				id: session.selectedProposition.id,
				type: session.selectedProposition.type,
				teams: session.selectedProposition.teams.map(transformTeam),
			}
		: null

	const allPropositions: PropositionViewModel[] = session.propositions.map(
		(prop) => ({
			id: prop.id,
			type: prop.type as PropositionViewModel['type'],
			teams: prop.teams.map(transformTeam),
		}),
	)

	return {
		id: session.id,
		gameDatetime: session.gameDatetime,
		description: session.description,
		games,
		selectedProposition,
		allPropositions,
	}
}

function transformTeam(team: {
	id: string
	players: Array<{
		id: string
		name: string
		skillTier: string
		positions: string[]
	}>
}): TeamViewModel {
	return {
		id: team.id,
		players: team.players.map(transformPlayer),
	}
}

function transformPlayer(player: {
	id: string
	name: string
	skillTier: string
	positions: string[]
}): PlayerViewModel {
	return {
		id: player.id,
		name: player.name,
		skillTier: player.skillTier as PlayerViewModel['skillTier'],
		positions: player.positions as PlayerViewModel['positions'],
	}
}
