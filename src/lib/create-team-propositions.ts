import { generateObject } from 'ai'
import { z } from 'zod'
import { getTeamsConfiguration } from '#app/lib/create-team-helpers'
import { createTeamsModel } from '#app/lib/models'

export const generatePropositions = (selectedPlayers: Player[]) => {
	const { numberOfTeams, minPlayersPerTeam, maxPlayersPerTeam } =
		getTeamsConfiguration(selectedPlayers)

	const shuffledPlayers = [...selectedPlayers].sort(() => Math.random() - 0.5)

	const generatedProposition = generateObject({
		model: createTeamsModel,
		schemaName: 'TeamSelectionResult',
		schemaDescription: 'Result of the team selection process.',
		schema: getTeamSelectionSchema({
			numberOfTeams,
			minPlayersPerTeam,
			maxPlayersPerTeam,
		}),
		temperature: 0.8,
		topP: 0.9,
		system: `
You are an expert basketball team selector specialized in creating balanced, competitive team compositions.

## Domain Context

**Positions:**
- PG (Point Guard): Playmaker, ball handler
- SG (Shooting Guard): Perimeter scorer
- SF (Small Forward): Versatile wing player
- PF (Power Forward): Inside/mid-range player
- C (Center): Paint defender, rebounder

**Skill Tiers:** Each tier represents relative skill level
- S = 5 points (Elite player)
- A = 4 points (Strong player)
- B = 3 points (Solid player)
- C = 2 points (Average player)
- D = 1 point (Developing player)

## Task

Create exactly 3 team setup propositions using different balancing strategies. You will receive ${numberOfTeams} teams with ${minPlayersPerTeam}${
			minPlayersPerTeam !== maxPlayersPerTeam ? `-${maxPlayersPerTeam}` : ''
		} players per team (${
			selectedPlayers.length
		} total players).

**Goal:** Create competitive, fair matchups where games will be close and exciting. Teams should be evenly matched in power level.

## Balancing Strategies

**Strategy 1 - Skill-Balanced (type: "skill_balanced")**
- Primary: Balance skill tier distribution across teams
- Method: Calculate avg skill points per team (sum tier values / team size)
- Goal: Minimize variance between team averages (target: ±20% of overall avg)
- Secondary: Position coverage as tiebreaker

**Strategy 2 - Position-Focused (type: "position_focused")**
- Primary: Ensure positional diversity on each team
- Method: Each team should cover 3-5 different position types
- Goal: Maximize strategic flexibility per team
- Secondary: Rough skill balance as tiebreaker

**Strategy 3 - General (type: "general")**
- Balanced: Optimize both skill AND position equally (50/50 weight)
- Method: Score teams on both metrics, minimize combined variance
- Goal: Most strategically complete teams

## Critical Constraints

1. **Team Structure:** Exactly ${numberOfTeams} teams, each with ${minPlayersPerTeam}-${maxPlayersPerTeam} players
2. **Player Assignment:** Each player appears ONCE per proposition (no duplicates, no omissions)
3. **Proposition Types:** Must use exact type values: "skill_balanced", "position_focused", "general"
4. **Distribution:** Assign ALL ${
			selectedPlayers.length
		} players in each proposition

## Output Requirements

For each proposition provide:
- **type**: Exact string from strategies above
- **title**: Descriptive name reflecting the strategy
- **rationale**: Brief explanation (2-3 sentences) of HOW you applied the strategy
- **teams**: Array of ${numberOfTeams} teams, each containing player names

## Verification Checklist

Before submitting, verify:
□ Exactly 3 propositions created
□ Types are: skill_balanced, position_focused, general
□ Each team has ${minPlayersPerTeam}-${maxPlayersPerTeam} players
□ No duplicate players within same proposition
□ All ${selectedPlayers.length} input players assigned per proposition
`,
		prompt: `
Please create team propositions for an upcoming basketball game based on this list of players:

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

Create exactly 3 team setup propositions from these ${
			selectedPlayers.length
		} players, distributing them into ${numberOfTeams} teams of ${minPlayersPerTeam}${
			minPlayersPerTeam !== maxPlayersPerTeam ? `-${maxPlayersPerTeam}` : ''
		} players each.

Apply the three balancing strategies: skill_balanced, position_focused, and general.
    `,
	})

	return generatedProposition
}

export const getTeamSelectionSchema = ({
	numberOfTeams,
	minPlayersPerTeam,
	maxPlayersPerTeam,
}: {
	numberOfTeams: number
	minPlayersPerTeam: number
	maxPlayersPerTeam: number
}) =>
	z.object({
		propositions: z
			.array(
				z.object({
					type: z
						.enum(['skill_balanced', 'position_focused', 'general'])
						.describe(
							'Type of balancing approach used: skill_balanced (focus on skill tiers), position_focused (focus on positions), or general (mixed approach)',
						),
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
								.min(minPlayersPerTeam)
								.max(maxPlayersPerTeam),
						)
						.length(numberOfTeams)
						.describe(
							'Array of teams, where each team is an array of player names.',
						),
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
