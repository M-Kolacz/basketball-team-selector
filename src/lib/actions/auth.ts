'use server'

import { parseWithZod } from '@conform-to/zod'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import z from 'zod'
import {
	login,
	register,
	requireAnonymous,
	handleNewSession,
	getAuthSession,
} from '#app/lib/auth.server'
import { prisma } from '#app/lib/db.server'
import { safeRedirect } from '#app/lib/utils'
import {
	LoginSchema,
	LogoutSchema,
	RegisterSchema,
} from '#app/lib/validations/auth'

export const loginAction = async (_prevState: unknown, formData: FormData) => {
	await requireAnonymous()

	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			LoginSchema.transform(async (data, ctx) => {
				if (intent !== null) return { ...data, session: null }

				const session = await login(data)

				if (!session) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Invalid username or password',
					})
					return z.NEVER
				}
				return { ...data, session }
			}),
		async: true,
	})

	if (submission.status !== 'success' || !submission.value.session) {
		return { result: submission.reply({ hideFields: ['password'] }) }
	}

	const { session, redirectTo } = submission.value

	await handleNewSession(session)

	redirect(safeRedirect(redirectTo))
}

export const logout = async (_prevState: unknown, formData: FormData) => {
	const authSession = await getAuthSession()

	if (authSession?.sessionId) {
		void prisma.session
			.delete({ where: { id: authSession.sessionId } })
			.catch(() => {})
	}

	const submission = parseWithZod(formData, {
		schema: LogoutSchema,
	})
	if (submission.status !== 'success') {
		return { result: submission.reply() }
	}

	const { redirectTo } = submission.value

	const cookieStore = await cookies()
	cookieStore.delete('bts-session')
	redirect(safeRedirect(redirectTo))
}

export const registerAction = async (
	_prevState: unknown,
	formData: FormData,
) => {
	await requireAnonymous()

	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			RegisterSchema.superRefine(async (data, ctx) => {
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
			}).transform(async (data) => {
				if (intent !== null) return { ...data, session: null }

				const session = await register(data)
				return { ...data, session }
			}),
		async: true,
	})

	if (submission.status !== 'success' || !submission.value.session) {
		return {
			result: submission.reply({ hideFields: ['password', 'confirmPassword'] }),
		}
	}

	const { session, redirectTo } = submission.value

	await handleNewSession(session)

	redirect(safeRedirect(redirectTo))
}
