import { type Metadata } from 'next'
import { LoginForm } from '#app/app/(auth)/login/components/login-form'
import { requireAnonymous } from '#app/lib/auth.server'

export const metadata: Metadata = {
	title: 'Login - Basketball Team Selector',
	description: 'Login to the Basketball Team Selector application',
}

export default async function LoginPage() {
	await requireAnonymous()

	return (
		<main className="flex min-h-screen items-center justify-center p-4">
			<LoginForm />
		</main>
	)
}
