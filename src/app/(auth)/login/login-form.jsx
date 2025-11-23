'use client';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { Button } from '#app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from '#app/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel, } from '#app/components/ui/field';
import { Input } from '#app/components/ui/input';
import { Spinner } from '#app/components/ui/spinner';
import { loginAction } from '#app/lib/actions/auth';
import { LoginSchema } from '#app/lib/validations/auth';
export var LoginForm = function () {
    var _a = useActionState(loginAction, undefined), state = _a[0], formAction = _a[1], isSubmitting = _a[2];
    var searchParams = useSearchParams();
    var redirectTo = searchParams.get('redirectTo');
    var _b = useForm({
        id: 'login-form',
        constraint: getZodConstraint(LoginSchema),
        defaultValue: { redirectTo: redirectTo },
        lastResult: state === null || state === void 0 ? void 0 : state.result,
        onValidate: function (_a) {
            var formData = _a.formData;
            return parseWithZod(formData, { schema: LoginSchema });
        },
        shouldRevalidate: 'onBlur',
    }), form = _b[0], fields = _b[1];
    return (<Card className="w-full max-w-md">
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
					<input {...getInputProps(fields.redirectTo, {
        type: 'hidden',
    })}/>
					<FieldGroup>
						<Field data-invalid={Boolean(fields.username.errors)}>
							<FieldLabel htmlFor={fields.username.id}>Username</FieldLabel>
							<Input {...getInputProps(fields.username, { type: 'text' })} autoComplete="username" disabled={isSubmitting} autoFocus/>
							<FieldError errors={fields.username.errors}/>
						</Field>

						<Field data-invalid={Boolean(fields.password.errors)}>
							<FieldLabel htmlFor={fields.password.id}>Password</FieldLabel>
							<Input {...getInputProps(fields.password, { type: 'password' })} autoComplete="current-password" disabled={isSubmitting}/>
							<FieldError errors={fields.password.errors}/>
						</Field>
						<FieldError errors={form.errors}/>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter>
				<Field orientation={'vertical'}>
					<Button type="submit" form={form.id} disabled={isSubmitting} className="w-full">
						{isSubmitting ? (<>
								<Spinner />
								<span>Logging in...</span>
							</>) : (<span>Login</span>)}
					</Button>

					<span className="text-center text-sm text-muted-foreground">
						Don't have an account?{' '}
						<Link href={redirectTo ? "/register?redirectTo=".concat(redirectTo) : '/register'} className="text-primary underline-offset-4 hover:underline">
							Create new account
						</Link>
					</span>
				</Field>
			</CardFooter>
		</Card>);
};
