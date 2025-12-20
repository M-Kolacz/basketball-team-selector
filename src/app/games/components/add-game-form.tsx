'use client'

import { getFormProps, getTextareaProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { useActionState, useState } from 'react'
import { useGamesContext } from '#app/app/games/helpers/games-context'
import { DatePicker, MultiSelect } from '#app/components/form'
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
import { CreateGameSessionSchema } from '#app/lib/validations/game-session'

export const AddGameForm = () => {
	const { players, addOptimisticGameSession } = useGamesContext()
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

						<Field>
							<FieldLabel htmlFor={fields.playerIds.id}>Players</FieldLabel>
							<MultiSelect
								id={fields.playerIds.id}
								name={fields.playerIds.name}
								items={players.map((player) => ({
									name: player.name,
									value: player.id,
								}))}
								defaultValue={fields.playerIds.defaultOptions}
								placeholder="Select players"
								searchPlaceholder="Search players..."
								emptyMessage="No players found"
							/>
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
