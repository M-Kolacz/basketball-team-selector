'use client'

import { useEffect } from 'react'
import { Button } from '#app/components/ui/button'
import {
	Empty,
	EmptyHeader,
	EmptyTitle,
	EmptyDescription,
	EmptyContent,
} from '#app/components/ui/empty'

export default function GamesError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		console.error('Games page error:', error)
	}, [error])

	return (
		<main className="container mx-auto px-4 py-8">
			<Empty>
				<EmptyHeader>
					<EmptyTitle>Failed to load games</EmptyTitle>
					<EmptyDescription>
						An error occurred while fetching game sessions. Please try again.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button onClick={reset}>Try again</Button>
				</EmptyContent>
			</Empty>
		</main>
	)
}
