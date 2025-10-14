import { z } from 'zod'

/**
 * Validation schema for GET /api/users query parameters.
 *
 * Validates and transforms query string parameters:
 * - page: Positive integer >= 1 (default: 1)
 * - limit: Positive integer between 1-100 (default: 20)
 * - sort: Either 'username' or 'created_at' (default: 'username')
 */
export const usersListQuerySchema = z.object({
	page: z
		.string()
		.optional()
		.default('1')
		.transform(Number)
		.pipe(z.number().int().min(1, 'Page must be greater than 0')),
	limit: z
		.string()
		.optional()
		.default('20')
		.transform(Number)
		.pipe(
			z
				.number()
				.int()
				.min(1, 'Limit must be at least 1')
				.max(100, 'Limit cannot exceed 100'),
		),
	sort: z
		.enum(['username', 'created_at'], {
			errorMap: () => ({
				message: "Sort field must be either 'username' or 'created_at'",
			}),
		})
		.optional()
		.default('username'),
})

export type UsersListQuery = z.infer<typeof usersListQuerySchema>
