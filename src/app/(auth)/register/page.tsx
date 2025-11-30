import { RegistrationForm } from '#app/app/(auth)/register/components/registration-form'
import { requireAnonymous } from '#app/lib/auth.server'

export default async function RegisterPage() {
	await requireAnonymous()

	return (
		<main>
			<RegistrationForm />
		</main>
	)
}
