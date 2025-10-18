import bcrypt from 'bcryptjs'
import { type Password, type User, prisma } from '#app/lib/db.server'

/**
 * Custom error class for authentication failures.
 * Thrown when a user is not authenticated (missing or invalid credentials).
 */
export class AuthenticationError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'AuthenticationError'
	}
}

/**
 * Custom error class for authorization failures.
 * Thrown when an authenticated user lacks required permissions.
 */
export class AuthorizationError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'AuthorizationError'
	}
}

/**
 * Type assertion function that ensures a user is authenticated.
 * Throws AuthenticationError if user is null.
 *
 * @param user - User object or null
 * @throws {AuthenticationError} When user is null
 */
export function requireAuth(user: User | null): asserts user is User {
	if (!user) {
		throw new AuthenticationError(
			'You must be logged in to access this resource',
		)
	}
}

/**
 * Validates that a user has admin role.
 * Throws AuthorizationError if user is not an admin.
 *
 * @param user - Authenticated user object
 * @throws {AuthorizationError} When user.role is not 'admin'
 */
export function requireAdmin(user: User): void {
	if (user.role !== 'admin') {
		throw new AuthorizationError('Admin access required to list users')
	}
}

export const verifyUserPassword = async (
	where: Pick<User, 'username'> | Pick<User, 'id'>,
	password: Password['hash'],
) => {
	const userWithPassword = await prisma.user.findUnique({
		where,
		select: { id: true, password: { select: { hash: true } } },
	})

	if (!userWithPassword || !userWithPassword.password) return null

	const isValid = await bcrypt.compare(password, userWithPassword.password.hash)

	if (!isValid) return null

	return { id: userWithPassword.id }
}

export const login = async ({
	username,
	password,
}: {
	username: User['username']
	password: string
}) => {
	const user = await verifyUserPassword({ username }, password)
	if (!user) return null

	return user
}
