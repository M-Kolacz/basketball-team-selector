'use client'

import { getFormProps, getTextareaProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { useActionState, useState } from 'react'
import { Checkbox, DatePicker } from '#app/components/form'
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
import { Textarea } from '#app/components/ui/textarea'
import { createGameSessionAction } from '#app/lib/actions/game-sessions'
import { type Players } from '#app/lib/actions/players'
import { CreateGameSessionSchema } from '#app/lib/validations/game-session'

interface AddGameFormProps {
	players: Players
	addOptimisticGameSession: (formData: FormData) => void
}

export const AddGameForm = ({
	players,
	addOptimisticGameSession: addOptimisticGameSession,
}: AddGameFormProps) => {
	const [open, setOpen] = useState(false)

	const [lastResult, formAction, isSubmitting] = useActionState(
		async (prevState: unknown, formData: FormData) => {
			addOptimisticGameSession(formData)
			return await createGameSessionAction(prevState, formData)
		},
		undefined,
	)
	const [form, fields] = useForm({
		lastResult: lastResult?.result,
		onValidate: ({ formData }) =>
			parseWithZod(formData, { schema: CreateGameSessionSchema }),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		onSubmit: () => {
			setOpen(false)
		},
	})
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Add new game</Button>
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
							<FieldLabel htmlFor={fields.gameDatetime.id}>
								Game Date & Time
							</FieldLabel>
							<DatePicker
								id={fields.gameDatetime.id}
								name={fields.gameDatetime.name}
								defaultValue={fields.gameDatetime.defaultValue}
							/>
							<FieldError errors={fields.gameDatetime.errors} />
						</Field>

						<Field>
							<FieldLabel htmlFor={fields.description.id}>
								Description (optional)
							</FieldLabel>
							<Textarea
								{...getTextareaProps(fields.description)}
								disabled={isSubmitting}
								placeholder="Enter game description..."
								rows={3}
							/>
							<FieldError errors={fields.description.errors} />
						</Field>

						<Field role="group" aria-labelledby={fields.playerIds.id}>
							<FieldLabel id={fields.playerIds.id}>Players</FieldLabel>
							<div className="grid grid-cols-2 gap-2">
								{players.map((player) => (
									<div key={player.id} className="flex items-center gap-2">
										<Checkbox
											id={`${fields.playerIds.id}-${player.id}`}
											name={fields.playerIds.name}
											value={player.id}
											defaultChecked={fields.playerIds.defaultOptions?.includes(
												player.id,
											)}
										/>
										<label htmlFor={`${fields.playerIds.id}-${player}`}>
											{player.name}
										</label>
									</div>
								))}
							</div>
							<FieldError errors={fields.playerIds.errors} />
						</Field>

						<FieldError errors={form.errors} />
					</FieldGroup>
				</form>
				<DialogFooter>
					<Button type="submit" disabled={isSubmitting} form={form.id}>
						{isSubmitting ? 'Creating game...' : 'Create Game'}
					</Button>
					<DialogClose asChild>
						<Button disabled={isSubmitting} variant="outline">
							Cancel
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
