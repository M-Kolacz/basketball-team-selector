import { z } from 'zod'

export const LoginSchema = z.object({
	username: z
		.string()
		.min(3, 'Username is required')
		.max(50, 'Username must be at most 50 characters'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type Login = z.infer<typeof LoginSchema>

export const RegisterSchema = z
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

export type RegisterCommand = z.infer<typeof RegisterSchema>

export const LogoutSchema = z.object({
	userId: z.string().uuid(),
})
export type LogoutCommand = z.infer<typeof LogoutSchema>
