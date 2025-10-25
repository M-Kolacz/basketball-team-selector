import { faker } from '@faker-js/faker'
import bcryptjs from 'bcryptjs'
import {
	prisma,
	type Proposition,
	type Player,
	type Team,
} from '#app/lib/db.server'
import { connect } from 'node:http2'

async function seed() {
	console.log('🌱 Seeding database...')

	try {
		console.log('🗑️  Clearing existing players...')
		await prisma.player.deleteMany()
		console.log('🗑️  Clearing existing propositions...')
		await prisma.proposition.deleteMany()
		console.log('🗑️  Clearing existing game sessions...')
		await prisma.gameSession.deleteMany()
		console.log('🗑️  Clearing existing users...')
		await prisma.user.deleteMany()
		console.log('🗑️  Clearing existing teams...')
		await prisma.team.deleteMany()

		console.log('📝 Inserting seed users data...')
		await prisma.user.create({
			data: {
				id: faker.string.uuid(),
				username: 'kody',
				createdAt: faker.date.past({ years: 1 }),
				updatedAt: faker.date.recent({ days: 10 }),
				role: 'admin',
				password: {
					create: {
						hash: await bcryptjs.hash('kodylovesyou', 12),
					},
				},
			},
		})
		await prisma.user.create({
			data: {
				id: faker.string.uuid(),
				username: faker.internet.username(),
				createdAt: faker.date.past({ years: 1 }),
				updatedAt: faker.date.recent({ days: 10 }),
				role: 'user',
			},
		})

		console.log('📝 Inserting seed players data...')
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

		for (const player of players) {
			await prisma.player.create({ data: player })
		}

		console.log('📝 Inserting seed game sessions data...')
		const gameSession = await prisma.gameSession.create({
			data: {
				id: faker.string.uuid(),
				createdAt: faker.date.recent({ days: 10 }),
				updatedAt: faker.date.recent({ days: 5 }),
				description: 'Casual Friday Game',
				gameDatetime: faker.date.soon({ days: 5 }),
			},
		})

		console.log('📝 Inserting seed teams data...')
		const teams: Team[] = Array.from({ length: 6 }, () => ({
			id: faker.string.uuid(),
			createdAt: faker.date.recent({ days: 10 }),
			updatedAt: faker.date.recent({ days: 5 }),
		}))
		for (const team of teams) {
			await prisma.team.create({
				data: {
					...team,
					players: {
						connect: faker.helpers
							.arrayElements(players, { min: 5, max: 5 })
							.map((player) => ({ id: player.id })),
					},
				},
			})
		}

		console.log('📝 Inserting seed propositions data...')
		const numberOfPropositions: Pick<Proposition, 'id'>[] = Array.from(
			{ length: 3 },
			() => ({
				id: faker.string.uuid(),
			}),
		)
		for (const proposition of numberOfPropositions) {
			await prisma.proposition.create({
				data: {
					id: proposition.id,
					createdAt: faker.date.recent({ days: 10 }),
					gameSession: { connect: { id: gameSession.id } },
					type: 'general',
					teams: {
						connect: faker.helpers
							.arrayElements(teams, { min: 2, max: 2 })
							.map((team) => ({ id: team.id })),
					},
				},
			})
		}

		const game = await prisma.game.create({
			data: {
				gameSession: {
					connect: { id: gameSession.id },
				},
			},
		})

		const firstScore = await prisma.score.create({
			data: {
				points: faker.number.int({ min: 0, max: 30 }),
				game: { connect: { id: game.id } },
				team: {
					connect: { id: teams[0]!.id },
				},
			},
		})

		const secondScore = await prisma.score.create({
			data: {
				points: faker.number.int({ min: 0, max: 30 }),
				game: { connect: { id: game.id } },
				team: {
					connect: { id: teams[1]!.id },
				},
			},
		})

		console.log('📝 Updating seed game sessions data with propositions...')
		await prisma.gameSession.update({
			where: { id: gameSession.id },
			data: {
				propositions: {
					connect: numberOfPropositions.map((proposition) => ({
						id: proposition.id,
					})),
				},
				selectedProposition: { connect: { id: numberOfPropositions[0]!.id } },
			},
		})

		console.log(`✅ Successfully seeded database!`)
		console.log('🎉 Database seeding completed!')
	} catch (error) {
		console.error('❌ Error seeding database:', error)
		process.exit(1)
	}
}

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
