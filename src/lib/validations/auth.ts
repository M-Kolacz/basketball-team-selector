import { z } from 'zod'

export const LoginCommandSchema = z.object({
	username: z
		.string()
		.min(1, 'Username is required')
		.max(50, 'Username must be at most 50 characters'),
	password: z.string().min(1, 'Password is required'),
})

export type LoginCommand = z.infer<typeof LoginCommandSchema>

export const RegisterCommandSchema = z
	.object({
		username: z
			.string()
			.min(1, 'Username is required')
			.max(50, 'Username must be at most 50 characters')
			.trim(),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(100, 'Password must be at most 100 characters'),
		confirmPassword: z.string().min(1, 'Password confirmation is required'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

export type RegisterCommand = z.infer<typeof RegisterCommandSchema>
