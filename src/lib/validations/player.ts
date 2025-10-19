import { z } from 'zod'

export const playersListQuerySchema = z.object({
	page: z
		.number()
		.int()
		.min(1, 'Page must be greater than 0')
		.optional()
		.default(1),
	limit: z
		.number()
		.int()
		.min(1, 'Limit must be at least 1')
		.max(100, 'Limit cannot exceed 100')
		.optional()
		.default(50),
	sort: z
		.enum(['name', 'skill_tier', 'created_at'], {
			message: "Sort field must be 'name', 'skill_tier', or 'created_at'",
		})
		.optional()
		.default('name'),
	skillTier: z.enum(['S', 'A', 'B', 'C', 'D']).optional(),
	position: z.enum(['PG', 'SG', 'SF', 'PF', 'C']).optional(),
})

export type PlayersListQuery = z.infer<typeof playersListQuerySchema>

export const GetPlayersOptionsSchema = z
	.object({
		sort: z.enum(['name', 'skill_tier', 'created_at']).optional(),
		skill_tier: z.enum(['S', 'A', 'B', 'C', 'D']).optional(),
		position: z.enum(['PG', 'SG', 'SF', 'PF', 'C']).optional(),
	})
	.optional()

export type GetPlayersOptions = z.infer<typeof GetPlayersOptionsSchema>

export const CreatePlayerSchema = z.object({
	name: z
		.string()
		.min(1, 'Player name is required')
		.max(100, 'Player name must be at most 100 characters')
		.trim(),
	skillTier: z.enum(['S', 'A', 'B', 'C', 'D'], {
		message: 'Skill tier must be one of: S, A, B, C, D',
	}),
	positions: z
		.array(z.enum(['PG', 'SG', 'SF', 'PF', 'C']), {
			message: 'Position must be one of: PG, SG, SF, PF, C',
		})
		.min(1, 'At least one position is required'),
})

export type CreatePlayerCommand = z.infer<typeof CreatePlayerSchema>
