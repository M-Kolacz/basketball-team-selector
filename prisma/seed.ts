import { faker } from '@faker-js/faker'
import bcryptjs from 'bcryptjs'
import {
	prisma,
	type Proposition,
	type Player,
	type Team,
} from '#app/lib/db.server'

const seed = async () => {
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
		console.log('🗑️  Clearing existing games...')
		await prisma.game.deleteMany()
		console.log('🗑️  Clearing existing scores...')
		await prisma.score.deleteMany()

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
		const players: Player[] = Array.from({ length: 20 }, () => ({
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

		console.log('📝 Inserting seed teams data...')
		const teams: Team[] = Array.from({ length: 6 }, () => ({
			id: faker.string.uuid(),
			name: faker.animal.type(),
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

		console.log('📝 Inserting seed game session data...')
		const gameSession = await prisma.gameSession.create({
			data: {
				id: faker.string.uuid(),
				createdAt: faker.date.recent({ days: 10 }),
				updatedAt: faker.date.recent({ days: 5 }),
				description: 'Casual Friday Game',
				gameDatetime: faker.date.soon({ days: 5 }),
			},
		})

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
		const selectedPropositionId = numberOfPropositions[0]!.id
		const selectedProposition = await prisma.proposition.findUnique({
			where: { id: selectedPropositionId },
			select: { teams: true },
		})

		console.log('📝 Inserting seed games and scores data...')
		const games = Array.from({ length: 5 })
		for (const ignored of games) {
			const game = await prisma.game.create({
				data: {
					gameSession: {
						connect: { id: gameSession.id },
					},
				},
			})

			await prisma.score.create({
				data: {
					points: faker.number.int({ min: 0, max: 30 }),
					game: { connect: { id: game.id } },
					team: {
						connect: { id: selectedProposition!.teams[0]!.id },
					},
				},
			})

			await prisma.score.create({
				data: {
					points: faker.number.int({ min: 0, max: 30 }),
					game: { connect: { id: game.id } },
					team: {
						connect: { id: selectedProposition!.teams[1]!.id },
					},
				},
			})
		}

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

await seed()
console.log('🏁 Seeding process finished')

export { seed }
