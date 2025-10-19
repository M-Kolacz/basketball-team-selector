'use client'

import { useState } from 'react'
import type { Position, SkillTier } from '#app/types/dto'
import type { AddPlayerFormData, ValidationErrors } from '../types'
import { POSITION_LABELS, SKILL_TIER_LABELS } from '../constants'

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
		setFormData(prev => ({
			...prev,
			positions: prev.positions.includes(position)
				? prev.positions.filter(p => p !== position)
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
		<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-6">
			{/* Collapsible Header */}
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-t-lg"
				aria-expanded={isExpanded}
			>
				<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
					Add New Player
				</h2>
				<svg
					className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
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

			{/* Form Content */}
			{isExpanded && (
				<form onSubmit={handleSubmit} className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
					<div className="mt-4 space-y-4">
						{/* Success Message */}
						{successMessage && (
							<div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-sm text-green-800 dark:text-green-200">
								{successMessage}
							</div>
						)}

						{/* Error Message */}
						{errorMessage && (
							<div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-800 dark:text-red-200">
								{errorMessage}
							</div>
						)}

						{/* Name Field */}
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Player Name <span className="text-red-500">*</span>
							</label>
							<input
								id="name"
								type="text"
								value={formData.name}
								onChange={e =>
									setFormData(prev => ({ ...prev, name: e.target.value }))
								}
								disabled={isSubmitting}
								className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
								placeholder="Enter player name"
								aria-invalid={!!errors?.name}
								aria-describedby={errors?.name ? 'name-error' : undefined}
							/>
							{errors?.name && (
								<p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.name.join(', ')}
								</p>
							)}
						</div>

						{/* Skill Tier Field */}
						<div>
							<label
								htmlFor="skillTier"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Skill Tier <span className="text-red-500">*</span>
							</label>
							<select
								id="skillTier"
								value={formData.skillTier}
								onChange={e =>
									setFormData(prev => ({
										...prev,
										skillTier: e.target.value as SkillTier | '',
									}))
								}
								disabled={isSubmitting}
								className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
								aria-invalid={!!errors?.skillTier}
								aria-describedby={errors?.skillTier ? 'skillTier-error' : undefined}
							>
								<option value="">Select skill tier</option>
								{skillTiers.map(tier => (
									<option key={tier} value={tier}>
										{SKILL_TIER_LABELS[tier]}
									</option>
								))}
							</select>
							{errors?.skillTier && (
								<p id="skillTier-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
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

						{/* Form Actions */}
						<div className="flex justify-end gap-3 pt-4">
							<button
								type="button"
								onClick={handleReset}
								disabled={isSubmitting}
								className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
