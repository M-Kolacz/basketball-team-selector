'use client'

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { useActionState } from 'react'
import { Button } from '#app/components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '#app/components/ui/field'
import { Input } from '#app/components/ui/input'
import { recordGameResultAction } from '#app/lib/actions/game-sessions'
import { GameResultSchema } from '#app/lib/validations/game-session'

type Team = {
	id: string
	players: Array<{ id: string; name: string }>
}

type GameScoreFormProps = {
	gameSessionId: string
	teams: Team[]
	gameId?: string
	onCancel?: () => void
}

export function GameScoreForm({
	gameSessionId,
	teams,
	gameId,
	onCancel,
}: GameScoreFormProps) {
	const [lastResult, formAction, isSubmitting] = useActionState(
		recordGameResultAction,
		undefined,
	)

	const [form, fields] = useForm({
		lastResult: lastResult?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: GameResultSchema })
		},
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	// Ensure we have exactly 2 teams
	if (teams.length !== 2) {
		return (
			<Card>
				<CardContent className="pt-6">
					<p className="text-center text-muted-foreground">
						This game session must have exactly 2 teams to record scores.
					</p>
				</CardContent>
			</Card>
		)
	}

	const [teamA, teamB] = teams

	return (
		<Card>
			<CardHeader>
				<CardTitle>{gameId ? 'Update Game Score' : 'Add New Game'}</CardTitle>
			</CardHeader>
			<CardContent>
				<form action={formAction} {...getFormProps(form)}>
					{/* Hidden fields */}
					<input type="hidden" name="gameSessionId" value={gameSessionId} />
					{gameId && <input type="hidden" name="gameId" value={gameId} />}
					<input type="hidden" name="scores[0].teamId" value={teamA.id} />
					<input type="hidden" name="scores[1].teamId" value={teamB.id} />

					<FieldGroup>
						{/* Team A Score */}
						<Field>
							<FieldLabel htmlFor="scores[0].points">
								Team A Score
								<span className="ml-2 text-sm font-normal text-muted-foreground">
									({teamA.players.map((p) => p.name).join(', ')})
								</span>
							</FieldLabel>
							<Input
								{...getInputProps(
									{ name: 'scores[0].points', errors: [] },
									{ type: 'number' },
								)}
								placeholder="0"
								disabled={isSubmitting}
								min="0"
								max="300"
							/>
							<FieldError errors={fields.scores?.errors} />
						</Field>

						{/* Team B Score */}
						<Field>
							<FieldLabel htmlFor="scores[1].points">
								Team B Score
								<span className="ml-2 text-sm font-normal text-muted-foreground">
									({teamB.players.map((p) => p.name).join(', ')})
								</span>
							</FieldLabel>
							<Input
								{...getInputProps(
									{ name: 'scores[1].points', errors: [] },
									{ type: 'number' },
								)}
								placeholder="0"
								disabled={isSubmitting}
								min="0"
								max="300"
							/>
							<FieldError errors={fields.scores?.errors} />
						</Field>

						<FieldError errors={form.errors} />

						<div className="flex gap-3">
							{onCancel && (
								<Button
									type="button"
									variant="outline"
									disabled={isSubmitting}
									onClick={onCancel}
									className="flex-1"
								>
									Cancel
								</Button>
							)}
							<Button
								type="submit"
								disabled={isSubmitting}
								className={onCancel ? 'flex-1' : 'w-full'}
							>
								{isSubmitting
									? gameId
										? 'Updating...'
										: 'Adding game...'
									: gameId
										? 'Update Score'
										: 'Add Game'}
							</Button>
						</div>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	)
}
