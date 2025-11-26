'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ArrowUpDown, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { DeleteGameForm } from '#app/app/games/components/delete-game-form'
import { EditGameForm } from '#app/app/games/components/edit-game-form'
import { useGamesContext } from '#app/app/games/games-context'
import { Button } from '#app/components/ui/button'
import { Spinner } from '#app/components/ui/spinner'
import { type GameSessions } from '#app/lib/actions/game-sessions'

type GameSession = GameSessions[number]

export const gameSessionColumns: ColumnDef<GameSession>[] = [
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
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const { isAdmin, players } = useGamesContext()
			const gameId = row.original.id
			const gameSession = row.original
			const isOptimistic = gameId.startsWith('temp-')

			return (
				<div className="flex gap-4">
					<Link href={isOptimistic ? '' : `/games/${gameId}`}>
						<Button
							variant="ghost"
							size="sm"
							type="submit"
							disabled={isOptimistic}
						>
							<ArrowUpRight className="h-4 w-4" />
							<span className="sr-only">Check game details</span>
						</Button>
					</Link>
					{isAdmin && (
						<EditGameForm
							isOptimistic={isOptimistic}
							gameSession={gameSession}
							allPlayers={players}
						/>
					)}
					{isAdmin && (
						<DeleteGameForm isOptimistic={isOptimistic} gameId={gameId} />
					)}
				</div>
			)
		},
	},
]
