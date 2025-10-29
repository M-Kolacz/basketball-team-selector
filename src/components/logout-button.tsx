'use client'

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { LogOutIcon } from 'lucide-react'
import { useActionState } from 'react'
import { Button } from '#app/components/ui/button'
import { FieldError } from '#app/components/ui/field'
import { logout } from '#app/lib/actions/auth'
import { LogoutSchema } from '#app/lib/validations/auth'

type LogoutButtonProps = {
	userId: string
}

export const LogoutButton = ({ userId }: LogoutButtonProps) => {
	const [lastResult, formAction, isSubmitting] = useActionState(
		logout,
		undefined,
	)
	const [form, fields] = useForm({
		defaultValue: {
			userId,
		},
		lastResult: lastResult?.result,
		onValidate: ({ formData }) =>
			parseWithZod(formData, { schema: LogoutSchema }),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	return (
		<form action={formAction} {...getFormProps(form)}>
			<input {...getInputProps(fields.userId, { type: 'hidden' })} />
			<Button
				variant="ghost"
				className="w-full justify-start"
				disabled={isSubmitting}
				type="submit"
			>
				<LogOutIcon className="size-4" />
				{isSubmitting ? 'Logging out...' : 'Logout'}
			</Button>
			<FieldError errors={form.errors} />
		</form>
	)
}
