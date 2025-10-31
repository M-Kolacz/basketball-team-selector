'use client'

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
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
import { UpdateGameScoreSchema } from '#app/lib/validations/game-session'

type ScoreInputFormProps = {
	scores: GameSession['games'][number]['scores']
	onCancel: () => void
}

export const ScoreInputForm = ({ scores, onCancel }: ScoreInputFormProps) => {
	const firstScore = scores[0]!
	const secondScore = scores[1]!

	const [lastResult, formAction, isSubmitting] = useActionState(
		updateGameScore,
		undefined,
	)

	const [form, fields] = useForm({
		lastResult: lastResult,
		onValidate: ({ formData }) => parseWithZod(formData, { schema: UpdateGameScoreSchema }),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		defaultValue: {
			firstScoreId: firstScore.id,
			firstScorePoints: firstScore.points,
			secondScoreId: secondScore.id,
			secondScorePoints: secondScore.points,
		},
	})

	return (
		<form action={formAction} {...getFormProps(form)} className="space-y-4">
			<input {...getInputProps(fields.firstScoreId, { type: 'hidden' })} />
			<input {...getInputProps(fields.secondScoreId, { type: 'hidden' })} />

			<FieldGroup>
				<div className="grid gap-4 sm:grid-cols-2">
					<Field>
						<FieldLabel htmlFor={fields.firstScorePoints.id}>
							Team A Score
						</FieldLabel>
						<Input
							{...getInputProps(fields.firstScorePoints, { type: 'number' })}
							disabled={isSubmitting}
						/>

						<FieldError errors={fields.firstScorePoints.errors} />
					</Field>

					<Field>
						<FieldLabel htmlFor={fields.secondScorePoints.id}>
							Team B Score
						</FieldLabel>
						<Input
							{...getInputProps(fields.secondScorePoints, { type: 'number' })}
							disabled={isSubmitting}
						/>

						<FieldError errors={fields.secondScorePoints.errors} />
					</Field>
				</div>

				<FieldError errors={form.errors} />

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
};
