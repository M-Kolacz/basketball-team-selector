'use client'

import { GameHistoryRow } from '#app/app/games/components/GameHistoryRow'
import { type GameHistoryViewModel } from '#app/app/games/utils/transform'
import {
	Empty,
	EmptyHeader,
	EmptyTitle,
	EmptyDescription,
} from '#app/components/ui/empty'
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
} from '#app/components/ui/table'

interface GameHistoryListProps {
	games: GameHistoryViewModel[]
}

export function GameHistoryList({ games }: GameHistoryListProps) {
	if (games.length === 0) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyTitle>No games found</EmptyTitle>
					<EmptyDescription>
						There are no game sessions recorded yet.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		)
	}

	return (
		<div className="w-full">
			<div className="mb-6">
				<h1 className="text-3xl font-bold tracking-tight">Game History</h1>
				<p className="text-muted-foreground">
					View all past basketball game sessions
				</p>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Date</TableHead>
						<TableHead>Games Count</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{games.map((game) => (
						<GameHistoryRow key={game.id} game={game} />
					))}
				</TableBody>
			</Table>
		</div>
	)
}
