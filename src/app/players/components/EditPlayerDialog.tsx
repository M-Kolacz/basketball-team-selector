'use client'

import { useState, useEffect } from 'react'
import { POSITION_LABELS, SKILL_TIER_LABELS } from '#app/app/players/constants'
import {
	type EditPlayerFormData,
	type ValidationErrors,
} from '#app/app/players/types'
import { hasPlayerChanged } from '#app/app/players/utils'
import { Alert, AlertDescription } from '#app/components/ui/alert'
import { Button } from '#app/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '#app/components/ui/dialog'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '#app/components/ui/field'
import { Input } from '#app/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '#app/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '#app/components/ui/toggle-group'
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

const positions: Position[] = ['PG', 'SG', 'SF', 'PF', 'C']
const skillTiers: SkillTier[] = ['S', 'A', 'B', 'C', 'D']

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

	if (!player) return null

	const isDirty = hasPlayerChanged(player, formData)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		await onSubmit(player.id, formData)
	}

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Edit Player</DialogTitle>
					<DialogDescription>
						Update player information. Click save when you&apos;re done.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					{errorMessage && (
						<Alert variant="destructive">
							<AlertDescription>{errorMessage}</AlertDescription>
						</Alert>
					)}
					<FieldGroup>
						<Field>
							<FieldLabel>Player Name</FieldLabel>
							<Input
								value={formData.name}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, name: e.target.value }))
								}
								disabled={isSubmitting}
								placeholder="Enter player name"
								aria-invalid={!!errors?.name}
							/>
							<FieldError errors={errors?.name} />
						</Field>

						<Field>
							<FieldLabel>Skill Tier</FieldLabel>
							<Select
								value={formData.skillTier}
								onValueChange={(value) =>
									setFormData((prev) => ({
										...prev,
										skillTier: value as SkillTier,
									}))
								}
								disabled={isSubmitting}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{skillTiers.map((tier) => (
										<SelectItem key={tier} value={tier}>
											{SKILL_TIER_LABELS[tier]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FieldError errors={errors?.skillTier} />
						</Field>

						<Field>
							<FieldLabel>Positions</FieldLabel>
							<ToggleGroup
								type="multiple"
								value={formData.positions}
								onValueChange={(value) =>
									setFormData((prev) => ({
										...prev,
										positions: value as Position[],
									}))
								}
								disabled={isSubmitting}
								className="flex-wrap justify-start"
							>
								{positions.map((position) => (
									<ToggleGroupItem
										key={position}
										value={position}
										aria-label={POSITION_LABELS[position]}
									>
										{POSITION_LABELS[position]}
									</ToggleGroupItem>
								))}
							</ToggleGroup>
							<FieldError errors={errors?.positions} />
						</Field>
					</FieldGroup>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={onCancel}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting || !isDirty}>
							{isSubmitting ? 'Updating...' : 'Update Player'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
