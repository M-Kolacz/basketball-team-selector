'use client'

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Trash } from 'lucide-react'
import { useActionState, useState } from 'react'
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
import {
	type GameSession,
	recordGameResultAction,
} from '#app/lib/actions/game-sessions'

import { GameResultSchema } from '#app/lib/validations/game-session'

interface AddGameFormProps {
	gameSessionId: string
	teams: NonNullable<GameSession['selectedProposition']>['teams']
}

export const AddGameScoreForm = ({
	gameSessionId,
	teams,
}: AddGameFormProps) => {
	const [open, setOpen] = useState(false)

	const [lastResult, formAction, isSubmitting] = useActionState(
		recordGameResultAction,
		undefined,
	)

	const [form, fields] = useForm({
		constraint: getZodConstraint(GameResultSchema),
		lastResult: lastResult?.result,
		onValidate: ({ formData }) =>
			parseWithZod(formData, { schema: GameResultSchema }),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		defaultValue: {
			gameSessionId,
		},
	})

	const scoreList = fields.scores.getFieldList()
	console.log({ scoreList, value: scoreList.values() })

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Add new game score</Button>
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
						<input
							{...getInputProps(fields.gameSessionId, { type: 'hidden' })}
						/>
						<Field orientation={'horizontal'}>
							{teams.map((team) => (
								<Button
									key={team.id}
									{...form.insert.getButtonProps({
										name: fields.scores.name,
										defaultValue: { teamId: team.id },
									})}
								>
									Add team {team.name}
								</Button>
							))}
						</Field>

						<FieldGroup>
							{scoreList.map((score, index) => {
								const scoreFields = score.getFieldset()
								const team = teams.find(
									(t) => t.id === scoreFields.teamId.value,
								)
								if (!team) return null

								return (
									<Field key={score.id}>
										<input
											{...getInputProps(scoreFields.teamId, {
												type: 'hidden',
											})}
										/>

										<FieldLabel htmlFor={scoreFields.points.id}>
											Team {team.name} score
										</FieldLabel>
										<Input
											{...getInputProps(scoreFields.points, {
												type: 'number',
											})}
											disabled={isSubmitting}
										/>

										<Button
											variant="destructive"
											className="w-fit!"
											{...form.remove.getButtonProps({
												name: fields.scores.name,
												index,
											})}
										>
											<Trash />
										</Button>
										<FieldError errors={scoreFields.points.errors} />
									</Field>
								)
							})}
						</FieldGroup>
						<FieldError errors={form.errors} />
						<Field orientation={'horizontal'}></Field>
					</FieldGroup>
				</form>
				{scoreList.length === 2 ? (
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							disabled={isSubmitting}
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button type="submit" form={form.id}>
							{isSubmitting ? 'Adding game...' : 'Add Game'}
						</Button>
					</DialogFooter>
				) : null}
			</DialogContent>
		</Dialog>
	)
}
