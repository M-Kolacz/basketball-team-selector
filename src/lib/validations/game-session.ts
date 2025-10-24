import { z } from 'zod'

export const UpdateGameScoreSchema = z.object({
	gameSessionId: z.string().uuid('Invalid game session ID'),
	gameIndex: z.number().int().min(0, 'Game index must be non-negative'),
	scores: z
		.array(
			z.object({
				score: z.number().int().min(0, 'Score must be non-negative'),
				teamId: z.string().uuid('Invalid team ID'),
			}),
		)
		.length(2, 'Exactly 2 team scores are required'),
})

export type UpdateGameScoreCommand = z.infer<typeof UpdateGameScoreSchema>
