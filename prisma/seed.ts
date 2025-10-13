import { faker } from '@faker-js/faker'
import {
	prisma,
	type Player,
	type GameSession,
	type Proposition,
	type Team,
	type User,
} from '#app/lib/db.server'

async function seed() {
	console.log('🌱 Seeding database...')

	try {
		// Clear existing data
		console.log('🗑️  Clearing existing players...')
		await prisma.player.deleteMany()
		console.log('🗑️  Clearing existing propositions...')
		await prisma.proposition.deleteMany()
		console.log('🗑️  Clearing existing game sessions...')
		await prisma.gameSession.deleteMany()
		console.log('🗑️  Clearing existing users...')
		await prisma.user.deleteMany()

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
		}
		const regularUser: User = {
			id: faker.string.uuid(),
			username: faker.internet.username(),
			createdAt: faker.date.past({ years: 1 }),
			updatedAt: faker.date.recent({ days: 10 }),
			role: 'user',
		}

		const newTeams: Team[] = Array.from({ length: 2 }, () => ({
			id: faker.string.uuid(),
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
		}

		const gameSession: GameSession = {
			id: gameSessionId,
			createdAt: faker.date.recent({ days: 10 }),
			updatedAt: faker.date.recent({ days: 5 }),
			description: 'Casual Friday Game',
			gameDatetime: faker.date.soon({ days: 5 }),
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
			selectedPropositionId: null,
		}

		console.log('📝 Inserting seed players data...')
		await prisma.player.createMany({ data: teamPlayers })

		console.log('📝 Inserting seed users data...')
		await prisma.user.createMany({ data: [adminUser, regularUser] })
		console.log('📝 Inserting seed teams data...')
		await prisma.team.createMany({ data: newTeams })
		console.log('📝 Inserting seed game sessions data...')
		await prisma.gameSession.create({ data: gameSession })
		console.log('📝 Inserting seed propositions data...')
		await prisma.proposition.create({ data: proposition })

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
