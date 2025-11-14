'use client'

import { AddPlayerForm } from '#app/app/players/components/add-player-form'
import { columns } from '#app/app/players/components/columns'
import { DataTable } from '#app/app/players/components/data-table'
import { type Players } from '#app/lib/actions/players'

type PlayersListProps = {
	players: Players
	isAdmin: boolean
}

export const PlayersList = ({ players, isAdmin }: PlayersListProps) => {
	const playerColumns = isAdmin
		? columns
		: columns.filter((column: (typeof columns)[number]) => {
				return ['name'].includes(column.accessorKey)
			})

	return (
		<div className="container mx-auto max-w-7xl px-4 py-8">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Players</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						{isAdmin
							? 'Manage your basketball team roster'
							: 'View basketball team roster'}
					</p>
				</div>
				{isAdmin && <AddPlayerForm />}
			</div>

			<DataTable columns={playerColumns} data={players} />
		</div>
	)
}
