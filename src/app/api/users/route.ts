import { type NextRequest, NextResponse } from 'next/server'
import { AuthenticationError, AuthorizationError } from '#app/lib/auth.server'
import { usersListQuerySchema } from '#app/lib/validations/user.validators'
import { listUsers } from '#app/services/user.service'

export async function GET(request: NextRequest) {
	try {
		// const user = await getCurrentUser(request)
		// requireAuth(user)

		// requireAdmin(user)

		const { searchParams } = new URL(request.url)
		const queryParams = {
			page: searchParams.get('page') ?? undefined,
			limit: searchParams.get('limit') ?? undefined,
			sort: searchParams.get('sort') ?? undefined,
		}

		const validatedQuery = usersListQuerySchema.parse(queryParams)

		const result = await listUsers({
			page: validatedQuery.page,
			limit: validatedQuery.limit,
			sort: validatedQuery.sort,
		})

		return NextResponse.json(result, { status: 200 })
	} catch (error) {
		if (error instanceof AuthenticationError) {
			return NextResponse.json(
				{
					error: 'Authentication required',
					message: error.message,
				},
				{ status: 401 },
			)
		}

		if (error instanceof AuthorizationError) {
			return NextResponse.json(
				{
					error: 'Insufficient permissions',
					message: error.message,
				},
				{ status: 403 },
			)
		}

		console.error('Error listing users:', error)
		return NextResponse.json(
			{
				error: 'Internal server error',
				message: 'An unexpected error occurred while processing your request',
			},
			{ status: 500 },
		)
	}
}
