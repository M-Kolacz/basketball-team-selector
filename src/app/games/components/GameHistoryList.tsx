'use client'

import Link from 'next/link'
import { AddGameForm } from '#app/app/games/components/AddGameForm'
import { GameHistoryRow } from '#app/app/games/components/GameHistoryRow'
import { Button } from '#app/components/ui/button'
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
import { type Players } from '#app/lib/actions/players'
interface GameHistoryListProps {
	gameSessions: GameSessions
	isAdmin: boolean
	players: Players
}

export const GameHistoryList = ({
	gameSessions,
	isAdmin,
	players,
}: GameHistoryListProps) => {
	if (gameSessions.length === 0) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyTitle>No games found</EmptyTitle>
					<EmptyDescription>
						There are no game sessions recorded yet.
					</EmptyDescription>
				</EmptyHeader>
				{isAdmin && <AddGameForm players={players} />}
			</Empty>
		)
	}

	return (
		<div className="w-full">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Game History</h1>
					<p className="text-muted-foreground">
						View all past basketball game sessions
					</p>
				</div>
				{isAdmin && <AddGameForm players={players} />}
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
