import { type NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { setAuthCookie } from '#app/lib/cookie.server'
import { generateToken } from '#app/lib/jwt.server'
import { LoginCommandSchema } from '#app/lib/validations/auth'
import { verifyCredentials } from '#app/services/auth.server'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const validatedData = LoginCommandSchema.parse(body)

		const user = await verifyCredentials(
			validatedData.username,
			validatedData.password,
		)

		const token = generateToken({
			userId: user.id,
		})

		const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
		await setAuthCookie(token, expiresIn)

		return NextResponse.json(
			{
				user: {
					id: user.id,
					username: user.username,
					role: user.role,
					createdAt: user.createdAt.toISOString(),
					updatedAt: user.updatedAt.toISOString(),
				},
				message: 'Login successful',
			},
			{ status: 200 },
		)
	} catch (error) {
		if (error instanceof ZodError) {
			return NextResponse.json(
				{
					error: 'Validation error',
					message: 'Invalid request body',
				},
				{ status: 422 },
			)
		}

		if (
			error instanceof Error &&
			error.message === 'Invalid username or password'
		) {
			return NextResponse.json(
				{
					error: 'Authentication failed',
					message: error.message,
				},
				{ status: 401 },
			)
		}

		console.error('Login error:', error)
		return NextResponse.json(
			{
				error: 'Internal server error',
				message: 'An unexpected error occurred while processing your request',
			},
			{ status: 500 },
		)
	}
}
