import { type NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { setAuthCookie } from '#app/lib/cookie.server'
import { generateToken } from '#app/lib/jwt.server'
import { LoginSchema } from '#app/lib/validations/auth'
import { verifyCredentials } from '#app/services/auth.server'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const validatedData = LoginSchema.parse(body)

		const user = await verifyCredentials(
			validatedData.username,
			validatedData.password,
		)

		const token = generateToken({
			userId: user.id,
		})

		const expiresIn = '7d'
		await setAuthCookie(token, expiresIn)

		return NextResponse.json({ message: 'Success' })
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
