'use client'

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

type ScoreInputFormProps = {
	scores: GameSession['games'][number]['scores']
	onCancel: () => void
}

export const ScoreInputForm = ({ scores, onCancel }: ScoreInputFormProps) => {
	const [lastResult, formAction, isSubmitting] = useActionState(
		updateGameScore,
		undefined,
	)

	const getFieldError = (fieldName: string) => {
		if (lastResult?.status === 'error' && lastResult.error) {
			return lastResult.error[fieldName as keyof typeof lastResult.error]
		}
		return undefined
	}

	return (
		<form action={formAction} className="space-y-4">
			{/* Hidden field for score count */}
			<input type="hidden" name="scoreCount" value={scores.length} />

			<FieldGroup>
				<div className="space-y-4">
					{scores.map((score, index) => {
						const fieldName = `scorePoints_${index}`
						const fieldError = getFieldError(fieldName)

						return (
							<div key={score.id}>
								<input
									type="hidden"
									name={`scoreId_${index}`}
									value={score.id}
								/>

								<Field>
									<FieldLabel htmlFor={fieldName}>
										Team {index + 1} Score
									</FieldLabel>
									<Input
										type="number"
										id={fieldName}
										name={fieldName}
										defaultValue={score.points}
										disabled={isSubmitting}
										min="0"
										max="300"
									/>
									{fieldError && <FieldError errors={fieldError} />}
								</Field>
							</div>
						)
					})}
				</div>

				{getFieldError('') && <FieldError errors={getFieldError('')} />}

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
