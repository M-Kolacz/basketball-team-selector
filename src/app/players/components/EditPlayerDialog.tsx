'use client'

import {
	getCollectionProps,
	getFormProps,
	getInputProps,
	useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { useActionState } from 'react'
import { updatePlayer } from '#app/lib/actions/players'
import { SKILL_TIER_LABELS } from '#app/app/players/constants'
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
import { UpdatePlayerSchema } from '#app/lib/validations/player'
import {
	type PlayerAdminDto,
	type PlayerUserDto,
	type Position,
	type SkillTier,
} from '#app/types/dto'

type EditPlayerDialogProps = {
	isOpen: boolean
	player: PlayerAdminDto | null
	onCancel: () => void
}

const positions: Position[] = ['PG', 'SG', 'SF', 'PF', 'C']
const skillTiers: SkillTier[] = ['S', 'A', 'B', 'C', 'D']

export function EditPlayerDialog({
	isOpen,
	onCancel,
	player,
}: EditPlayerDialogProps) {
	console.log({ player })

	const [lastResult, formAction, isSubmitting] = useActionState(
		updatePlayer,
		undefined,
	)

	const [form, fields] = useForm({
		defaultValue: {
			id: player?.id ?? '',
			name: player?.name ?? '',
			skillTier: player?.skillTier ?? 'C',
			positions: player?.positions ?? [],
		},
		lastResult: lastResult?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: UpdatePlayerSchema })
		},
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Edit Player</DialogTitle>
					<DialogDescription>
						Update player information. Click save when you&apos;re done.
					</DialogDescription>
				</DialogHeader>

				<form action={formAction} {...getFormProps(form)}>
					<input {...getInputProps(fields.id, { type: 'hidden' })} />
					<FieldGroup>
						<Field>
							<FieldLabel>Player Name</FieldLabel>
							<Input
								{...getInputProps(fields.name, { type: 'text' })}
								disabled={isSubmitting}
							/>
							<FieldError errors={fields.name.errors} />
						</Field>

						<Field>
							<FieldLabel htmlFor={fields.skillTier.id}>Skill tier</FieldLabel>
							<select
								name={fields.skillTier.name}
								id={fields.skillTier.id}
								defaultValue="C"
								disabled={isSubmitting}
							>
								{skillTiers.map((tier) => (
									<option key={tier} value={tier}>
										{SKILL_TIER_LABELS[tier]}
									</option>
								))}
							</select>
							<FieldError errors={fields.skillTier.errors} />
						</Field>

						<Field orientation="horizontal">
							<FieldLabel>Positions</FieldLabel>
							{getCollectionProps(fields.positions, {
								type: 'checkbox',
								options: positions,
							}).map((position) => (
								<label key={position.id} htmlFor={position.id}>
									<input {...position} key={position.key} />
									<span>{position.value}</span>
								</label>
							))}
							<FieldError errors={fields.positions.errors} />
						</Field>

						<FieldError errors={form.errors} />
					</FieldGroup>

					<DialogFooter>
						<Button type="reset" variant="outline" disabled={isSubmitting}>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Updating...' : 'Update Player'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
