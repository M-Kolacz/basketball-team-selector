import { type Player } from '#app/lib/db.server'

type Players = Omit<Player, 'createdAt' | 'updatedAt'>[]

export const getTeamsConfiguration = (players: Players) => {
	const totalPlayers = players.length
	const minPlayersPerTeam = 5
	const maxPossibleTeams = Math.min(
		4,
		Math.floor(totalPlayers / minPlayersPerTeam),
	)

	if (maxPossibleTeams < 2) {
		throw new Error(
			`Cannot form teams ${maxPossibleTeams}: need at least 10 players, but only ${players.length} players provided.`,
		)
	}

	const avgPlayersPerTeam = totalPlayers / maxPossibleTeams
	const minPlayers = Math.floor(avgPlayersPerTeam)
	const maxPlayers = Math.ceil(avgPlayersPerTeam)

	return {
		numberOfTeams: maxPossibleTeams,
		minPlayersPerTeam: minPlayers,
		maxPlayersPerTeam: maxPlayers,
	}
}
