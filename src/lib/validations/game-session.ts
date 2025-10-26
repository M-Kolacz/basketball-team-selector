import { z } from 'zod'

export const UpdateGameScoreSchema = z.object({
	firstScoreId: z.string().uuid('Invalid score ID'),
	firstScorePoints: z.number().int().min(0, 'Score must be non-negative'),
	secondScoreId: z.string().uuid('Invalid score ID'),
	secondScorePoints: z.number().int().min(0, 'Score must be non-negative'),
})

export type UpdateGameScoreCommand = z.infer<typeof UpdateGameScoreSchema>

export const GetGameSessionSchema = z.object({
	gameSessionId: z.string().uuid('Invalid game session ID'),
})
export type GetGameSessionQuery = z.infer<typeof GetGameSessionSchema>

export const CreateGameSessionSchema = z.object({
	gameDatetime: z
		.string()
		.min(1, 'Game date and time is required')
		.refine((datetime) => {
			const selectedDate = new Date(datetime)
			return !isNaN(selectedDate.getTime())
		}, 'Invalid date format')
		.refine(
			(datetime) => new Date(datetime) >= new Date(),
			'Game date cannot be in the past',
		),
	description: z.string().max(500).optional(),
	playerIds: z.array(z.string().uuid()),
})

export type CreateGameSessionCommand = z.infer<typeof CreateGameSessionSchema>

export const SelectPropositionSchema = z.object({
	gameSessionId: z.string().uuid('Invalid game session ID'),
	propositionId: z.string().uuid('Invalid proposition ID'),
})

export type SelectPropositionCommand = z.infer<typeof SelectPropositionSchema>
