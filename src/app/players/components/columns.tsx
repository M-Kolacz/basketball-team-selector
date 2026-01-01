'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { DeletePlayerForm } from '#app/app/players/components/delete-player-form'
import { EditPlayerDialog } from '#app/app/players/components/edit-player-form'
import {
	POSITION_LABELS,
	SKILL_TIER_COLORS,
	SKILL_TIER_LABELS,
} from '#app/app/players/helpers/constants'
import { Badge } from '#app/components/ui/badge'
import { Button } from '#app/components/ui/button'
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
				<div className="flex gap-4">
					<EditPlayerDialog player={player} />
					<DeletePlayerForm player={player} />
				</div>
			)
		},
	},
] satisfies ColumnDef<Players[number]>[]
