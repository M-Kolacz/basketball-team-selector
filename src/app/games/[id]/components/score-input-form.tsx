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
import { updateGameScoreAction } from '#app/lib/actions/game-sessions.server'
import { UpdateGameScoreSchema } from '#app/lib/validations/game-session'
import type { GameScoreViewModel } from '../types'

type ScoreInputFormProps = {
	gameSessionId: string
	gameIndex: number
	score: GameScoreViewModel
	onCancel: () => void
}

export function ScoreInputForm({
	gameSessionId,
	gameIndex,
	score,
	onCancel,
}: ScoreInputFormProps) {
	const [lastResult, formAction, isSubmitting] = useActionState(
		updateGameScoreAction,
		undefined,
	)

	const [form, fields] = useForm({
		lastResult: lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: UpdateGameScoreSchema })
		},
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		defaultValue: {
			gameSessionId,
			gameIndex,
			scores: score,
		},
	})

	const scoresField = fields.scores.getFieldList()

	return (
		<form action={formAction} {...getFormProps(form)} className="space-y-4">
			<input
				type="hidden"
				name={fields.gameSessionId.name}
				value={gameSessionId}
			/>
			<input type="hidden" name={fields.gameIndex.name} value={gameIndex} />

			<FieldGroup>
				<div className="grid gap-4 sm:grid-cols-2">
					<Field>
						<FieldLabel htmlFor={scoresField[0]?.getFieldset().score.id}>
							Team A Score
						</FieldLabel>
						<Input
							{...getInputProps(scoresField[0]?.getFieldset().score, {
								type: 'number',
							})}
							disabled={isSubmitting}
							min="0"
						/>
						<input
							type="hidden"
							name={scoresField[0]?.getFieldset().teamId.name}
							value={score[0]?.teamId}
						/>
						<FieldError errors={scoresField[0]?.getFieldset().score.errors} />
					</Field>

					<Field>
						<FieldLabel htmlFor={scoresField[1]?.getFieldset().score.id}>
							Team B Score
						</FieldLabel>
						<Input
							{...getInputProps(scoresField[1]?.getFieldset().score, {
								type: 'number',
							})}
							disabled={isSubmitting}
							min="0"
						/>
						<input
							type="hidden"
							name={scoresField[1]?.getFieldset().teamId.name}
							value={score[1]?.teamId}
						/>
						<FieldError errors={scoresField[1]?.getFieldset().score.errors} />
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
}
