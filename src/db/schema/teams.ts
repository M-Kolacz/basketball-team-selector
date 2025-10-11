import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core'

export const teams = pgTable('teams', {
	id: uuid('id').defaultRandom().primaryKey(),
	players: uuid('players').array().notNull().default([]),
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
})

export type Team = typeof teams.$inferSelect

export type NewTeam = typeof teams.$inferInsert
