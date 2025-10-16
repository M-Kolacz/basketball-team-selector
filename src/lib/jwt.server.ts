import jwt from 'jsonwebtoken'

export interface TokenPayload {
	userId: string
}

export function generateToken(payload: TokenPayload): string {
	const secret = process.env.JWT_SECRET

	if (!secret) {
		throw new Error('JWT_SECRET environment variable is not configured')
	}

	const expiresIn = '7d'

	try {
		return jwt.sign(payload, secret, {
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
	const secret = process.env.JWT_SECRET

	if (!secret) {
		throw new Error('JWT_SECRET environment variable is not configured')
	}

	try {
		const decoded = jwt.verify(token, secret, {
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
