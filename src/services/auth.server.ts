import bcrypt from 'bcryptjs'
import { prisma, type User } from '#app/lib/db.server'

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
