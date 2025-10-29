'use server'

import { parseWithZod } from '@conform-to/zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import z from 'zod'
import { prisma } from '#app/lib/db.server'
import { env } from '#app/lib/env.mjs'
import { LoginSchema, RegisterSchema } from '#app/lib/validations/auth'

export const login = async (_prevState: unknown, formData: FormData) => {
	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			LoginSchema.transform(async (data, ctx) => {
				if (intent !== null) return { ...data, user: null }

				const userWithPassword = await prisma.user.findUnique({
					where: {
						username: data.username,
					},
					select: {
						id: true,
						password: {
							select: { hash: true },
						},
					},
				})

				const isValidPassword = await bcrypt.compare(
					data.password,
					userWithPassword?.password?.hash || '',
				)

				if (!userWithPassword || !isValidPassword) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Invalid username or password',
					})
					return z.NEVER
				}
				return { userId: userWithPassword.id }
			}),
		async: true,
	})

	if (submission.status !== 'success' || !submission.value.userId) {
		return { result: submission.reply({ hideFields: ['password'] }) }
	}

	const { userId } = submission.value

	const token = jwt.sign({ userId }, env.JWT_SECRET, {
		algorithm: 'HS256',
		expiresIn: '7d',
	})

	const cookieStore = await cookies()
	cookieStore.set('bts-session', token, {
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secure: env.NODE_ENV === 'production',
		maxAge: 7 * 24 * 60 * 60,
	})

	redirect('/games')
}

export const logout = async () => {
	const cookieStore = await cookies()
	cookieStore.delete('bts-session')
	redirect('/')
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

	const hashedPassword = await bcrypt.hash(password, 10)

	const user = await prisma.user.create({
		data: {
			username,
			role: 'user',
			password: {
				create: { hash: hashedPassword },
			},
		},
		select: { id: true },
	})

	const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
		algorithm: 'HS256',
		expiresIn: '7d',
	})

	const cookieStore = await cookies()
	cookieStore.set('bts-session', token, {
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secure: env.NODE_ENV === 'production',
		maxAge: 7 * 24 * 60 * 60,
	})

	redirect('/games')
}
