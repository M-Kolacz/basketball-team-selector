import { type NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { RegisterSchema } from '#app/lib/validations/auth'
import { registerUser } from '#app/services/auth.server'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		console.log({ body })
		const validatedData = RegisterSchema.parse(body)

		const loginUrl = new URL('/', request.url)
		return NextResponse.json(
			{ message: 'Registration successful' },
			{ status: 200 },
		)
	} catch (error) {
		console.error(error)
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
