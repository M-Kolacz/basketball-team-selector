'use client'

import {
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Pencil } from 'lucide-react'
import { useActionState, useEffect, useState } from 'react'
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
} from '#app/components/ui/dialog'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '#app/components/ui/field'
import { Textarea } from '#app/components/ui/textarea'
import {
	updateGameSessionAction,
	type GameSessions,
} from '#app/lib/actions/game-sessions'
import { type Players } from '#app/lib/actions/players'
import { UpdateGameSessionSchema } from '#app/lib/validations/game-session'

interface EditGameFormProps {
	gameSession: GameSessions[number]
	allPlayers: Players
	updateOptimisticGameSession?: (formData: FormData) => void
	isOptimistic: boolean
}

export const EditGameForm = ({
	gameSession,
	allPlayers,
	updateOptimisticGameSession,
	isOptimistic,
}: EditGameFormProps) => {
	const [open, setOpen] = useState(false)

	const [lastResult, formAction, isSubmitting] = useActionState(
		async (prevState: unknown, formData: FormData) => {
			if (updateOptimisticGameSession) {
				updateOptimisticGameSession(formData)
			}
			return await updateGameSessionAction(prevState, formData)
		},
		undefined,
	)

	const [form, fields] = useForm({
		lastResult: lastResult?.result,
		defaultValue: {
			id: gameSession.id,
			gameDatetime: gameSession.gameDatetime.toISOString(),
			description: gameSession.description ?? '',
			playerIds: gameSession.players.map((player) => player.id),
		},
		onValidate: ({ formData }) =>
			parseWithZod(formData, { schema: UpdateGameSessionSchema }),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	// Close dialog on successful submission
	useEffect(() => {
		if (lastResult?.result.status === 'success') {
			setOpen(false)
		}
	}, [lastResult])

	return (
		<>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => setOpen(true)}
				disabled={isOptimistic}
			>
				<Pencil className="h-4 w-4" />
				<span className="sr-only">Edit game session</span>
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit game session</DialogTitle>
						<DialogDescription>
							Update the game session details. Changing players will regenerate
							team propositions.
						</DialogDescription>
					</DialogHeader>

					<form action={formAction} {...getFormProps(form)}>
						<input
							{...getInputProps(fields.id, {
								type: 'hidden',
							})}
						/>
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
									{allPlayers.map((player) => (
										<div key={player.id} className="flex items-center gap-2">
											<Checkbox
												id={`${fields.playerIds.id}-${player.id}`}
												name={fields.playerIds.name}
												value={player.id}
												defaultChecked={gameSession.players.some(
													(p) => p.id === player.id,
												)}
											/>
											<label htmlFor={`${fields.playerIds.id}-${player.id}`}>
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
							{isSubmitting ? 'Updating game...' : 'Update Game'}
						</Button>
						<DialogClose asChild>
							<Button disabled={isSubmitting} variant="outline">
								Cancel
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
