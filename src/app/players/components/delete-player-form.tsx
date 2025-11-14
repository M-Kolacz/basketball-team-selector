import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Trash2 } from 'lucide-react'
import { useActionState } from 'react'
import { Button } from '#app/components/ui/button'
import { deletePlayer } from '#app/lib/actions/players'
import { type Player } from '#app/lib/db.server'
import { DeletePlayerSchema } from '#app/lib/validations/player'

export const DeletePlayerForm = ({ player }: { player: Player }) => {
	const [lastResult, formAction, isSubmitting] = useActionState(
		deletePlayer,
		undefined,
	)
	const [form, fields] = useForm({
		lastResult: lastResult?.result,
		defaultValue: {
			id: player.id,
		},
		onValidate: ({ formData }) =>
			parseWithZod(formData, { schema: DeletePlayerSchema }),
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
				disabled={isSubmitting}
				type="submit"
				aria-label={`Delete ${player.name}`}
				className="text-destructive hover:text-destructive"
			>
				<Trash2 className="h-4 w-4" />
				{isSubmitting ? 'Deleting...' : 'Delete player'}
			</Button>
		</form>
	)
}
