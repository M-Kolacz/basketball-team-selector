'use client'

import { useState } from 'react'
import { AddPlayerForm } from '#app/app/players/components/AddPlayerForm'
import { EditPlayerDialog } from '#app/app/players/components/EditPlayerDialog'
import { PlayersTable } from '#app/app/players/components/PlayersTable'
import { type PlayerAdminDto, type PlayerUserDto } from '#app/types/dto'

type PlayersListProps = {
	players: PlayerAdminDto[] | PlayerUserDto[]
	isAdmin: boolean
}

export function PlayersList({ players, isAdmin }: PlayersListProps) {
	const [editingPlayer, setEditingPlayer] = useState<PlayerAdminDto | null>(
		null,
	)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

	const handleEdit = (player: PlayerAdminDto) => {
		setEditingPlayer(player)
		setIsEditDialogOpen(true)
	}

	const handleEditCancel = () => {
		setIsEditDialogOpen(false)
		setEditingPlayer(null)
	}

	return (
		<div className="container mx-auto max-w-7xl px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Players</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					{isAdmin
						? 'Manage your basketball team roster'
						: 'View basketball team roster'}
				</p>
			</div>

			{isAdmin && <AddPlayerForm />}

			<PlayersTable players={players} isAdmin={isAdmin} onEdit={handleEdit} />

			{isAdmin && (
				<EditPlayerDialog
					isOpen={isEditDialogOpen}
					player={editingPlayer}
					onCancel={handleEditCancel}
				/>
			)}
		</div>
	)
}
