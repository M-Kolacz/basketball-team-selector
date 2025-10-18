'use server'

import { parseWithZod } from '@conform-to/zod'
import { redirect } from 'next/navigation'
import z from 'zod'
import { registerUser, verifyCredentials } from '#app/services/auth.server'
import { setAuthCookie } from './cookie.server'
import { prisma } from './db.server'
import { generateToken } from './jwt.server'
import { LoginSchema, RegisterSchema } from './validations/auth'

export const login = async (_prevState: unknown, formData: FormData) => {
	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			LoginSchema.transform(async (data, ctx) => {
				if (intent !== null) return { ...data, user: null }
				const user = await verifyCredentials(data.username, data.password)
				if (!user) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Invalid username or password',
					})
					return z.NEVER
				}
				return { user }
			}),
		async: true,
	})

	if (submission.status !== 'success' || !submission.value.user) {
		return submission.reply({ hideFields: ['password'] })
	}

	const { user } = submission.value

	const token = generateToken({
		userId: user.id,
	})

	const expiresIn = '7d'
	await setAuthCookie(token, expiresIn)

	redirect('/games')
}

export const register = async (_prevState: unknown, formData: FormData) => {
	const submission = await parseWithZod(formData, {
		schema: RegisterSchema.superRefine(async (data, ctx) => {
			const existingUser = await prisma.user.findUnique({
				where: { username: data.username },
				select: { id: true },
			})

			if (existingUser) {
				ctx.addIssue({
					path: ['username'],
					code: z.ZodIssueCode.custom,
					message: 'A user already exists with this username',
				})
				return
			}
		}),
		async: true,
	})

	if (submission.status !== 'success') {
		return submission.reply()
	}

	const { username, password } = submission.value

	await registerUser(username, password)

	redirect('/')
}
