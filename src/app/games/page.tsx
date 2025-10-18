import { type Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Games - Basketball Team Selector',
	description: 'View and manage your basketball games',
}

export default function GamesPage() {
	return (
		<main className="flex min-h-screen items-center justify-center p-4">
			<h1>Games</h1>
		</main>
	)
}
