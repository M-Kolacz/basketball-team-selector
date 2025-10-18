import { cookies } from 'next/headers'
import { env } from '#app/lib/env.mjs'

const AUTH_COOKIE_NAME = 'auth-token'

interface CookieOptions {
	httpOnly: boolean
	secure: boolean
	sameSite: 'lax' | 'strict' | 'none'
	maxAge: number
	path: string
}

function getCookieOptions(maxAge: number): CookieOptions {
	const isProduction = env.NODE_ENV === 'production'

	return {
		httpOnly: true,
		secure: isProduction,
		sameSite: 'lax',
		maxAge,
		path: '/',
	}
}

export async function setCookie(
	token: string,
	expiresIn: string = '7d',
): Promise<void> {
	const maxAge = parseExpirationToSeconds(expiresIn)

	const cookieStore = await cookies()
	cookieStore.set(AUTH_COOKIE_NAME, token, getCookieOptions(maxAge))
}

export async function clearAuthCookie(): Promise<void> {
	try {
		const cookieStore = await cookies()
		cookieStore.set(AUTH_COOKIE_NAME, '', {
			...getCookieOptions(0),
			maxAge: 0,
		})
	} catch (error) {
		throw new Error(
			`Failed to clear authentication cookie: ${error instanceof Error ? error.message : 'Unknown error'}`,
		)
	}
}

export async function getAuthCookie(): Promise<string | null> {
	try {
		const cookieStore = await cookies()
		const cookie = cookieStore.get(AUTH_COOKIE_NAME)
		return cookie?.value || null
	} catch (error) {
		throw new Error(
			`Failed to retrieve authentication cookie: ${error instanceof Error ? error.message : 'Unknown error'}`,
		)
	}
}

function parseExpirationToSeconds(expiresIn: string): number {
	const match = expiresIn.match(/^(\d+)([dhms])$/)

	if (!match) {
		return 7 * 24 * 60 * 60
	}

	const [, value, unit] = match
	const numValue = parseInt(value!, 10)

	switch (unit) {
		case 'd':
			return numValue * 24 * 60 * 60
		case 'h':
			return numValue * 60 * 60
		case 'm':
			return numValue * 60
		case 's':
			return numValue
		default:
			return 7 * 24 * 60 * 60
	}
}
