'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Alert, AlertDescription } from '#app/components/ui/alert'
import { Button } from '#app/components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '#app/components/ui/card'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import {
	calculatePasswordStrength,
	checkPasswordRequirements,
} from '#app/lib/password-strength'
import {
	type RegistrationFormState,
	type RegistrationFormProps,
} from '#app/types/registration'
import { PasswordRequirements } from './password-requirements'
import { PasswordStrengthIndicator } from './password-strength-indicator'

const initialFormState: RegistrationFormState = {
	username: '',
	password: '',
	confirmPassword: '',
	isSubmitting: false,
	errors: {},
	passwordStrength: {
		score: 0,
		label: 'Very Weak',
		color: 'red',
		percentage: 20,
	},
}

export function RegistrationForm({
	onSuccess,
	redirectUrl = '/',
}: RegistrationFormProps) {
	const router = useRouter()
	const [formState, setFormState] =
		useState<RegistrationFormState>(initialFormState)

	const passwordRequirements = checkPasswordRequirements(formState.password)

	const validateUsername = (username: string): string | undefined => {
		if (!username) {
			return 'Username is required'
		}
		if (username.length < 3) {
			return 'Username must be at least 3 characters'
		}
		if (username.length > 20) {
			return 'Username must be less than 20 characters'
		}
		if (!/^[a-zA-Z0-9_]+$/.test(username)) {
			return 'Username can only contain letters, numbers, and underscores'
		}
		return undefined
	}

	const validatePassword = (password: string): string | undefined => {
		if (!password) {
			return 'Password is required'
		}
		const requirements = checkPasswordRequirements(password)
		if (!requirements.minLength) {
			return 'Password must be at least 8 characters'
		}
		if (
			!requirements.hasUpperCase ||
			!requirements.hasLowerCase ||
			!requirements.hasNumber ||
			!requirements.hasSpecialChar
		) {
			return 'Password must meet all requirements'
		}
		return undefined
	}

	const validateConfirmPassword = (
		password: string,
		confirmPassword: string,
	): string | undefined => {
		if (!confirmPassword) {
			return 'Please confirm your password'
		}
		if (password !== confirmPassword) {
			return 'Passwords do not match'
		}
		return undefined
	}

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const username = e.target.value
		setFormState((prev) => ({
			...prev,
			username,
			errors: {
				...prev.errors,
				username: undefined,
			},
		}))
	}

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const password = e.target.value
		const strength = calculatePasswordStrength(password)
		setFormState((prev) => ({
			...prev,
			password,
			passwordStrength: strength,
			errors: {
				...prev.errors,
				password: undefined,
			},
		}))
	}

	const handleConfirmPasswordChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const confirmPassword = e.target.value
		setFormState((prev) => ({
			...prev,
			confirmPassword,
			errors: {
				...prev.errors,
				confirmPassword: undefined,
			},
		}))
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const usernameError = validateUsername(formState.username)
		const passwordError = validatePassword(formState.password)
		const confirmPasswordError = validateConfirmPassword(
			formState.password,
			formState.confirmPassword,
		)

		if (usernameError || passwordError || confirmPasswordError) {
			setFormState((prev) => ({
				...prev,
				errors: {
					username: usernameError,
					password: passwordError,
					confirmPassword: confirmPasswordError,
				},
			}))
			return
		}

		setFormState((prev) => ({
			...prev,
			isSubmitting: true,
			errors: {},
		}))

		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username: formState.username,
					password: formState.password,
					confirmPassword: formState.confirmPassword,
				}),
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || 'Registration failed')
			}

			router.push('/')
		} catch (error) {
			setFormState((prev) => ({
				...prev,
				isSubmitting: false,
				errors: {
					form:
						error instanceof Error
							? error.message
							: 'An unexpected error occurred',
				},
			}))
		}
	}

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
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								type="text"
								value={formState.username}
								onChange={handleUsernameChange}
								autoComplete="username"
								aria-invalid={!!formState.errors.username}
								disabled={formState.isSubmitting}
							/>
							{formState.errors.username && (
								<p className="text-sm text-destructive">
									{formState.errors.username}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={formState.password}
								onChange={handlePasswordChange}
								autoComplete="new-password"
								aria-invalid={!!formState.errors.password}
								disabled={formState.isSubmitting}
							/>
							{formState.errors.password && (
								<p className="text-sm text-destructive">
									{formState.errors.password}
								</p>
							)}
							{formState.password && (
								<>
									<PasswordStrengthIndicator
										strength={formState.passwordStrength}
									/>
									<PasswordRequirements requirements={passwordRequirements} />
								</>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm Password</Label>
							<Input
								id="confirmPassword"
								type="password"
								value={formState.confirmPassword}
								onChange={handleConfirmPasswordChange}
								autoComplete="new-password"
								aria-invalid={!!formState.errors.confirmPassword}
								disabled={formState.isSubmitting}
							/>
							{formState.errors.confirmPassword && (
								<p className="text-sm text-destructive">
									{formState.errors.confirmPassword}
								</p>
							)}
						</div>

						{formState.errors.form && (
							<Alert variant="destructive">
								<AlertDescription>{formState.errors.form}</AlertDescription>
							</Alert>
						)}

						<Button
							type="submit"
							className="w-full"
							disabled={formState.isSubmitting}
						>
							{formState.isSubmitting
								? 'Creating account...'
								: 'Create account'}
						</Button>

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
