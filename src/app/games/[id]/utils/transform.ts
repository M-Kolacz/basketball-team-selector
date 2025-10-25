import {
	type PlayerViewModel,
	type TeamViewModel,
} from '#app/app/games/[id]/types'

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
