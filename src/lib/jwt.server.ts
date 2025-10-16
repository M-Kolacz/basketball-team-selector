import jwt from 'jsonwebtoken'
import { env } from '#app/lib/env.mjs'

export interface TokenPayload {
	userId: string
}

export function generateToken(payload: TokenPayload): string {
	const expiresIn = '7d'

	try {
		return jwt.sign(payload, env.JWT_SECRET, {
			algorithm: 'HS256',
			expiresIn,
		})
	} catch (error) {
		throw new Error(
			`Failed to generate JWT token: ${error instanceof Error ? error.message : 'Unknown error'}`,
		)
	}
}

export function verifyToken(token: string): TokenPayload {
	try {
		const decoded = jwt.verify(token, env.JWT_SECRET, {
			algorithms: ['HS256'],
		}) as TokenPayload

		return decoded
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			throw new Error('Token has expired')
		}
		if (error instanceof jwt.JsonWebTokenError) {
			throw new Error('Invalid token')
		}
		throw new Error(
			`Failed to verify JWT token: ${error instanceof Error ? error.message : 'Unknown error'}`,
		)
	}
}
