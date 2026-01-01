import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers.js'
import { redirect } from 'next/navigation.js'
import { prisma, type User } from '#app/lib/db.server'
import { env } from '#app/lib/env.mjs'
import { type Register, type Login } from '#app/lib/validations/auth'

export type AuthCookie = { sessionId: string }

export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30
export const getSessionExpirationDate = () =>
	new Date(Date.now() + SESSION_EXPIRATION_TIME)

export const AUTH_SESSION_KEY = 'bts-session'

export const createAuthToken = (sessionId: string) =>
	jwt.sign({ sessionId: sessionId } as AuthCookie, env.JWT_SECRET, {
		algorithm: 'HS256',
		expiresIn: '30d',
	})

export const createAuthCookie = (
	authToken: string,
	expirationDate = getSessionExpirationDate(),
) => {
	return {
		name: AUTH_SESSION_KEY,
		value: authToken,
		sameSite: 'lax' as boolean | 'none' | 'lax' | 'strict' | undefined,
		path: '/',
		httpOnly: true,
		secure: env.NODE_ENV === 'production',
		expires: expirationDate,
	}
}

export const getUserId = async () => {
	const sessionCookie = await getAuthSession()
	if (!sessionCookie) return null

	const session = await prisma.session.findUnique({
		where: {
			id: sessionCookie.sessionId,
			expirationDate: { gt: new Date() },
		},
		select: { userId: true },
	})

	if (!session?.userId) return null

	return session.userId
}

export const getOptionalUser = async (): Promise<User | null> => {
	const userId = await getUserId()
	if (!userId) return null

	const user = await prisma.user.findUnique({
		where: { id: userId },
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
	const session = await prisma.session.create({
		select: { id: true, expirationDate: true, userId: true },
		data: {
			expirationDate: getSessionExpirationDate(),
			userId: user.id,
		},
	})

	return session
}

export const register = async ({ username, password }: Register) => {
	const hashedPassword = await getPasswordHash(password)

	const session = await prisma.session.create({
		data: {
			expirationDate: getSessionExpirationDate(),
			user: {
				create: {
					username,
					password: {
						create: {
							hash: hashedPassword,
						},
					},
				},
			},
		},
		select: { id: true, expirationDate: true },
	})

	return session
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

export const handleNewSession = async ({
	id,
	expirationDate,
}: {
	id: string
	expirationDate: Date
}) => {
	const token = createAuthToken(id)

	const cookieStore = await cookies()
	cookieStore.set(createAuthCookie(token, expirationDate))
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
