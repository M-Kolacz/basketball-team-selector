import { type Metadata } from 'next'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
	title: 'Login - Basketball Team Selector',
	description: 'Login to the Basketball Team Selector application',
}

export default function LoginPage() {
	return (
		<main className="flex min-h-screen items-center justify-center p-4">
			<LoginForm />
		</main>
	)
}
