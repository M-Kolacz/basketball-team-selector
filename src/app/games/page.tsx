import { type Metadata } from 'next'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
	title: 'Games - Basketball Team Selector',
	description: 'View and manage your basketball games',
}

export default async function GamesPage() {
	const cookieStore = await cookies()

	console.log(cookieStore.getAll())

	return (
		<main className="flex min-h-screen items-center justify-center p-4">
			<h1>Games</h1>
		</main>
	)
}
