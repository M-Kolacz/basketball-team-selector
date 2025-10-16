import type { NextRequest } from 'next/server'
import type { User } from '#app/lib/db.server'

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
 * Retrieves the currently authenticated user from the request.
 *
 * NOTE: This is a placeholder implementation. The actual implementation
 * should be based on your authentication strategy (session cookies, JWT, etc.).
 *
 * @param request - Next.js request object
 * @returns Promise resolving to User object or null if not authenticated
 *
 * @todo Implement actual authentication logic based on session/JWT strategy
 */
export async function getCurrentUser(
	request: NextRequest,
): Promise<User | null> {
	// TODO: Implement based on your auth strategy
	// Examples:
	// - Session cookies: Read session cookie and validate against database
	// - JWT: Extract and verify JWT token from Authorization header
	// - NextAuth: Use getServerSession from next-auth
	throw new Error(
		'getCurrentUser not implemented - please implement based on your auth strategy',
	)
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
