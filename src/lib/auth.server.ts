import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma, type User } from '#app/lib/db.server'
import { env } from '#app/lib/env.mjs'
import { type Register, type Login } from '#app/lib/validations/auth'

export const AUTH_SESSION_KEY = 'bts-session'

export const getOptionalUser = async (): Promise<User | null> => {
	const authSession = await getAuthSession()

	if (!authSession) return null

	const user = await prisma.user.findUnique({
		where: { id: authSession.userId },
		select: {
			id: true,
			username: true,
			role: true,
			createdAt: true,
			updatedAt: true,
		},
	})

	return user
}

export const requireAdminUser = async (): Promise<User> => {
	const user = await getOptionalUser()

	if (!user || user.role !== 'admin') {
		throw new Error('Unauthorized: Admin access required')
	}

	return user
}

export const requireUser = async (): Promise<User> => {
	const user = await getOptionalUser()

	if (!user) {
		throw new Error('Unauthorized: User access required')
	}

	return user
}

export const requireAnonymous = async (): Promise<void> => {
	const user = await getOptionalUser()

	if (user) {
		redirect('/games')
	}
}

export const login = async ({ username, password }: Login) => {
	const user = await verifyUserPassword(username, password)
	if (!user) return null
	return user
}

export const register = async ({ username, password }: Register) => {
	const hashedPassword = await getPasswordHash(password)

	const user = await prisma.user.create({
		data: {
			username,
			password: {
				create: {
					hash: hashedPassword,
				},
			},
		},
		select: { id: true },
	})

	return user
}

export const getPasswordHash = async (password: string) => {
	const hash = await bcrypt.hash(password, 10)
	return hash
}

export const verifyUserPassword = async (
	username: Login['username'],
	password: Login['password'],
) => {
	const userWithPassword = await prisma.user.findUnique({
		where: { username },
		select: { id: true, password: { select: { hash: true } } },
	})

	if (!userWithPassword || !userWithPassword.password) return null

	const isValid = await bcrypt.compare(password, userWithPassword.password.hash)

	if (!isValid) return null

	return { id: userWithPassword.id }
}

type AuthCookie = { userId: string }

export const saveAuthSession = async (userId: string) => {
	const token = jwt.sign({ userId } as AuthCookie, env.JWT_SECRET, {
		algorithm: 'HS256',
		expiresIn: '7d',
	})

	const cookieStore = await cookies()
	cookieStore.set(AUTH_SESSION_KEY, token, {
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secure: env.NODE_ENV === 'production',
		maxAge: 7 * 24 * 60 * 60,
	})
}

export const getAuthSession = async () => {
	const cookieStore = await cookies()
	const token = cookieStore.get(AUTH_SESSION_KEY)

	if (!token) return null

	const decoded = jwt.verify(token.value, env.JWT_SECRET, {
		algorithms: ['HS256'],
	}) as AuthCookie

	return decoded
}
