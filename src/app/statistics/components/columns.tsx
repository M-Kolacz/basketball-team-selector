'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '#app/components/ui/button'
import { type PlayersStatisticts } from '#app/lib/actions/player-stats'

type PlayerStatistic = PlayersStatisticts[number]

export const columns = [
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					className="w-full"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Player Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const playerName = row.getValue('name') as string
			return <span className="block w-full text-left">{playerName}</span>
		},
	},
	{
		id: 'gameSessions',
		accessorKey: 'gameSessions',
		header: ({ column }) => {
			return (
				<Button
					className="w-full"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Number of the game sessions played
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const gameSessions = row.getValue('gameSessions') as string
			return <span className="block w-full text-right">{gameSessions}</span>
		},
	},
	{
		id: 'totalGames',
		accessorKey: 'totalGames',
		header: ({ column }) => {
			return (
				<Button
					className="w-full"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Total number of games played
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const totalGames = row.getValue('totalGames') as string
			return <span className="block w-full text-right">{totalGames}</span>
		},
	},
	{
		id: 'gamesWon',
		accessorKey: 'gamesWon',
		header: ({ column }) => {
			return (
				<Button
					className="w-full"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Total number of won games
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const gamesWon = row.getValue('gamesWon') as string
			return <span className="block w-full text-right">{gamesWon}</span>
		},
	},
	{
		id: 'gamesLost',
		accessorKey: 'gamesLost',
		header: ({ column }) => {
			return (
				<Button
					className="w-full"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Total number of lost games
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const gamesLost = row.getValue('gamesLost') as string
			return <span className="block w-full text-right">{gamesLost}</span>
		},
	},
	{
		id: 'winRatio',
		accessorKey: 'winRatio',
		header: ({ column }) => {
			return (
				<Button
					className="w-full"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Win ratio
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const ratio = row.getValue('winRatio') as number
			return (
				<span className="block w-full text-right">{ratio.toFixed(2)}%</span>
			)
		},
	},
] satisfies ColumnDef<PlayerStatistic>[]
