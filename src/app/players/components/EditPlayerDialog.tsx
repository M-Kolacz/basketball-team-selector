'use client'

import { useState, useEffect } from 'react'
import { POSITION_LABELS, SKILL_TIER_LABELS } from '#app/app/players/constants'
import {
	type EditPlayerFormData,
	type ValidationErrors,
} from '#app/app/players/types'
import { hasPlayerChanged } from '#app/app/players/utils'
import {
	type PlayerAdminDto,
	type Position,
	type SkillTier,
} from '#app/types/dto'

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
		setFormData((prev) => ({
			...prev,
			positions: prev.positions.includes(position)
				? prev.positions.filter((p) => p !== position)
				: [...prev.positions, position],
		}))
	}

	const positions: Position[] = ['PG', 'SG', 'SF', 'PF', 'C']
	const skillTiers: SkillTier[] = ['S', 'A', 'B', 'C', 'D']

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div
				className="mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-gray-800"
				role="dialog"
				aria-labelledby="edit-dialog-title"
			>
				<div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
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
							<div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
								{errorMessage}
							</div>
						)}

						{/* Name Field */}
						<div>
							<label
								htmlFor="edit-name"
								className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								Player Name <span className="text-red-500">*</span>
							</label>
							<input
								id="edit-name"
								type="text"
								value={formData.name}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, name: e.target.value }))
								}
								disabled={isSubmitting}
								className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
								placeholder="Enter player name"
								aria-invalid={!!errors?.name}
								aria-describedby={errors?.name ? 'edit-name-error' : undefined}
							/>
							{errors?.name && (
								<p
									id="edit-name-error"
									className="mt-1 text-sm text-red-600 dark:text-red-400"
								>
									{errors.name.join(', ')}
								</p>
							)}
						</div>

						{/* Skill Tier Field */}
						<div>
							<label
								htmlFor="edit-skillTier"
								className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								Skill Tier <span className="text-red-500">*</span>
							</label>
							<select
								id="edit-skillTier"
								value={formData.skillTier}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										skillTier: e.target.value as SkillTier,
									}))
								}
								disabled={isSubmitting}
								className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
								aria-invalid={!!errors?.skillTier}
								aria-describedby={
									errors?.skillTier ? 'edit-skillTier-error' : undefined
								}
							>
								{skillTiers.map((tier) => (
									<option key={tier} value={tier}>
										{SKILL_TIER_LABELS[tier]}
									</option>
								))}
							</select>
							{errors?.skillTier && (
								<p
									id="edit-skillTier-error"
									className="mt-1 text-sm text-red-600 dark:text-red-400"
								>
									{errors.skillTier.join(', ')}
								</p>
							)}
						</div>

						{/* Positions Field */}
						<div>
							<label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
								Positions <span className="text-red-500">*</span>
							</label>
							<div className="flex flex-wrap gap-2">
								{positions.map((position) => (
									<button
										key={position}
										type="button"
										onClick={() => handlePositionToggle(position)}
										disabled={isSubmitting}
										className={`rounded border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
											formData.positions.includes(position)
												? 'border-blue-600 bg-blue-600 text-white'
												: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
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
					<div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
						<button
							type="button"
							onClick={onCancel}
							disabled={isSubmitting}
							className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting || !isDirty}
							className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isSubmitting ? 'Updating...' : 'Update Player'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
