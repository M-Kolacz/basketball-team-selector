'use client'

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
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

export const GameScoreForm = ({
	gameSessionId,
	teams,
	gameId,
	onCancel,
}: GameScoreFormProps) => {
	const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>(() =>
		gameId ? teams.map((t) => t.id) : [],
	)

	const [lastResult, formAction, isSubmitting] = useActionState(
		recordGameResultAction,
		undefined,
	)

	const [form, fields] = useForm({
		lastResult: lastResult?.result,
		onValidate: ({ formData }) =>
			parseWithZod(formData, { schema: GameResultSchema }),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	const toggleTeam = (teamId: string) => {
		setSelectedTeamIds((prev) =>
			prev.includes(teamId)
				? prev.filter((id) => id !== teamId)
				: [...prev, teamId],
		)
	}

	const selectedTeams = teams.filter((t) => selectedTeamIds.includes(t.id))

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

					<FieldGroup>
						{/* Team Selection - only show if not editing */}
						{!gameId && (
							<div className="mb-6">
								<Label className="mb-3 block text-sm font-medium">
									Select Teams Playing
								</Label>
								<div className="space-y-2 rounded-lg border p-4">
									{teams.map((team) => (
										<div key={team.id} className="flex items-start space-x-3">
											<Checkbox
												id={`team-${team.id}`}
												checked={selectedTeamIds.includes(team.id)}
												onCheckedChange={() => toggleTeam(team.id)}
												disabled={isSubmitting}
											/>
											<div className="grid gap-1.5 leading-none">
												<label
													htmlFor={`team-${team.id}`}
													className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
												>
													Team {teams.indexOf(team) + 1}
												</label>
												<p className="text-sm text-muted-foreground">
													{team.players.map((p) => p.name).join(', ')}
												</p>
											</div>
										</div>
									))}
								</div>
								{selectedTeamIds.length < 2 && (
									<p className="mt-2 text-sm text-muted-foreground">
										Select at least 2 teams to record a game
									</p>
								)}
							</div>
						)}

						{/* Score inputs for selected teams */}
						{selectedTeams.length >= 2 && (
							<>
								<div className="space-y-4">
									{selectedTeams.map((team, index) => (
										<Field key={team.id}>
											{/* Hidden team ID */}
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
									))}
								</div>

								<FieldError errors={fields.scores?.errors} />
							</>
						)}

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
								disabled={isSubmitting || selectedTeamIds.length < 2}
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
