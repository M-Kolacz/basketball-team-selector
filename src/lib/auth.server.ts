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

export const getCurrentUser = async (): Promise<AuthenticatedUser | null> => {
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

	return user
}

export const requireAdminUser = async (): Promise<AuthenticatedUser> => {
	const user = await getCurrentUser()

	if (!user) {
		throw new Error('Unauthorized: Admin access required')
	}

	if (user.role !== 'admin') {
		throw new Error('Unauthorized: Admin access required')
	}

	return user
}

export const requireUser = async (): Promise<AuthenticatedUser> => {
	const user = await getCurrentUser()

	if (!user) {
		throw new Error('Unauthorized: User access required')
	}

	return user
}
