'use client'

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Trash2 } from 'lucide-react'
import { useActionState } from 'react'
import { Button } from '#app/components/ui/button'
import { deleteGameSession } from '#app/lib/actions/game-sessions'
import { type GameSession } from '#app/lib/db.server'
import { DeleteGameSessionSchema } from '#app/lib/validations/game-session'

export const DeleteGameForm = ({
	gameId,
	isOptimistic,
}: {
	gameId: GameSession['id']
	isOptimistic: boolean
}) => {
	const [lastResult, formAction, isSubmitting] = useActionState(
		deleteGameSession,
		undefined,
	)
	const [form, fields] = useForm({
		lastResult: lastResult?.result,
		defaultValue: {
			id: gameId,
		},
		onValidate: ({ formData }) =>
			parseWithZod(formData, { schema: DeleteGameSessionSchema }),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	return (
		<form action={formAction} {...getFormProps(form)}>
			<input
				{...getInputProps(fields.id, {
					type: 'hidden',
				})}
			/>
			<Button
				variant="ghost"
				size="sm"
				disabled={isSubmitting || isOptimistic}
				type="submit"
				className="w-full justify-start text-destructive hover:text-destructive"
			>
				<Trash2 className="h-4 w-4" />
				<span className="sr-only">
					{isSubmitting ? 'Deleting...' : 'Delete game session'}
				</span>
			</Button>
		</form>
	)
}
