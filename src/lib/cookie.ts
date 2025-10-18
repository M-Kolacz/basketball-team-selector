import { type JwtPayload } from 'jsonwebtoken'
import { setCookie } from '#app/lib/cookie.server'
import { generateToken } from '#app/lib/jwt.server'

export const saveCookie = async (
	cookieName: string,
	{ payload }: { payload: JwtPayload },
) => {
	const token = generateToken(payload)
	await setCookie(token, '7d')
}
