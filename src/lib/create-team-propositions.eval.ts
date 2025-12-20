import { faker } from '@faker-js/faker'
import { evalite } from 'evalite'
import { generatePropositions } from '#app/lib/create-team-propositions'
import {
	type Player,
	type PropositionType,
	type SkillTier,
} from '#app/lib/db.server'

const players: Player[] = Array.from({ length: 10 }, () => ({
	id: faker.string.uuid(),
	name: faker.person.fullName(),
	skillTier: faker.helpers.arrayElement(['S', 'A', 'B', 'C', 'D']),
	positions: faker.helpers.arrayElements(['PG', 'SG', 'SF', 'PF', 'C'], {
		min: 1,
		max: 3,
	}),
	createdAt: faker.date.past({ years: 1 }),
	updatedAt: faker.date.recent({ days: 10 }),
}))
evalite('Generate propositions', {
	data: [{ input: players }],

	task: async (input) => {
		return await generatePropositions(input)
	},

	scorers: [
		{
			name: 'Correct number of players in team',
			description:
				'Checks if the output contains the correct number of players in the teams.',
			scorer: ({ output, input }) => {
				const numberOfTeams = Math.floor(input.length / 5)
				let isCorrectNumberOfTeams = false
				output.object.propositions.forEach((proposition) => {
					if (proposition.teams.length === numberOfTeams) {
						isCorrectNumberOfTeams = true
					}
				})
				return isCorrectNumberOfTeams ? 1 : 0
			},
		},
		{
			name: 'Player Uniqueness',
			description:
				'Ensures no player appears in multiple teams within the same proposition.',
			scorer: ({ output }) => {
				const { propositions } = output.object

				for (const proposition of propositions) {
					const { teams } = proposition
					const allPlayers: string[] = []
					const duplicates: string[] = []

					for (const team of teams) {
						for (const playerName of team) {
							if (allPlayers.includes(playerName)) duplicates.push(playerName)
							allPlayers.push(playerName)
						}
					}

					if (duplicates.length > 0) {
						console.error(
							`❌ Proposition (${proposition.type}) has duplicate players: ${duplicates.join(', ')}`,
						)
						return 0
					}
				}

				return 1
			},
		},
		{
			name: 'Complete Distribution',
			description:
				'Verifies all input players are assigned exactly once in each proposition.',
			scorer: ({ output, input }) => {
				const inputPlayerNames = new Set(input.map((p) => p.name))
				const { propositions } = output.object

				for (const proposition of propositions) {
					const assignedPlayers = new Set<string>()
					const missingPlayers: string[] = []
					const extraPlayers: string[] = []

					for (const team of proposition.teams) {
						for (const playerName of team) {
							assignedPlayers.add(playerName)
						}
					}

					for (const inputName of inputPlayerNames) {
						if (!assignedPlayers.has(inputName)) {
							missingPlayers.push(inputName)
						}
					}

					for (const assignedName of assignedPlayers) {
						if (!inputPlayerNames.has(assignedName)) {
							extraPlayers.push(assignedName)
						}
					}

					if (missingPlayers.length > 0) {
						console.error(
							`❌ Proposition (${proposition.type}) missing players: ${missingPlayers.join(', ')}`,
						)
						return 0
					}
					if (extraPlayers.length > 0) {
						console.error(
							`❌ Proposition (${proposition.type}) has extra players: ${extraPlayers.join(', ')}`,
						)
						return 0
					}
				}

				return 1
			},
		},
		{
			name: 'Proposition Structure',
			description:
				'Verifies exactly 3 propositions with correct types: skill_balanced, position_focused, general.',
			scorer: ({ output }) => {
				const { propositions } = output.object

				if (propositions.length !== 3) {
					console.error(
						`❌ Expected 3 propositions, got ${propositions.length}`,
					)
					return 0
				}
				const expectedTypes: Array<PropositionType> = [
					'skill_balanced',
					'position_focused',
					'general',
				]
				const actualTypes = propositions.map((p) => p.type)

				for (const expectedType of expectedTypes) {
					if (!actualTypes.includes(expectedType)) {
						console.error(`❌ Missing proposition type: ${expectedType}`)

						return 0
					}
				}

				return 1
			},
		},
		{
			name: 'Skill Balance',
			description:
				'Verifies teams have similar average skill levels within ±30% variance. S=5, A=4, B=3, C=2, D=1.',
			scorer: ({ output, input }) => {
				const MAX_VARIANCE = 0.3
				const { propositions } = output.object
				const skillValues = {
					S: 5,
					A: 4,
					B: 3,
					C: 2,
					D: 1,
				} as const

				const playerSkills = new Map<string, number>()
				for (const player of input) {
					playerSkills.set(player.name, skillValues[player.skillTier])
				}

				for (const proposition of propositions) {
					const { teams } = proposition
					const teamAverages: number[] = []

					for (const team of teams) {
						let totalSkill = 0
						for (const playerName of team) {
							totalSkill += playerSkills.get(playerName) ?? 0
						}
						const avgSkill = team.length > 0 ? totalSkill / team.length : 0
						teamAverages.push(avgSkill)
					}

					const overallAvg =
						teamAverages.reduce((sum, avg) => sum + avg, 0) /
						teamAverages.length

					for (const teamAvg of teamAverages) {
						const variance = Math.abs((teamAvg - overallAvg) / overallAvg)

						if (variance > MAX_VARIANCE) {
							console.error(
								`❌ Proposition (${proposition.type}) team has ${(variance * 100).toFixed(1)}% variance (avg: ${teamAvg.toFixed(2)}, overall: ${overallAvg.toFixed(2)})`,
							)
							return 0
						}
					}
				}

				return 1
			},
		},
	],
})
