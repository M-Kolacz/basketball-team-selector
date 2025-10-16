import { type NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { RegisterCommandSchema } from '#app/lib/validations/auth'
import { registerUser } from '#app/services/auth.server'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const validatedData = RegisterCommandSchema.parse(body)

		await registerUser(validatedData.username, validatedData.password)

		const loginUrl = new URL('/login', request.url)
		return NextResponse.redirect(loginUrl, { status: 303 })
	} catch (error) {
		if (error instanceof ZodError) {
			return NextResponse.json(
				{
					error: 'Validation error',
					message: 'Invalid request body',
					details: error.message,
				},
				{ status: 422 },
			)
		}

		if (error instanceof Error && error.message === 'Username already exists') {
			return NextResponse.json(
				{
					error: 'Conflict',
					message: error.message,
				},
				{ status: 409 },
			)
		}

		console.error('Registration error:', error)
		return NextResponse.json(
			{
				error: 'Internal server error',
				message: 'An unexpected error occurred while processing your request',
			},
			{ status: 500 },
		)
	}
}
