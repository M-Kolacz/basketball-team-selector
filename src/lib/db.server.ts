import { remember } from '@epic-web/remember'
import { PrismaClient } from '#app/../generated/prisma'

export const prisma = remember('prisma', () => {
	const client = new PrismaClient()

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
} from '#app/../generated/prisma'
