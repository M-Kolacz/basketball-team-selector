import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { RegistrationForm } from '#app/app/register/registration-form'
import { env } from '#app/lib/env.mjs'

export default async function RegisterPage() {
	const cookieStore = await cookies()

	const sessionCookie = cookieStore.get('bts-session')

	let isLoggedIn = false
	try {
		isLoggedIn = Boolean(jwt.verify(sessionCookie?.value || '', env.JWT_SECRET))
	} catch {
		isLoggedIn = false
	}

	if (isLoggedIn) redirect('/games')

	return <RegistrationForm />
}
