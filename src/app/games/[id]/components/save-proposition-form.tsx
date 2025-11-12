'use client'

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Fragment, useActionState } from 'react'
import { Button } from '#app/components/ui/button'
import { updatePropositionTeams } from '#app/lib/actions/game-sessions'
import {
	SavePropositionSchema,
	type SavePropositionCommand,
} from '#app/lib/validations/game-session'

export const SavePropositionForm = ({
	updatedTeams,
}: {
	updatedTeams: SavePropositionCommand['updatedTeams']
}) => {
	const [lastResult, formAction, isSubmitting] = useActionState(
		updatePropositionTeams,
		undefined,
	)
	const [form, fields] = useForm({
		constraint: getZodConstraint(SavePropositionSchema),
		lastResult: lastResult?.result,
		defaultValue: {
			updatedTeams: updatedTeams,
		},
		onValidate: ({ formData }) =>
			parseWithZod(formData, { schema: SavePropositionSchema }),
	})

	const updatedTeamsFieldList = fields.updatedTeams.getFieldList()

	return (
		<form {...getFormProps(form)} action={formAction}>
			{updatedTeamsFieldList.map((teamUpdates) => {
				const teamIdField = teamUpdates.getFieldset().id
				const playersIdFieldList = teamUpdates
					.getFieldset()
					.players.getFieldList()

				return (
					<Fragment key={teamUpdates.id}>
						<input {...getInputProps(teamIdField, { type: 'hidden' })} />
						{playersIdFieldList.map((playerIdField) => {
							const playerField = playerIdField.getFieldset()

							return (
								<input
									{...getInputProps(playerField.id, {
										type: 'hidden',
									})}
									key={playerField.id.id}
								/>
							)
						})}
					</Fragment>
				)
			})}
			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Saving...' : 'Save Teams'}
			</Button>
		</form>
	)
}
