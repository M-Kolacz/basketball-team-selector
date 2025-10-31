import { RegistrationForm } from '#app/app/(auth)/register/registration-form'
import { requireAnonymous } from '#app/lib/auth.server'

export default async function RegisterPage() {
	await requireAnonymous()

	return <RegistrationForm />
}
