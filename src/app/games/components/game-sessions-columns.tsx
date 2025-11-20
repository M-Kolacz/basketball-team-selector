'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ArrowUpDown, MoreHorizontal, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '#app/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '#app/components/ui/dropdown-menu'
import { Spinner } from '#app/components/ui/spinner'
import { type GameSessions } from '#app/lib/actions/game-sessions'

type GameSession = GameSessions[number]

export const gameSessionColumns = [
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

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open game history actions</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem asChild>
							<Link href={`/games/${gameId}`}>
								<ArrowUpRight className="h-4 w-4" />
								Check game details
							</Link>
						</DropdownMenuItem>
						{/* TODO: Add delete functionality */}
						{/* <DropdownMenuSeparator />
						<DropdownMenuItem>Delete game session</DropdownMenuItem> */}
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
] satisfies ColumnDef<GameSession>[]
