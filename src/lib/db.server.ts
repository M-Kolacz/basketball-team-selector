import { remember } from '@epic-web/remember'
// eslint-disable-next-line import/no-relative-parent-imports
import { PrismaClient } from '../../generated/prisma'

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
	// eslint-disable-next-line import/no-relative-parent-imports
} from '../../generated/prisma/edge'
