'use client'

import { useState } from 'react'
import { AddPlayerForm } from '#app/app/players/components/AddPlayerForm'
import { EditPlayerDialog } from '#app/app/players/components/EditPlayerDialog'
import { PlayersTable } from '#app/app/players/components/PlayersTable'
import { type Players } from '#app/lib/actions/players'

type PlayersListProps = {
	players: Players
	isAdmin: boolean
}

type Player = Players[number]

export const PlayersList = ({ players, isAdmin }: PlayersListProps) => {
	const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

	const handleEdit = (player: Player) => {
		setEditingPlayer(player)
		setIsEditDialogOpen(true)
	}

	const handleEditCancel = () => {
		setIsEditDialogOpen(false)
		setEditingPlayer(null)
	}

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

			<PlayersTable players={players} isAdmin={isAdmin} onEdit={handleEdit} />

			{isAdmin && (
				<EditPlayerDialog
					key={isEditDialogOpen ? 'open' : `closed`}
					isOpen={isEditDialogOpen}
					player={editingPlayer}
					onCancel={handleEditCancel}
				/>
			)}
		</div>
	)
}
