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
