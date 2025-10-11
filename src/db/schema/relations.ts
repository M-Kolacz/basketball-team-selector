import { relations } from 'drizzle-orm'
import { gameSessions } from './gameSessions'
import { propositions } from './propositions'

export const gameSessionsRelations = relations(
	gameSessions,
	({ many, one }) => ({
		propositions: many(propositions),
		selectedProposition: one(propositions, {
			fields: [gameSessions.selectedPropositionId],
			references: [propositions.id],
		}),
	}),
)

export const propositionsRelations = relations(propositions, ({ one }) => ({
	gameSession: one(gameSessions, {
		fields: [propositions.gameSessionId],
		references: [gameSessions.id],
	}),
}))
