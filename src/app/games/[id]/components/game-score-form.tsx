'use client'

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { useActionState, useState } from 'react'
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
import { Label } from '#app/components/ui/label'
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

	return (
		<Card>
			<CardHeader>
				<CardTitle>{'Add New Game'}</CardTitle>
			</CardHeader>
			<CardContent>
				<form action={formAction} {...getFormProps(form)}>
					<input {...getInputProps(fields.gameSessionId, { type: 'hidden' })} />
					{teams.map((team) => (
						<div key={team.id}>
							<label>{team.name}</label>
							<input
								{...getInputProps(fields.selectedTeams, { type: 'checkbox' })}
								value={team.id}
							/>
						</div>
					))}

					<FieldGroup>
						<Label className="mb-3 block text-sm font-medium">
							Select Teams Playing
						</Label>

						{(fields.selectedTeams.value?.length || 0) < 2 && (
							<p className="mt-2 text-sm text-muted-foreground">
								Select at least 2 teams to record a game
							</p>
						)}

						{(fields.selectedTeams.value?.length || 0) >= 2 && (
							<>
								<div className="space-y-4">
									{Array.isArray(fields.selectedTeams.value) &&
										fields.selectedTeams.value.map((teamId, index) => {
											const team = teams.find((t) => t.id === teamId)!

											return (
												<Field key={teamId}>
													<input
														type="hidden"
														name={`scores[${index}].teamId`}
														value={team.id}
													/>
													<FieldLabel htmlFor={`scores[${index}].points`}>
														Team {teams.indexOf(team) + 1} Score
														<span className="ml-2 text-sm font-normal text-muted-foreground">
															({team.players.map((p) => p.name).join(', ')})
														</span>
													</FieldLabel>
													<Input
														{...getInputProps(
															// @ts-ignore
															{ name: `scores[${index}].points`, errors: [] },
															{ type: 'number' },
														)}
														placeholder="0"
														disabled={isSubmitting}
														min="0"
														max="300"
													/>
												</Field>
											)
										})}
								</div>

								<FieldError errors={fields.scores?.errors} />
							</>
						)}

						<FieldError errors={form.errors} />

						<div className="flex gap-3">
							<Button
								type="button"
								variant="outline"
								disabled={isSubmitting}
								onClick={onCancel}
								className="flex-1"
							>
								Cancel
							</Button>

							<Button type="submit" className={'flex-1'}>
								{isSubmitting ? 'Adding game...' : 'Add Game'}
							</Button>
						</div>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	)
}
