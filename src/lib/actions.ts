'use server'

import { parseWithZod } from '@conform-to/zod'
import { redirect } from 'next/navigation'
import z from 'zod'
import { verifyCredentials } from '#app/services/auth.server'
import { setAuthCookie } from './cookie.server'
import { generateToken } from './jwt.server'
import { LoginSchema } from './validations/auth'

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
