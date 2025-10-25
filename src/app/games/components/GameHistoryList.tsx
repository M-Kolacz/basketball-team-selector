'use client'

import { GameHistoryRow } from '#app/app/games/components/GameHistoryRow'
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
import { type GameSessions } from '#app/lib/actions/game-sessions'

interface GameHistoryListProps {
	gameSessions: GameSessions
}

export function GameHistoryList({ gameSessions }: GameHistoryListProps) {
	if (gameSessions.length === 0) {
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
					{gameSessions.map((gameSession) => (
						<GameHistoryRow key={gameSession.id} gameSession={gameSession} />
					))}
				</TableBody>
			</Table>
		</div>
	)
}
