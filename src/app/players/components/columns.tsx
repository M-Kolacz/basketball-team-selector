'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { DeletePlayerForm } from '#app/app/players/components/delete-player-form'
import { EditPlayerDialog } from '#app/app/players/components/edit-player-form'
import {
	POSITION_LABELS,
	SKILL_TIER_COLORS,
	SKILL_TIER_LABELS,
} from '#app/app/players/constants'
import { Badge } from '#app/components/ui/badge'
import { Button } from '#app/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '#app/components/ui/dropdown-menu'
import { type Players } from '#app/lib/actions/players'
import { type Position, type SkillTier } from '#app/lib/db.server'

export const columns = [
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Player name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
	},
	{
		id: 'skillTier',
		accessorKey: 'skillTier',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Skill Tier
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},

		cell: ({ row }) => {
			const skillTier = row.getValue<SkillTier>('skillTier')
			return (
				<Badge variant="secondary" className={SKILL_TIER_COLORS[skillTier]}>
					{SKILL_TIER_LABELS[skillTier]}
				</Badge>
			)
		},
	},
	{
		accessorKey: 'positions',
		header: 'Positions',
		cell: ({ row }) => {
			const positions = row.getValue<Position[]>('positions')
			return (
				<div className="flex flex-wrap gap-1">
					{positions.map((pos) => (
						<Badge key={pos} variant="outline">
							{POSITION_LABELS[pos]}
						</Badge>
					))}
				</div>
			)
		},
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Created At
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const createdAt = row.getValue<Date>('createdAt')
			return (
				<div className="text-sm text-muted-foreground">
					{new Date(createdAt).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'short',
						day: 'numeric',
						hour: '2-digit',
						minute: '2-digit',
					})}
				</div>
			)
		},
	},
	{
		accessorKey: 'actions',
		id: 'Actions',
		header: 'Actions',
		cell: ({ row }) => {
			const player = row.original

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem asChild>
							<EditPlayerDialog player={player} />
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<DeletePlayerForm player={player} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
] satisfies ColumnDef<Players[number]>[]
