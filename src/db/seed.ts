import { faker } from '@faker-js/faker'
import { db } from '#app/db'
import {
	players,
	type Player,
	type Proposition,
	users,
	type User,
	propositions,
	gameSessions,
	type GameSession,
	type Team,
	teams,
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

		const newTeams: Team[] = Array.from({ length: 2 }, () => ({
			id: faker.string.uuid(),
			players: faker.helpers.arrayElements(
				teamPlayers.map((p) => p.id),
				{ min: 5, max: 5 },
			),
			createdAt: faker.date.recent({ days: 10 }),
			updatedAt: faker.date.recent({ days: 5 }),
		}))

		const gameSessionId = faker.string.uuid()
		const propositionId = faker.string.uuid()

		const proposition: Proposition = {
			id: propositionId,
			createdAt: faker.date.recent({ days: 10 }),
			gameSessionId: gameSessionId,
			type: 'general',
			teams: [newTeams[0]!.id, newTeams[1]!.id],
		}

		const gameSession: GameSession = {
			id: gameSessionId,
			createdAt: faker.date.recent({ days: 10 }),
			updatedAt: faker.date.recent({ days: 5 }),
			description: 'Casual Friday Game',
			gameDateTime: faker.date.soon({ days: 5 }),
			games: [
				[
					{ score: 32, teamId: newTeams[0]!.id },
					{ score: 28, teamId: newTeams[1]!.id },
				],
				[
					{ score: 29, teamId: newTeams[0]!.id },
					{ score: 32, teamId: newTeams[1]!.id },
				],
			],
			selectedPropositionId: propositionId,
			teamPropositions: [propositionId],
		}

		console.log('📝 Inserting seed players data...')
		await db.insert(players).values(teamPlayers)
		console.log('📝 Inserting seed users data...')
		await db.insert(users).values([adminUser, regularUser])
		console.log('📝 Inserting seed teams data...')
		await db.insert(teams).values(newTeams)
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
