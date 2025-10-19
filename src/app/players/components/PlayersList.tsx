'use client'

import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { AddPlayerForm } from '#app/app/players/components/AddPlayerForm'
import { DeleteConfirmationDialog } from '#app/app/players/components/DeleteConfirmationDialog'
import { EditPlayerDialog } from '#app/app/players/components/EditPlayerDialog'
import { PlayersTable } from '#app/app/players/components/PlayersTable'
import {
	type FilterState,
	type SortOption,
	type EditPlayerFormData,
	type ValidationErrors,
} from '#app/app/players/types'
import {
	filterAndSortPlayers,
	validatePlayerForm,
} from '#app/app/players/utils'
import { Toaster } from '#app/components/ui/sonner'
import { type PlayerAdminDto, type PlayerUserDto } from '#app/types/dto'

type PlayersListProps = {
	players: PlayerAdminDto[] | PlayerUserDto[]
	isAdmin: boolean
}

export function PlayersList({
	players: initialPlayers,
	isAdmin,
}: PlayersListProps) {
	const [players, setPlayers] = useState(initialPlayers)
	const [filterState, setFilterState] = useState<FilterState>({
		searchQuery: '',
		skillTier: undefined,
		position: undefined,
	})
	const [sortBy, setSortBy] = useState<SortOption>('name')
	const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<string>>(
		new Set(),
	)

	const [editingPlayer, setEditingPlayer] = useState<PlayerAdminDto | null>(
		null,
	)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [editErrors, setEditErrors] = useState<ValidationErrors>()
	const [editErrorMessage, setEditErrorMessage] = useState<string>()
	const [isEditSubmitting, setIsEditSubmitting] = useState(false)

	const [deletingPlayerId, setDeletingPlayerId] = useState<string | null>(null)
	const [deletingPlayerName, setDeletingPlayerName] = useState<string>()
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [isBulkDelete, setIsBulkDelete] = useState(false)

	const filteredPlayers = useMemo(
		() => filterAndSortPlayers(players, filterState, sortBy, isAdmin),
		[players, filterState, sortBy, isAdmin],
	)

	const existingPlayerNames = useMemo(
		() => players.map((p) => p.name),
		[players],
	)

	const handlePlayerSelect = (playerId: string, selected: boolean) => {
		setSelectedPlayerIds((prev) => {
			const newSet = new Set(prev)
			if (selected) {
				newSet.add(playerId)
			} else {
				newSet.delete(playerId)
			}
			return newSet
		})
	}

	const handleEdit = (player: PlayerAdminDto) => {
		setEditingPlayer(player)
		setIsEditDialogOpen(true)
		setEditErrors(undefined)
		setEditErrorMessage(undefined)
	}

	const handleEditCancel = () => {
		setIsEditDialogOpen(false)
		setEditingPlayer(null)
		setEditErrors(undefined)
		setEditErrorMessage(undefined)
	}

	const handleEditSubmit = async (
		playerId: string,
		data: EditPlayerFormData,
	) => {
		setIsEditSubmitting(true)
		setEditErrors(undefined)
		setEditErrorMessage(undefined)

		const otherPlayerNames = existingPlayerNames.filter(
			(name) => name !== editingPlayer?.name,
		)
		const errors = validatePlayerForm(
			data.name,
			data.skillTier,
			data.positions,
			otherPlayerNames,
		)

		if (Object.keys(errors).length > 0) {
			setEditErrors(errors)
			setIsEditSubmitting(false)
			return
		}

		try {
			await new Promise((resolve) => setTimeout(resolve, 500))

			setPlayers((prev) =>
				prev.map((p) =>
					p.id === playerId
						? { ...p, ...data, updatedAt: new Date().toISOString() }
						: p,
				),
			)

			setIsEditDialogOpen(false)
			setEditingPlayer(null)
			toast.success('Player updated successfully')
		} catch (error) {
			const errorMsg =
				error instanceof Error ? error.message : 'Failed to update player'
			setEditErrorMessage(errorMsg)
			toast.error(errorMsg)
		} finally {
			setIsEditSubmitting(false)
		}
	}

	const handleDelete = (playerId: string) => {
		const player = players.find((p) => p.id === playerId)
		setDeletingPlayerId(playerId)
		setDeletingPlayerName(player?.name)
		setIsBulkDelete(false)
		setIsDeleteDialogOpen(true)
	}

	const handleDeleteCancel = () => {
		setIsDeleteDialogOpen(false)
		setDeletingPlayerId(null)
		setDeletingPlayerName(undefined)
		setIsBulkDelete(false)
	}

	const handleDeleteConfirm = async () => {
		setIsDeleting(true)

		try {
			if (isBulkDelete) {
				await new Promise((resolve) => setTimeout(resolve, 500))

				const count = selectedPlayerIds.size
				setPlayers((prev) => prev.filter((p) => !selectedPlayerIds.has(p.id)))
				setSelectedPlayerIds(new Set())
				toast.success(
					`${count} ${count === 1 ? 'player' : 'players'} deleted successfully`,
				)
			} else if (deletingPlayerId) {
				await new Promise((resolve) => setTimeout(resolve, 500))

				setPlayers((prev) => prev.filter((p) => p.id !== deletingPlayerId))

				setSelectedPlayerIds((prev) => {
					const newSet = new Set(prev)
					newSet.delete(deletingPlayerId)
					return newSet
				})
				toast.success('Player deleted successfully')
			}

			setIsDeleteDialogOpen(false)
			setDeletingPlayerId(null)
			setDeletingPlayerName(undefined)
			setIsBulkDelete(false)
		} catch (error) {
			const errorMsg =
				error instanceof Error ? error.message : 'Failed to delete player'
			toast.error(errorMsg)
			console.error('Delete failed:', error)
		} finally {
			setIsDeleting(false)
		}
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

			<PlayersTable
				players={filteredPlayers}
				isAdmin={isAdmin}
				selectedPlayerIds={selectedPlayerIds}
				onPlayerSelect={handlePlayerSelect}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>

			{isAdmin && (
				<EditPlayerDialog
					isOpen={isEditDialogOpen}
					player={editingPlayer}
					onSubmit={handleEditSubmit}
					onCancel={handleEditCancel}
					isSubmitting={isEditSubmitting}
					errors={editErrors}
					errorMessage={editErrorMessage}
				/>
			)}

			{isAdmin && (
				<DeleteConfirmationDialog
					isOpen={isDeleteDialogOpen}
					playerName={deletingPlayerName}
					isBulkDelete={isBulkDelete}
					deleteCount={selectedPlayerIds.size}
					isDeleting={isDeleting}
					onConfirm={handleDeleteConfirm}
					onCancel={handleDeleteCancel}
				/>
			)}

			<Toaster />
		</div>
	)
}
