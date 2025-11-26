'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ArrowUpDown, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { DeleteGameForm } from '#app/app/games/components/delete-game-form'
import { EditGameForm } from '#app/app/games/components/edit-game-form'
import { Button } from '#app/components/ui/button'
import { Spinner } from '#app/components/ui/spinner'
import { type GameSessions } from '#app/lib/actions/game-sessions'
import { type Players } from '#app/lib/actions/players'

type GameSession = GameSessions[number]

interface GameSessionColumnsProps {
	isAdmin: boolean
	players: Players
}

export const createGameSessionColumns = ({
	isAdmin,
	players,
}: GameSessionColumnsProps): ColumnDef<GameSession>[] => [
	{
		accessorKey: 'gameDatetime',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Game Date
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const gameId = row.original.id
			const date = row.getValue<string>('gameDatetime')
			const isOptimistic = gameId.startsWith('temp-')

			return (
				<div className="flex items-center gap-4">
					<span className={isOptimistic ? 'opacity-50' : ''}>
						{format(date, 'MMMM d, yyyy')}
					</span>
					{isOptimistic && <Spinner />}
				</div>
			)
		},
	},
	{
		id: 'gamesCount',
		accessorKey: 'gamesCount',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Number of games
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const count = row.getValue<number>('gamesCount')
			return <span>{count}</span>
		},
	},
	{
		accessorKey: 'actions',
		id: 'Actions',
		header: 'Actions',
		cell: ({ row }) => {
			const gameId = row.original.id
			const gameSession = row.original

			return (
				<div className="flex gap-4">
					<Button variant="ghost" size="sm" type="submit" asChild>
						<Link href={`/games/${gameId}`}>
							<ArrowUpRight className="h-4 w-4" />
							<span className="sr-only">Check game details</span>
						</Link>
					</Button>
					{isAdmin && (
						<EditGameForm gameSession={gameSession} allPlayers={players} />
					)}
					{isAdmin && <DeleteGameForm gameId={gameId} />}
				</div>
			)
		},
	},
]
