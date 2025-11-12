'use client'

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Trash } from 'lucide-react'
import { useActionState } from 'react'
import { Button } from '#app/components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'
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

type GameScoreFormProps = {
	gameSessionId: string
	teams: NonNullable<GameSession['selectedProposition']>['teams']
	onCancel: () => void
}

export const GameScoreForm = ({
	gameSessionId,
	teams,
	onCancel,
}: GameScoreFormProps) => {
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

	return (
		<Card>
			<CardHeader>
				<CardTitle>{'Add New Game'}</CardTitle>
			</CardHeader>
			<CardContent>
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
						<Field orientation={'horizontal'}>
							<Button type="submit">
								{isSubmitting ? 'Adding game...' : 'Add Game'}
							</Button>
							<Button
								type="button"
								variant="outline"
								disabled={isSubmitting}
								onClick={onCancel}
							>
								Cancel
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	)
}
