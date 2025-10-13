import {
	pgTable,
	uuid,
	timestamp,
	text,
	jsonb,
	index,
} from 'drizzle-orm/pg-core'

export type Game = { score: number; teamId: string }[][]

export const gameSessions = pgTable(
	'game_sessions',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		createdAt: timestamp('created_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
		gameDateTime: timestamp('game_datetime', { withTimezone: true }).notNull(),
		games: jsonb('games').$type<Game[]>().notNull().default([]),
		selectedPropositionId: uuid('selected_proposition_id'),
		teamPropositions: uuid('team_propositions').array().notNull().default([]),
		description: text('description'),
	},
	(table) => {
		return [
			index('idx_game_sessions_game_datetime').on(table.gameDateTime.desc()),
			index('idx_game_sessions_selected_proposition').on(
				table.selectedPropositionId,
			),
		]
	},
)

export type GameSession = typeof gameSessions.$inferSelect
export type NewGameSession = typeof gameSessions.$inferInsert
