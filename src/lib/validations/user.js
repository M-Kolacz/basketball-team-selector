import { z } from 'zod';
export var usersListQuerySchema = z.object({
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
        .pipe(z
        .number()
        .int()
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit cannot exceed 100')),
    sort: z
        .enum(['username', 'created_at'], {
        message: "Sort field must be either 'username' or 'created_at'",
    })
        .optional()
        .default('username'),
});
