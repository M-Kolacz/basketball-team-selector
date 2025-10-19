import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma, type User } from '#app/lib/db.server'
import { env } from '#app/lib/env.mjs'

export interface AuthenticatedUser {
	id: string
	username: string
	role: User['role']
	createdAt: Date
	updatedAt: Date
}

export async function verifyCredentials(username: string, password: string) {
	const user = await prisma.user.findUnique({
		where: { username },
		include: {
			password: true,
		},
	})

	if (!user || !user.password) return null

	const isPasswordValid = await bcrypt.compare(password, user.password.hash)

	if (!isPasswordValid) return null

	return {
		id: user.id,
		username: user.username,
		role: user.role,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
	}
}

export async function hashPassword(plainTextPassword: string): Promise<string> {
	return bcrypt.hash(plainTextPassword, 10)
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
	const cookieStore = await cookies()
	const token = cookieStore.get('bts-session')

	if (!token) return null

	const decoded = jwt.verify(token.value, env.JWT_SECRET, {
		algorithms: ['HS256'],
	}) as { userId: string }

	const user = await prisma.user.findUnique({
		where: { id: decoded.userId },
		select: {
			id: true,
			username: true,
			role: true,
			createdAt: true,
			updatedAt: true,
		},
	})

	if (!user) return null

	return {
		id: user.id,
		username: user.username,
		role: user.role,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
	}
}

export async function registerUser(
	username: string,
	password: string,
): Promise<AuthenticatedUser> {
	const hashedPassword = await hashPassword(password)

	try {
		const user = await prisma.user.create({
			data: {
				username,
				role: 'user',
				password: {
					create: { hash: hashedPassword },
				},
			},
		})

		return {
			id: user.id,
			username: user.username,
			role: user.role,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		}
	} catch (error) {
		throw error
	}
}
