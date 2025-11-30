import { describe, expect, it } from 'vitest'
import { getTeamsConfiguration } from '#app/lib/create-team-helpers'
import { type Player } from '#app/lib/db.server'

type Players = Omit<Player, 'createdAt' | 'updatedAt'>[]

const createPlayers = (count: number): Players =>
	Array.from({ length: count }, (_, i) => ({
		id: `player-${i}`,
		name: `Player ${i}`,
		skillTier: 'B',
		positions: ['PG'],
		userId: 'user-1',
	}))

describe('getTeamsConfiguration', () => {
	it('throws error with fewer than 10 players', () => {
		const players = createPlayers(9)
		expect(() => getTeamsConfiguration(players)).toThrow(
			'Cannot form teams 1: need at least 10 players, but only 9 players provided.',
		)
	})

	it('creates 2 teams with 10 players', () => {
		const players = createPlayers(10)
		const result = getTeamsConfiguration(players)
		expect(result).toEqual({
			numberOfTeams: 2,
			minPlayersPerTeam: 5,
			maxPlayersPerTeam: 5,
		})
	})

	it('creates 2 teams with 11 players (5-6 split)', () => {
		const players = createPlayers(11)
		const result = getTeamsConfiguration(players)
		expect(result).toEqual({
			numberOfTeams: 2,
			minPlayersPerTeam: 5,
			maxPlayersPerTeam: 6,
		})
	})

	it('creates 3 teams with 15 players', () => {
		const players = createPlayers(15)
		const result = getTeamsConfiguration(players)
		expect(result).toEqual({
			numberOfTeams: 3,
			minPlayersPerTeam: 5,
			maxPlayersPerTeam: 5,
		})
	})

	it('creates 4 teams with 20 players', () => {
		const players = createPlayers(20)
		const result = getTeamsConfiguration(players)
		expect(result).toEqual({
			numberOfTeams: 4,
			minPlayersPerTeam: 5,
			maxPlayersPerTeam: 5,
		})
	})
})
