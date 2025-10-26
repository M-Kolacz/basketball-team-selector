import { generateObject } from 'ai'
import { z } from 'zod'
import { getOptimalTeamConfiguration } from '#app/lib/createTeamHelpers'
import { createTeamsModel } from '#app/lib/models'

export const generatePropositions = (selectedPlayers: Player[]) => {
	const randomnessLevel: number = 0.8
	const randomSeed = Math.random()

	const {
		numberOfTeams,
		minPlayersPerTeam: minNumberOfPlayersInTeam,
		maxPlayersPerTeam: maxNumberOfPlayersInTeam,
	} = getOptimalTeamConfiguration(selectedPlayers)

	const shuffledPlayers = [...selectedPlayers].sort(() => Math.random() - 0.5)

	const generatedProposition = generateObject({
		model: createTeamsModel,
		schemaName: 'TeamSelectionResult',
		schemaDescription: 'Result of the team selection process.',
		schema: getTeamSelectionSchema({
			numberOfTeams,
			minNumberOfPlayersInTeam,
			maxNumberOfPlayersInTeam,
		}),
		temperature: randomnessLevel,
		topP: 0.9,
		seed: Math.floor(randomSeed * 1000000),
		system: `
You are an expert basketball team selector. Your role is to create balanced and competitive teams based on a provided list of players.

You will receive a list of players, each with their name, position(s), and tierListPosition (skill level). You must create exactly 3 team setup propositions, each using a different balancing approach:

**PROPOSITION 1 - Skill-Based Balance**: Create teams based primarily on tierListPosition (skill level). Distribute players across teams to ensure each team has a similar combined skill level. Focus on balancing the tier rankings (S, A, B, C, D) so that each team has roughly equal overall power.

**PROPOSITION 2 - Position-Based Balance**: Create teams based primarily on positions that players can play. Ensure each team has a good mix of positions (Point Guard, Shooting Guard, Small Forward, Power Forward, Center) for strategic diversity and fair play. Focus on positional balance rather than skill balance.

**PROPOSITION 3 - Mixed Approach**: Create teams using both tierListPosition and position information. Balance both skill levels and positional diversity simultaneously. This approach should consider both factors equally to create the most strategically balanced teams.

**Team sizing rule**: Every team must have at least 5 players (minimum for basketball). You must create exactly ${numberOfTeams} teams with ${minNumberOfPlayersInTeam}${
			minNumberOfPlayersInTeam !== maxNumberOfPlayersInTeam
				? `-${maxNumberOfPlayersInTeam}`
				: ''
		} players each. Distribute all ${
			selectedPlayers.length
		} players across these teams.

For each proposition, provide a descriptive title that reflects the balancing strategy used and a clear rationale explaining how you applied that specific approach.

IMPORTANT: You must create exactly ${numberOfTeams} teams in each proposition, with each team having between ${minNumberOfPlayersInTeam} and ${maxNumberOfPlayersInTeam} players.
`,
		prompt: `
    <Players>
    ${shuffledPlayers.map(
			(player) =>
				`
        <Player>
          <Name>${player.name}</Name>
          <Positions>${player.positions.join(', ')}</Positions>
          <TierListPosition>${player.skillTier}</TierListPosition>
        </Player>
      `,
		)}
    </Players>

    Based on the above list of ${
			selectedPlayers.length
		} players, create exactly 3 team setup propositions using the three distinct approaches specified in the system prompt:

    1. **First proposition**: Focus on tierListPosition (skill balance)
    2. **Second proposition**: Focus on position distribution (positional balance)  
    3. **Third proposition**: Combined approach using both tierListPosition and position

    You MUST create exactly ${numberOfTeams} teams in each proposition, with each team having between ${minNumberOfPlayersInTeam} and ${maxNumberOfPlayersInTeam} players. Use all players and ensure no player appears in multiple teams within the same proposition.
    `,
	})

	return generatedProposition
}

export const getTeamSelectionSchema = ({
	numberOfTeams,
	minNumberOfPlayersInTeam,
	maxNumberOfPlayersInTeam,
}: {
	numberOfTeams: number
	minNumberOfPlayersInTeam: number
	maxNumberOfPlayersInTeam: number
}) =>
	z.object({
		propositions: z
			.array(
				z.object({
					title: z
						.string()
						.describe('A descriptive title for this team setup proposition'),
					rationale: z
						.string()
						.describe(
							'Explanation of the strategy and reasoning behind this team arrangement',
						),
					teams: z
						.array(
							z
								.array(z.string().describe('Name of the player in the team.'))
								.describe('List of player names in a basketball team.')
								.min(minNumberOfPlayersInTeam)
								.max(maxNumberOfPlayersInTeam),
						)
						.length(numberOfTeams)
						.describe(
							'Array of teams, where each team is an array of player names.',
						),
					likes: z
						.number()
						.default(0)
						.describe('Number of likes for this proposition'),
				}),
			)
			.length(3)
			.describe(
				'Array of exactly 3 different team setup propositions, each with different strategic approaches to achieving the most equal power balance between all teams',
			),
	})
export type TeamSelection = z.infer<ReturnType<typeof getTeamSelectionSchema>>

export const teamSchema = z
	.array(z.string().describe('Name of the player in the team.'))
	.describe('List of player names in the basketball team.')
export type Team = z.infer<typeof teamSchema>

export const playerSchema = z.object({
	id: z.string().describe('Unique identifier for the player (UUID).'),
	name: z.string().describe('Full name of the player.'),
	positions: z
		.array(z.enum(['PG', 'SG', 'SF', 'PF', 'C']))
		.describe('Primary position on the court.'),
	skillTier: z
		.enum(['S', 'A', 'B', 'C', 'D'])
		.describe(
			'General skill tier ranking of the player (S = Excellent, A = Very Good, B = Good, C = Average, D = Below Average).',
		),
})
export type Player = z.infer<typeof playerSchema>
