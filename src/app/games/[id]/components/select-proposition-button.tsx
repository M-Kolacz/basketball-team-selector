'use client'

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { useActionState } from 'react'
import { Button } from '#app/components/ui/button'
import { selectPropositionAction } from '#app/lib/actions/game-sessions'
import { SelectPropositionSchema } from '#app/lib/validations/game-session'

type SelectPropositionButtonProps = {
	gameSessionId: string
	propositionId: string
	disabled?: boolean
}

export function SelectPropositionButton({
	gameSessionId,
	propositionId,
	disabled = false,
}: SelectPropositionButtonProps) {
	const [state, formAction, isPending] = useActionState(
		selectPropositionAction,
		undefined,
	)

	const [form, fields] = useForm({
		lastResult: state?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: SelectPropositionSchema })
		},
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		defaultValue: {
			gameSessionId,
			propositionId,
		},
	})

	return (
		<form action={formAction} {...getFormProps(form)}>
			<input {...getInputProps(fields.gameSessionId, { type: 'hidden' })} />
			<input {...getInputProps(fields.propositionId, { type: 'hidden' })} />
			<Button type="submit" disabled={disabled || isPending} className="w-full">
				{isPending ? 'Selecting...' : 'Select as Final Proposition'}
			</Button>
		</form>
	)
}
