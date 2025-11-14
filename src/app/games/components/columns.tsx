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
import { type GameSessions } from '#app/lib/actions/game-sessions'

type GameSession = GameSessions[number]

export const columns = [
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
			const date = row.getValue<string>('gameDatetime')
			return format(date, 'MMMM d, yyyy')
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
