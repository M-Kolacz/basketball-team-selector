import { pgTable, uuid, timestamp, index } from 'drizzle-orm/pg-core'
import { propositionTypeEnum } from './enums'

export const propositions = pgTable(
	'propositions',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		createdAt: timestamp('created_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
		gameSessionId: uuid('game_session_id').notNull(),
		type: propositionTypeEnum('type').notNull(),
		teams: uuid('teams').array().notNull().default([]),
	},
	(table) => {
		return [
			index('idx_propositions_game_session_id').on(table.gameSessionId),
			index('idx_propositions_type').on(table.type),
		]
	},
)

export type Proposition = typeof propositions.$inferSelect
export type NewProposition = typeof propositions.$inferInsert
