import { faker } from '@faker-js/faker'
import { db } from '#app/db'
import {
	players,
	type Player,
	type User,
	type Proposition,
	users,
	propositions,
	gameSessions,
	type GameSession,
} from '#app/db/schema'

async function seed() {
	console.log('🌱 Seeding database...')

	try {
		// Clear existing data
		console.log('🗑️  Clearing existing players...')
		await db.delete(players)
		console.log('🗑️  Clearing existing propositions...')
		await db.delete(propositions)
		console.log('🗑️  Clearing existing game sessions...')
		await db.delete(gameSessions)
		console.log('🗑️  Clearing existing users...')
		await db.delete(users)

		const teamPlayers: Player[] = Array.from({ length: 10 }, () => ({
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

		const adminUser: User = {
			id: faker.string.uuid(),
			username: faker.internet.username(),
			createdAt: faker.date.past({ years: 1 }),
			updatedAt: faker.date.recent({ days: 10 }),
			role: 'admin',
			passwordHash: faker.internet.password(),
		}
		const regularUser: User = {
			id: faker.string.uuid(),
			username: faker.internet.username(),
			createdAt: faker.date.past({ years: 1 }),
			updatedAt: faker.date.recent({ days: 10 }),
			role: 'user',
			//TODO Separate table for passwords
			passwordHash: faker.internet.password(),
		}

		const gameSessionId = faker.string.uuid()
		const propositionId = faker.string.uuid()

		const proposition: Proposition = {
			id: propositionId,
			createdAt: faker.date.recent({ days: 10 }),
			isSelected: true,
			gameSessionId: gameSessionId,
			type: 'general',
			version: 1,
			skillDifferential: '0.5',
			positionCoverageScore: '1',
			regenerationCount: 1,
			teamComposition: {
				team_a: {
					players: teamPlayers.slice(0, 5).map((player) => ({
						id: player.id,
						name: player.name,
						skill_tier: player.skillTier,
						positions: player.positions,
					})),
					position_coverage: {
						C: true,
						PG: true,
						SG: true,
						SF: true,
						PF: true,
					},
					total_skill_points: 10,
				},
				team_b: {
					players: teamPlayers.slice(5).map((player) => ({
						id: player.id,
						name: player.name,
						skill_tier: player.skillTier,
						positions: player.positions,
					})),
					position_coverage: {
						C: true,
						PG: true,
						SG: true,
						SF: true,
						PF: true,
					},
					total_skill_points: 10,
				},
			},
		}

		const gameSession: GameSession = {
			id: gameSessionId,
			createdAt: faker.date.recent({ days: 10 }),
			updatedAt: faker.date.recent({ days: 5 }),
			description: 'Casual Friday Game',
			gameDateTime: faker.date.soon({ days: 5 }),
			games: [{ team_a_score: 32, team_b_score: 28 }],
			selectedPropositionId: propositionId,
		}

		console.log('📝 Inserting seed players data...')
		await db.insert(players).values(teamPlayers)
		console.log('📝 Inserting seed users data...')
		await db.insert(users).values([adminUser, regularUser])
		console.log('📝 Inserting seed propositions data...')
		await db.insert(propositions).values([proposition])
		console.log('📝 Inserting seed game sessions data...')
		await db.insert(gameSessions).values([gameSession])

		console.log(`✅ Successfully seeded database!`)
		console.log('🎉 Database seeding completed!')
	} catch (error) {
		console.error('❌ Error seeding database:', error)
		process.exit(1)
	}
}

// Run the seed function if this file is executed directly
if (require.main === module) {
	seed()
		.then(() => {
			console.log('🏁 Seeding process finished')
			process.exit(0)
		})
		.catch((error) => {
			console.error('💥 Fatal error during seeding:', error)
			process.exit(1)
		})
}

export { seed }
