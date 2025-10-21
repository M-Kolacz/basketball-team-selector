import Link from 'next/link'
import { Button } from '#app/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'
import { FileQuestion } from 'lucide-react'

export default function GameDetailsNotFound() {
	return (
		<main className="container mx-auto px-4 py-8">
			<div className="mx-auto max-w-2xl">
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<FileQuestion className="h-5 w-5 text-muted-foreground" />
							<CardTitle>Game Session Not Found</CardTitle>
						</div>
						<CardDescription>
							The game session you're looking for doesn't exist or has been
							deleted.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button asChild>
							<Link href="/games">Back to Games</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</main>
	)
}
