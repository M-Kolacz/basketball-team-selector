'use client'

import {
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
	type FieldMetadata,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { Button } from '#app/components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'
import { Checkbox } from '#app/components/ui/checkbox'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '#app/components/ui/field'
import { Input } from '#app/components/ui/input'
import { Textarea } from '#app/components/ui/textarea'
import { createGameSessionAction } from '#app/lib/actions/game-sessions'
import { type Players } from '#app/lib/actions/players'
import { CreateGameSessionSchema } from '#app/lib/validations/game-session'

interface CreateGameFormProps {
	players: Players
}

interface PlayerCheckboxListProps {
	players: Players
	fieldMeta: FieldMetadata<string[]>
	disabled: boolean
}

const PlayerCheckboxList = ({
	players,
	fieldMeta,
	disabled,
}: PlayerCheckboxListProps) => (
	<div className="grid max-h-96 grid-cols-1 gap-3 overflow-y-auto rounded-md border p-4 md:grid-cols-2">
		{players.map((player) => (
			<div key={player.id} className="flex items-center gap-2">
				<Checkbox
					id={`player-${player.id}`}
					name={fieldMeta.name}
					value={player.id}
					defaultChecked={fieldMeta.initialValue?.includes(player.id)}
					disabled={disabled}
				/>
				<label
					htmlFor={`player-${player.id}`}
					className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					{player.name}
				</label>
			</div>
		))}
	</div>
)

export const CreateGameForm = ({ players }: CreateGameFormProps) => {
	const router = useRouter()
	const [lastResult, formAction, isSubmitting] = useActionState(
		createGameSessionAction,
		undefined,
	)
	const [form, fields] = useForm({
		lastResult: lastResult?.result,
		onValidate: ({ formData }) =>
			parseWithZod(formData, { schema: CreateGameSessionSchema }),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	return (
		<Card className="mx-auto w-full max-w-2xl">
			<CardHeader>
				<CardTitle>Create Game</CardTitle>
			</CardHeader>
			<CardContent>
				<form action={formAction} {...getFormProps(form)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor={fields.gameDatetime.id}>
								Game Date & Time
							</FieldLabel>
							<Input
								{...getInputProps(fields.gameDatetime, {
									type: 'datetime-local',
								})}
								disabled={isSubmitting}
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
							<div className="flex items-center justify-between">
								<FieldLabel>Players</FieldLabel>
							</div>
							<PlayerCheckboxList
								players={players}
								fieldMeta={fields.playerIds}
								disabled={isSubmitting}
							/>
							<FieldError errors={fields.playerIds.errors} />
						</Field>

						<FieldError errors={form.errors} />

						<div className="flex gap-3">
							<Button
								type="button"
								variant="outline"
								disabled={isSubmitting}
								onClick={() => router.push('/games')}
								className="flex-1"
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting} className="flex-1">
								{isSubmitting ? 'Creating game...' : 'Create Game'}
							</Button>
						</div>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	)
}
