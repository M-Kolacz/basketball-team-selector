'use client'

import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '#app/components/ui/button'

type GameDetailsHeaderProps = {
	gameDatetime: Date
	description: string | null
}

export function GameDetailsHeader({
	gameDatetime,
	description,
}: GameDetailsHeaderProps) {
	const router = useRouter()

	return (
		<header className="space-y-4">
			<Button
				variant="ghost"
				size="sm"
				onClick={() => router.back()}
				className="gap-2"
			>
				<ArrowLeft className="h-4 w-4" />
				Back
			</Button>
			<div>
				<h1 className="text-3xl font-bold">
					{format(new Date(gameDatetime), 'PPP p')}
				</h1>
				{description && (
					<p className="mt-2 text-muted-foreground">{description}</p>
				)}
			</div>
		</header>
	)
}
