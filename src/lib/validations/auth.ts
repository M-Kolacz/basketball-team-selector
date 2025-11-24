import { z } from 'zod'

export const LoginSchema = z.object({
	username: z
		.string()
		.min(3, 'Username is required')
		.max(50, 'Username must be at most 50 characters')
		.trim()
		.toLowerCase(),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.max(72, 'Password must be at most 72 characters')
		.trim(),
	redirectTo: z.string().optional(),
})

export type Login = z.infer<typeof LoginSchema>

export const RegisterSchema = z
	.object({
		username: z
			.string()
			.min(1, 'Username is required')
			.max(50, 'Username must be at most 50 characters')
			.trim()
			.toLowerCase(),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(72, 'Password must be at most 72 characters')
			.trim(),
		confirmPassword: z.string().min(1, 'Password confirmation is required'),
		redirectTo: z.string().optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

export type Register = z.infer<typeof RegisterSchema>

export const LogoutSchema = z.object({
	redirectTo: z.string().optional(),
})
export type LogoutCommand = z.infer<typeof LogoutSchema>
