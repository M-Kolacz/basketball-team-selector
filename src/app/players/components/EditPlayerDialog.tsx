'use client'

import { useState, useEffect } from 'react'
import type { PlayerAdminDto, Position, SkillTier } from '#app/types/dto'
import type { EditPlayerFormData, ValidationErrors } from '../types'
import { POSITION_LABELS, SKILL_TIER_LABELS } from '../constants'
import { hasPlayerChanged } from '../utils'

type EditPlayerDialogProps = {
	isOpen: boolean
	player: PlayerAdminDto | null
	onSubmit: (playerId: string, data: EditPlayerFormData) => Promise<void>
	onCancel: () => void
	isSubmitting?: boolean
	errors?: ValidationErrors
	errorMessage?: string
}

export function EditPlayerDialog({
	isOpen,
	player,
	onSubmit,
	onCancel,
	isSubmitting = false,
	errors,
	errorMessage,
}: EditPlayerDialogProps) {
	const [formData, setFormData] = useState<EditPlayerFormData>({
		name: '',
		skillTier: 'C',
		positions: [],
	})

	// Populate form when player changes
	useEffect(() => {
		if (player) {
			setFormData({
				name: player.name,
				skillTier: player.skillTier,
				positions: [...player.positions],
			})
		}
	}, [player])

	if (!isOpen || !player) return null

	const isDirty = hasPlayerChanged(player, formData)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		await onSubmit(player.id, formData)
	}

	const handlePositionToggle = (position: Position) => {
		setFormData(prev => ({
			...prev,
			positions: prev.positions.includes(position)
				? prev.positions.filter(p => p !== position)
				: [...prev.positions, position],
		}))
	}

	const positions: Position[] = ['PG', 'SG', 'SF', 'PF', 'C']
	const skillTiers: SkillTier[] = ['S', 'A', 'B', 'C', 'D']

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div
				className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
				role="dialog"
				aria-labelledby="edit-dialog-title"
			>
				{/* Header */}
				<div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
					<h2
						id="edit-dialog-title"
						className="text-lg font-semibold text-gray-900 dark:text-gray-100"
					>
						Edit Player
					</h2>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="px-6 py-4">
					<div className="space-y-4">
						{/* Error Message */}
						{errorMessage && (
							<div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-800 dark:text-red-200">
								{errorMessage}
							</div>
						)}

						{/* Name Field */}
						<div>
							<label
								htmlFor="edit-name"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Player Name <span className="text-red-500">*</span>
							</label>
							<input
								id="edit-name"
								type="text"
								value={formData.name}
								onChange={e =>
									setFormData(prev => ({ ...prev, name: e.target.value }))
								}
								disabled={isSubmitting}
								className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
								placeholder="Enter player name"
								aria-invalid={!!errors?.name}
								aria-describedby={errors?.name ? 'edit-name-error' : undefined}
							/>
							{errors?.name && (
								<p id="edit-name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.name.join(', ')}
								</p>
							)}
						</div>

						{/* Skill Tier Field */}
						<div>
							<label
								htmlFor="edit-skillTier"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Skill Tier <span className="text-red-500">*</span>
							</label>
							<select
								id="edit-skillTier"
								value={formData.skillTier}
								onChange={e =>
									setFormData(prev => ({
										...prev,
										skillTier: e.target.value as SkillTier,
									}))
								}
								disabled={isSubmitting}
								className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
								aria-invalid={!!errors?.skillTier}
								aria-describedby={errors?.skillTier ? 'edit-skillTier-error' : undefined}
							>
								{skillTiers.map(tier => (
									<option key={tier} value={tier}>
										{SKILL_TIER_LABELS[tier]}
									</option>
								))}
							</select>
							{errors?.skillTier && (
								<p id="edit-skillTier-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.skillTier.join(', ')}
								</p>
							)}
						</div>

						{/* Positions Field */}
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Positions <span className="text-red-500">*</span>
							</label>
							<div className="flex flex-wrap gap-2">
								{positions.map(position => (
									<button
										key={position}
										type="button"
										onClick={() => handlePositionToggle(position)}
										disabled={isSubmitting}
										className={`px-3 py-1.5 text-sm font-medium rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
											formData.positions.includes(position)
												? 'bg-blue-600 text-white border-blue-600'
												: 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
										}`}
										aria-pressed={formData.positions.includes(position)}
									>
										{POSITION_LABELS[position]}
									</button>
								))}
							</div>
							{errors?.positions && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.positions.join(', ')}
								</p>
							)}
						</div>
					</div>

					{/* Actions */}
					<div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
						<button
							type="button"
							onClick={onCancel}
							disabled={isSubmitting}
							className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting || !isDirty}
							className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? 'Updating...' : 'Update Player'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
