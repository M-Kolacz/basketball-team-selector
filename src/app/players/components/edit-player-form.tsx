'use client'

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Pencil } from 'lucide-react'
import { useActionState } from 'react'
import { Checkbox, Select } from '#app/components/form'
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
import { type Players, updatePlayer } from '#app/lib/actions/players'
import { type SkillTier, type Position } from '#app/lib/db.server'
import { UpdatePlayerSchema } from '#app/lib/validations/player'

type EditPlayerDialogProps = {
	player: Players[number] | null
}

const positions: Position[] = ['PG', 'SG', 'SF', 'PF', 'C']
const skillTiers: SkillTier[] = ['S', 'A', 'B', 'C', 'D']

export const EditPlayerDialog = ({ player }: EditPlayerDialogProps) => {
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
		onValidate: ({ formData }) =>
			parseWithZod(formData, { schema: UpdatePlayerSchema }),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={'ghost'}>
					<Pencil className="h-4 w-4" />
					Edit player
				</Button>
			</DialogTrigger>

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
							<FieldLabel htmlFor={fields.name.id}>Player name</FieldLabel>
							<Input
								{...getInputProps(fields.name, { type: 'text' })}
								disabled={isSubmitting}
							/>
							<FieldError errors={fields.name.errors} />
						</Field>

						<Field>
							<FieldLabel htmlFor={fields.skillTier.id}>Skill tier</FieldLabel>
							<Select
								id={fields.skillTier.id}
								name={fields.skillTier.name}
								defaultValue={fields.skillTier.defaultValue}
								placeholder="Select skill tier"
								items={skillTiers.map((tier) => ({
									name: tier,
									value: tier,
								}))}
							/>

							<FieldError errors={fields.skillTier.errors} />
						</Field>

						<Field role="group" aria-labelledby={fields.positions.id}>
							<FieldLabel id={fields.positions.id}>Positions</FieldLabel>
							{positions.map((position) => (
								<div key={position} className="flex items-center gap-2">
									<Checkbox
										id={`${fields.positions.id}-${position}`}
										name={fields.positions.name}
										value={position}
										defaultChecked={fields.positions.defaultOptions?.includes(
											position,
										)}
									/>
									<label htmlFor={`${fields.positions.id}-${position}`}>
										{position}
									</label>
								</div>
							))}
							<FieldError errors={fields.positions.errors} />
						</Field>

						<FieldError errors={form.errors} />
					</FieldGroup>

					<DialogFooter>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Updating...' : 'Update Player'}
						</Button>
						<Button type="reset" variant="outline" disabled={isSubmitting}>
							Cancel
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
