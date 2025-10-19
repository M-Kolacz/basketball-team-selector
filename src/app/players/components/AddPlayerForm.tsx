'use client'

import { useState } from 'react'
import { POSITION_LABELS, SKILL_TIER_LABELS } from '#app/app/players/constants'
import {
	type AddPlayerFormData,
	type ValidationErrors,
} from '#app/app/players/types'
import { type Position, type SkillTier } from '#app/types/dto'

type AddPlayerFormProps = {
	onSubmit: (data: AddPlayerFormData) => Promise<void>
	isSubmitting?: boolean
	errors?: ValidationErrors
	successMessage?: string
	errorMessage?: string
}

export function AddPlayerForm({
	onSubmit,
	isSubmitting = false,
	errors,
	successMessage,
	errorMessage,
}: AddPlayerFormProps) {
	const [isExpanded, setIsExpanded] = useState(false)
	const [formData, setFormData] = useState<AddPlayerFormData>({
		name: '',
		skillTier: '',
		positions: [],
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		await onSubmit(formData)
	}

	const handlePositionToggle = (position: Position) => {
		setFormData((prev) => ({
			...prev,
			positions: prev.positions.includes(position)
				? prev.positions.filter((p) => p !== position)
				: [...prev.positions, position],
		}))
	}

	const handleReset = () => {
		setFormData({
			name: '',
			skillTier: '',
			positions: [],
		})
		setIsExpanded(false)
	}

	const positions: Position[] = ['PG', 'SG', 'SF', 'PF', 'C']
	const skillTiers: SkillTier[] = ['S', 'A', 'B', 'C', 'D']

	return (
		<div className="mb-6 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="flex w-full items-center justify-between rounded-t-lg px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50"
				aria-expanded={isExpanded}
			>
				<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
					Add New Player
				</h2>
				<svg
					className={`h-5 w-5 text-gray-500 transition-transform dark:text-gray-400 ${
						isExpanded ? 'rotate-180' : ''
					}`}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{isExpanded && (
				<form
					onSubmit={handleSubmit}
					className="border-t border-gray-200 px-6 pb-6 dark:border-gray-700"
				>
					<div className="mt-4 space-y-4">
						{successMessage && (
							<div className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
								{successMessage}
							</div>
						)}

						{errorMessage && (
							<div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
								{errorMessage}
							</div>
						)}

						<div>
							<label
								htmlFor="name"
								className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								Player Name <span className="text-red-500">*</span>
							</label>
							<input
								id="name"
								type="text"
								value={formData.name}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, name: e.target.value }))
								}
								disabled={isSubmitting}
								className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
								placeholder="Enter player name"
								aria-invalid={!!errors?.name}
								aria-describedby={errors?.name ? 'name-error' : undefined}
							/>
							{errors?.name && (
								<p
									id="name-error"
									className="mt-1 text-sm text-red-600 dark:text-red-400"
								>
									{errors.name.join(', ')}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="skillTier"
								className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								Skill Tier <span className="text-red-500">*</span>
							</label>
							<select
								id="skillTier"
								value={formData.skillTier}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										skillTier: e.target.value as SkillTier | '',
									}))
								}
								disabled={isSubmitting}
								className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
								aria-invalid={!!errors?.skillTier}
								aria-describedby={
									errors?.skillTier ? 'skillTier-error' : undefined
								}
							>
								<option value="">Select skill tier</option>
								{skillTiers.map((tier) => (
									<option key={tier} value={tier}>
										{SKILL_TIER_LABELS[tier]}
									</option>
								))}
							</select>
							{errors?.skillTier && (
								<p
									id="skillTier-error"
									className="mt-1 text-sm text-red-600 dark:text-red-400"
								>
									{errors.skillTier.join(', ')}
								</p>
							)}
						</div>

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

						<div className="flex justify-end gap-3 pt-4">
							<button
								type="button"
								onClick={handleReset}
								disabled={isSubmitting}
								className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{isSubmitting ? 'Adding...' : 'Add Player'}
							</button>
						</div>
					</div>
				</form>
			)}
		</div>
	)
}
