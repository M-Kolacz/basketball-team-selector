import { Skeleton } from '#app/components/ui/skeleton'

export default function GameDetailsLoading() {
	return (
		<main className="container mx-auto px-4 py-8">
			<div className="mx-auto max-w-7xl space-y-8">
				{/* Header */}
				<div className="space-y-4">
					<Skeleton className="h-10 w-20" />
					<div>
						<Skeleton className="h-9 w-64" />
						<Skeleton className="mt-2 h-5 w-96" />
					</div>
				</div>

				{/* Selected Teams */}
				<div className="space-y-4">
					<Skeleton className="h-8 w-40" />
					<div className="grid gap-6 md:grid-cols-2">
						<Skeleton className="h-[400px]" />
						<Skeleton className="h-[400px]" />
					</div>
				</div>

				{/* Game Scores */}
				<div className="space-y-4">
					<Skeleton className="h-8 w-40" />
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						<Skeleton className="h-[180px]" />
						<Skeleton className="h-[180px]" />
						<Skeleton className="h-[180px]" />
					</div>
				</div>

				{/* Propositions */}
				<div className="space-y-4">
					<Skeleton className="h-8 w-40" />
					<div className="grid gap-4">
						<Skeleton className="h-[250px]" />
						<Skeleton className="h-[250px]" />
						<Skeleton className="h-[250px]" />
					</div>
				</div>
			</div>
		</main>
	)
}
