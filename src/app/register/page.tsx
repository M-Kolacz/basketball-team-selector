import { cookies } from 'next/headers'
import { RegistrationForm } from '#app/app/register/registration-form'

export default async function RegisterPage() {
	const cookieStore = await cookies()

	console.log(cookieStore.getAll())

	return <RegistrationForm />
}
