'use client'

import { useState, useMemo } from 'react'
import type { PlayerAdminDto, PlayerUserDto } from '#app/types/dto'
import type {
	FilterState,
	SortOption,
	BulkAction,
	AddPlayerFormData,
	EditPlayerFormData,
	ValidationErrors,
} from '../types'
import { filterAndSortPlayers, validatePlayerForm } from '../utils'
import { AddPlayerForm } from './AddPlayerForm'
import { PlayersTable } from './PlayersTable'
import { EditPlayerDialog } from './EditPlayerDialog'
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog'
import { BulkActionBar } from './BulkActionBar'

type PlayersListProps = {
	initialPlayers: PlayerAdminDto[] | PlayerUserDto[]
	isAdmin: boolean
}

export function PlayersList({ initialPlayers, isAdmin }: PlayersListProps) {
	// State
	const [players, setPlayers] = useState(initialPlayers)
	const [filterState, setFilterState] = useState<FilterState>({
		searchQuery: '',
		skillTier: undefined,
		position: undefined,
	})
	const [sortBy, setSortBy] = useState<SortOption>('name')
	const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<string>>(
		new Set()
	)

	// Edit dialog state
	const [editingPlayer, setEditingPlayer] = useState<PlayerAdminDto | null>(
		null
	)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [editErrors, setEditErrors] = useState<ValidationErrors>()
	const [editErrorMessage, setEditErrorMessage] = useState<string>()
	const [isEditSubmitting, setIsEditSubmitting] = useState(false)

	// Delete dialog state
	const [deletingPlayerId, setDeletingPlayerId] = useState<string | null>(null)
	const [deletingPlayerName, setDeletingPlayerName] = useState<string>()
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [isBulkDelete, setIsBulkDelete] = useState(false)

	// Add form state
	const [addFormErrors, setAddFormErrors] = useState<ValidationErrors>()
	const [addFormSuccessMessage, setAddFormSuccessMessage] = useState<string>()
	const [addFormErrorMessage, setAddFormErrorMessage] = useState<string>()
	const [isAddSubmitting, setIsAddSubmitting] = useState(false)

	// Computed values
	const filteredPlayers = useMemo(
		() => filterAndSortPlayers(players, filterState, sortBy, isAdmin),
		[players, filterState, sortBy, isAdmin]
	)

	const isAllSelected =
		selectedPlayerIds.size > 0 &&
		selectedPlayerIds.size === filteredPlayers.length

	const existingPlayerNames = useMemo(
		() => players.map(p => p.name),
		[players]
	)

	// Event handlers
	const handleFilterChange = (newFilterState: FilterState) => {
		setFilterState(newFilterState)
	}

	const handleSortChange = (newSortBy: SortOption) => {
		setSortBy(newSortBy)
	}

	const handlePlayerSelect = (playerId: string, selected: boolean) => {
		setSelectedPlayerIds(prev => {
			const newSet = new Set(prev)
			if (selected) {
				newSet.add(playerId)
			} else {
				newSet.delete(playerId)
			}
			return newSet
		})
	}

	const handleSelectAll = (selected: boolean) => {
		if (selected) {
			setSelectedPlayerIds(new Set(filteredPlayers.map(p => p.id)))
		} else {
			setSelectedPlayerIds(new Set())
		}
	}

	const handleClearSelection = () => {
		setSelectedPlayerIds(new Set())
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
		data: EditPlayerFormData
	) => {
		setIsEditSubmitting(true)
		setEditErrors(undefined)
		setEditErrorMessage(undefined)

		// Client-side validation
		const otherPlayerNames = existingPlayerNames.filter(
			name => name !== editingPlayer?.name
		)
		const errors = validatePlayerForm(
			data.name,
			data.skillTier,
			data.positions,
			otherPlayerNames
		)

		if (Object.keys(errors).length > 0) {
			setEditErrors(errors)
			setIsEditSubmitting(false)
			return
		}

		try {
			// TODO: Call server action updatePlayer(playerId, data)
			// For now, simulate success with local update
			await new Promise(resolve => setTimeout(resolve, 500))

			// Update local state
			setPlayers(prev =>
				prev.map(p =>
					p.id === playerId
						? { ...p, ...data, updatedAt: new Date().toISOString() }
						: p
				)
			)

			setIsEditDialogOpen(false)
			setEditingPlayer(null)
		} catch (error) {
			setEditErrorMessage(
				error instanceof Error ? error.message : 'Failed to update player'
			)
		} finally {
			setIsEditSubmitting(false)
		}
	}

	const handleDelete = (playerId: string) => {
		const player = players.find(p => p.id === playerId)
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
				// TODO: Call server action deleteMultiplePlayers(Array.from(selectedPlayerIds))
				await new Promise(resolve => setTimeout(resolve, 500))

				// Update local state
				setPlayers(prev => prev.filter(p => !selectedPlayerIds.has(p.id)))
				setSelectedPlayerIds(new Set())
			} else if (deletingPlayerId) {
				// TODO: Call server action deletePlayer(deletingPlayerId)
				await new Promise(resolve => setTimeout(resolve, 500))

				// Update local state
				setPlayers(prev => prev.filter(p => p.id !== deletingPlayerId))

				// Remove from selection if selected
				setSelectedPlayerIds(prev => {
					const newSet = new Set(prev)
					newSet.delete(deletingPlayerId)
					return newSet
				})
			}

			setIsDeleteDialogOpen(false)
			setDeletingPlayerId(null)
			setDeletingPlayerName(undefined)
			setIsBulkDelete(false)
		} catch (error) {
			// TODO: Show error toast
			console.error('Delete failed:', error)
		} finally {
			setIsDeleting(false)
		}
	}

	const handleBulkAction = (action: BulkAction) => {
		if (action === 'delete_selected') {
			setIsBulkDelete(true)
			setDeletingPlayerName(undefined)
			setIsDeleteDialogOpen(true)
		}
	}

	const handleAddPlayer = async (data: AddPlayerFormData) => {
		setIsAddSubmitting(true)
		setAddFormErrors(undefined)
		setAddFormSuccessMessage(undefined)
		setAddFormErrorMessage(undefined)

		// Client-side validation
		const errors = validatePlayerForm(
			data.name,
			data.skillTier,
			data.positions,
			existingPlayerNames
		)

		if (Object.keys(errors).length > 0) {
			setAddFormErrors(errors)
			setIsAddSubmitting(false)
			return
		}

		try {
			// TODO: Call server action createPlayer(data)
			// For now, simulate success with local update
			await new Promise(resolve => setTimeout(resolve, 500))

			const newPlayer: PlayerAdminDto = {
				id: `temp-${Date.now()}`,
				name: data.name,
				skillTier: data.skillTier as any,
				positions: data.positions,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			}

			setPlayers(prev => [newPlayer, ...prev])
			setAddFormSuccessMessage('Player added successfully!')

			// Clear success message after 3 seconds
			setTimeout(() => setAddFormSuccessMessage(undefined), 3000)
		} catch (error) {
			setAddFormErrorMessage(
				error instanceof Error ? error.message : 'Failed to add player'
			)
		} finally {
			setIsAddSubmitting(false)
		}
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-7xl">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
					Players
				</h1>
				<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
					{isAdmin
						? 'Manage your basketball team roster'
						: 'View basketball team roster'}
				</p>
			</div>

			{/* Add Player Form (Admin only) */}
			{isAdmin && (
				<AddPlayerForm
					onSubmit={handleAddPlayer}
					isSubmitting={isAddSubmitting}
					errors={addFormErrors}
					successMessage={addFormSuccessMessage}
					errorMessage={addFormErrorMessage}
				/>
			)}

			{/* Bulk Action Bar (Admin only) */}
			{isAdmin && (
				<BulkActionBar
					selectedCount={selectedPlayerIds.size}
					isAllSelected={isAllSelected}
					onSelectAll={handleSelectAll}
					onBulkAction={handleBulkAction}
					onClearSelection={handleClearSelection}
				/>
			)}

			{/* Players Table */}
			<PlayersTable
				players={filteredPlayers}
				isAdmin={isAdmin}
				filterState={filterState}
				sortBy={sortBy}
				selectedPlayerIds={selectedPlayerIds}
				onFilterChange={handleFilterChange}
				onSortChange={handleSortChange}
				onPlayerSelect={handlePlayerSelect}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>

			{/* Edit Player Dialog (Admin only) */}
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

			{/* Delete Confirmation Dialog (Admin only) */}
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
		</div>
	)
}
