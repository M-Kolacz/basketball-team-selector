'use client'

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import Link from 'next/link'
import { useActionState } from 'react'
import { Button } from '#app/components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '#app/components/ui/card'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '#app/components/ui/field'
import { Input } from '#app/components/ui/input'
import { register } from '#app/lib/actions'
import { RegisterSchema } from '#app/lib/validations/auth'

export function RegistrationForm() {
	const [lastResult, formAction, isSubmitting] = useActionState(
		register,
		undefined,
	)
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: RegisterSchema })
		},
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Create an account</CardTitle>
					<CardDescription>
						Enter your details to register for a new account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={formAction} {...getFormProps(form)}>
						<FieldGroup className="space-y-2">
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
									{...getInputProps(fields.password, { type: 'password' })}
									defaultValue={fields.password.defaultValue}
									disabled={isSubmitting}
								/>
								<FieldError errors={fields.password.errors} />
							</Field>

							<Field>
								<FieldLabel htmlFor={fields.confirmPassword.id}>
									Confirm Password
								</FieldLabel>
								<Input
									{...getInputProps(fields.confirmPassword, {
										type: 'password',
									})}
									defaultValue={fields.confirmPassword.defaultValue}
									disabled={isSubmitting}
								/>
								<FieldError errors={fields.confirmPassword.errors} />
							</Field>
							<FieldError errors={form.errors} />

							<Button type="submit" className="w-full" disabled={isSubmitting}>
								{isSubmitting ? 'Creating account...' : 'Create account'}
							</Button>
						</FieldGroup>

						<p className="text-center text-sm text-muted-foreground">
							Already have an account?{' '}
							<Link
								href="/login"
								className="font-medium text-primary hover:underline"
							>
								Sign in
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
