'use client'

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useActionState } from 'react'
import { Button } from '#app/components/ui/button'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '#app/components/ui/field'
import { Input } from '#app/components/ui/input'
import {
	updateGameScore,
	type GameSession,
} from '#app/lib/actions/game-sessions'
import { EditGameScoreSchema } from '#app/lib/validations/game-session'

type ScoreInputFormProps = {
	scores: GameSession['games'][number]['scores']
	onCancel: () => void
}

export const ScoreInputForm = ({ scores, onCancel }: ScoreInputFormProps) => {
	const [lastResult, formAction, isSubmitting] = useActionState(
		updateGameScore,
		undefined,
	)

	const [form, fields] = useForm({
		constraint: getZodConstraint(EditGameScoreSchema),
		lastResult: lastResult?.result,
		onValidate: ({ formData }) =>
			parseWithZod(formData, { schema: EditGameScoreSchema }),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		defaultValue: {
			scores: scores,
		},
	})

	const scoreFields = fields.scores.getFieldList()

	return (
		<form {...getFormProps(form)} action={formAction}>
			<FieldGroup>
				<div className="space-y-4">
					{scoreFields.map((score, index) => {
						const scoreFields = score.getFieldset()
						return (
							<div key={score.id}>
								<input {...getInputProps(scoreFields.id, { type: 'hidden' })} />

								<Field>
									<FieldLabel htmlFor={scoreFields.points.id}>
										Team {index + 1} Score
									</FieldLabel>
									<Input
										{...getInputProps(scoreFields.points, { type: 'number' })}
									/>
								</Field>
							</div>
						)
					})}
				</div>

				<div className="flex gap-2">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Saving...' : 'Save Score'}
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
				</div>
			</FieldGroup>
		</form>
	)
}
