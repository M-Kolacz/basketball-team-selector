import { faker } from '@faker-js/faker'
import { evalite } from 'evalite'
import { generatePropositions } from '#app/lib/create-team-propositions'
import { type Player } from '#app/lib/db.server'

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
	],
})
