import { remember } from '@epic-web/remember'
import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'
import { PrismaClient } from '#app/../generated/prisma/client'

neonConfig.webSocketConstructor = ws

export const prisma = remember('prisma', () => {
	const connectionString = process.env.DATABASE_URL
	const adapter = new PrismaNeon({ connectionString })
	const client = new PrismaClient({ adapter })

	void client.$connect()
	return client
})

export type {
	User,
	UserRole,
	GameSession,
	Password,
	Player,
	Position,
	Proposition,
	PropositionType,
	SkillTier,
	Team,
} from '#app/../generated/prisma/client'
