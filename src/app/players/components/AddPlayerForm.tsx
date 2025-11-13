'use client'

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { useActionState } from 'react'
import { Checkbox, Select } from '#app/components/form'
import { Button } from '#app/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '#app/components/ui/dialog'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '#app/components/ui/field'
import { Input } from '#app/components/ui/input'
import { createPlayer } from '#app/lib/actions/players'
import { type Position, type SkillTier } from '#app/lib/db.server'
import { CreatePlayerSchema } from '#app/lib/validations/player'

const positions: Position[] = ['PG', 'SG', 'SF', 'PF', 'C']
const skillTiers: SkillTier[] = ['S', 'A', 'B', 'C', 'D']

export const AddPlayerForm = () => {
	const [lastResult, formAction, isSubmitting] = useActionState(
		createPlayer,
		undefined,
	)

	const [form, fields] = useForm({
		lastResult: lastResult?.result,
		onValidate: ({ formData }) =>
			parseWithZod(formData, { schema: CreatePlayerSchema }),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Add new player</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add new player</DialogTitle>
					<DialogDescription>
						Fill out the form below to add a new player to the roster.
					</DialogDescription>
				</DialogHeader>

				<form action={formAction} {...getFormProps(form)}>
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
				</form>
				<DialogFooter>
					<Button type="submit" disabled={isSubmitting} form={form.id}>
						{isSubmitting ? 'Adding...' : 'Add Player'}
					</Button>
					<DialogClose asChild>
						<Button disabled={isSubmitting} variant="outline">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
