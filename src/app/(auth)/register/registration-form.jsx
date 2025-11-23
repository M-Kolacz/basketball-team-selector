'use client';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { Button } from '#app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, } from '#app/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel, } from '#app/components/ui/field';
import { Input } from '#app/components/ui/input';
import { Spinner } from '#app/components/ui/spinner';
import { registerAction } from '#app/lib/actions/auth';
import { RegisterSchema } from '#app/lib/validations/auth';
export var RegistrationForm = function () {
    var _a = useActionState(registerAction, undefined), state = _a[0], formAction = _a[1], isSubmitting = _a[2];
    var searchParams = useSearchParams();
    var redirectTo = searchParams.get('redirectTo');
    var _b = useForm({
        id: 'register-form',
        constraint: getZodConstraint(RegisterSchema),
        defaultValue: { redirectTo: redirectTo },
        lastResult: state === null || state === void 0 ? void 0 : state.result,
        onValidate: function (_a) {
            var formData = _a.formData;
            return parseWithZod(formData, { schema: RegisterSchema });
        },
        shouldRevalidate: 'onBlur',
    }), form = _b[0], fields = _b[1];
    return (<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Create an account</CardTitle>
					<CardDescription>
						Enter your details to register for a new account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={formAction} {...getFormProps(form)}>
						<input {...getInputProps(fields.redirectTo, { type: 'hidden' })}/>
						<FieldGroup>
							<Field data-invalid={Boolean(fields.username.errors)}>
								<FieldLabel htmlFor={fields.username.id}>Username</FieldLabel>
								<Input {...getInputProps(fields.username, { type: 'text' })} disabled={isSubmitting} autoComplete="username" autoFocus/>
								<FieldError errors={fields.username.errors}/>
							</Field>

							<Field data-invalid={Boolean(fields.password.errors)}>
								<FieldLabel htmlFor={fields.password.id}>Password</FieldLabel>
								<Input {...getInputProps(fields.password, { type: 'password' })} autoComplete="new-password" disabled={isSubmitting}/>
								<FieldError errors={fields.password.errors}/>
							</Field>

							<Field data-invalid={Boolean(fields.confirmPassword.errors)}>
								<FieldLabel htmlFor={fields.confirmPassword.id}>
									Confirm Password
								</FieldLabel>
								<Input {...getInputProps(fields.confirmPassword, {
        type: 'password',
    })} autoComplete="new-password" disabled={isSubmitting}/>
								<FieldError errors={fields.confirmPassword.errors}/>
							</Field>
							<FieldError errors={form.errors}/>
						</FieldGroup>
					</form>
				</CardContent>
				<CardFooter>
					<Field>
						<Button type="submit" form={form.id} disabled={isSubmitting} className="w-full">
							{isSubmitting ? (<>
									<Spinner />
									<span>Creating account...</span>
								</>) : (<span>Create account</span>)}
						</Button>

						<p className="text-center text-sm text-muted-foreground">
							Already have an account?{' '}
							<Link href="/login" className="font-medium text-primary hover:underline">
								Sign in
							</Link>
						</p>
					</Field>
				</CardFooter>
			</Card>
		</div>);
};
