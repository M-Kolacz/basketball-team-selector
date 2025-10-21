'use client'

import { AlertCircle } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '#app/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'

export default function GameDetailsError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		console.error('Game details error:', error)
	}, [error])

	return (
		<main className="container mx-auto px-4 py-8">
			<div className="mx-auto max-w-2xl">
				<Card className="border-destructive">
					<CardHeader>
						<div className="flex items-center gap-2">
							<AlertCircle className="h-5 w-5 text-destructive" />
							<CardTitle>Error Loading Game Details</CardTitle>
						</div>
						<CardDescription>
							Something went wrong while loading the game session details.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-sm text-muted-foreground">
							{error.message || 'An unexpected error occurred'}
						</p>
						<div className="flex gap-2">
							<Button onClick={reset}>Try Again</Button>
							<Button
								variant="outline"
								onClick={() => (window.location.href = '/games')}
							>
								Back to Games
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</main>
	)
}
