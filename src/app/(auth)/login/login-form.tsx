'use client'

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import Link from 'next/link'
import { useActionState } from 'react'
import { Button } from '#app/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '#app/components/ui/field'
import { Input } from '#app/components/ui/input'
import { login } from '#app/lib/actions/auth'
import { LoginSchema } from '#app/lib/validations/auth'

export const LoginForm = () => {
	const [lastResult, formAction, isSubmitting] = useActionState(
		login,
		undefined,
	)
	const [form, fields] = useForm({
		lastResult: lastResult?.result,
		onValidate: ({ formData }) =>
			parseWithZod(formData, { schema: LoginSchema }),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle className="text-2xl">
					<h1>Login</h1>
				</CardTitle>
				<CardDescription>
					Enter your credentials to access the Basketball Team Selector
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form action={formAction} {...getFormProps(form)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor={fields.username.id}>Username</FieldLabel>
							<Input
								{...getInputProps(fields.username, { type: 'text' })}
								defaultValue={fields.username.defaultValue}
								disabled={isSubmitting}
								autoFocus
							/>
							<FieldError errors={fields.username.errors} />
						</Field>

						<Field>
							<FieldLabel htmlFor={fields.password.id}>Password</FieldLabel>
							<Input
								type="password"
								id={fields.password.id}
								name={fields.password.name}
								defaultValue={fields.password.defaultValue}
								disabled={isSubmitting}
							/>
							<FieldError errors={fields.password.errors} />
						</Field>
						<FieldError errors={form.errors} />

						<Button type="submit" disabled={isSubmitting} className="w-full">
							{isSubmitting ? 'Logging in...' : 'Login'}
						</Button>
					</FieldGroup>

					<div className="text-center text-sm text-muted-foreground">
						Don't have an account?{' '}
						<Link
							href="/register"
							className="text-primary underline-offset-4 hover:underline"
						>
							Create new account
						</Link>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
