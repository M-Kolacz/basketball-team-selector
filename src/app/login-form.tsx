'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { Button } from '#app/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'
import { Input } from '#app/components/ui/input'
import { Label } from '#app/components/ui/label'
import { type LoginCommandDto, type LoginResponseDto } from '#app/types/dto'
import { type LoginFormErrors } from '#app/types/login'

export function LoginForm() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [errors, setErrors] = useState<LoginFormErrors>({})
	const router = useRouter()

	const validateForm = (): boolean => {
		const newErrors: LoginFormErrors = {}

		if (!username.trim()) {
			newErrors.username = 'Username is required'
		}

		if (!password.trim()) {
			newErrors.password = 'Password is required'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		if (!validateForm()) return

		setIsSubmitting(true)
		setErrors({})

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password } satisfies LoginCommandDto),
				credentials: 'include',
			})

			if (!response.ok) {
				if (response.status === 401) {
					setErrors({ form: 'Invalid username or password' })
					setPassword('')
				} else if (response.status === 422) {
					setErrors({ form: 'Please fill in all required fields' })
				} else {
					setErrors({ form: 'An error occurred. Please try again.' })
				}
				return
			}

			const data: LoginResponseDto = await response.json()
			router.push('/games')
		} catch (error) {
			setErrors({ form: 'Network error. Please check your connection.' })
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle className="text-2xl">Login</CardTitle>
				<CardDescription>
					Enter your credentials to access the Basketball Team Selector
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} aria-label="Login form">
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								type="text"
								value={username}
								onChange={(e) => {
									setUsername(e.target.value)
									if (errors.username) {
										setErrors({ ...errors, username: undefined })
									}
								}}
								onBlur={() => {
									if (!username.trim()) {
										setErrors({ ...errors, username: 'Username is required' })
									}
								}}
								disabled={isSubmitting}
								aria-invalid={!!errors.username}
								aria-describedby={
									errors.username ? 'username-error' : undefined
								}
								autoFocus
							/>
							{errors.username && (
								<p
									id="username-error"
									className="text-sm text-destructive"
									role="alert"
								>
									{errors.username}
								</p>
							)}
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => {
									setPassword(e.target.value)
									if (errors.password) {
										setErrors({ ...errors, password: undefined })
									}
								}}
								onBlur={() => {
									if (!password.trim()) {
										setErrors({ ...errors, password: 'Password is required' })
									}
								}}
								disabled={isSubmitting}
								aria-invalid={!!errors.password}
								aria-describedby={
									errors.password ? 'password-error' : undefined
								}
							/>
							{errors.password && (
								<p
									id="password-error"
									className="text-sm text-destructive"
									role="alert"
								>
									{errors.password}
								</p>
							)}
						</div>

						{errors.form && (
							<div
								className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
								role="alert"
								aria-live="polite"
							>
								{errors.form}
							</div>
						)}

						<Button type="submit" disabled={isSubmitting} className="w-full">
							{isSubmitting ? 'Logging in...' : 'Login'}
						</Button>

						<div className="text-center text-sm text-muted-foreground">
							Don&apos;t have an account?{' '}
							<Link
								href="/register"
								className="text-primary underline-offset-4 hover:underline"
							>
								Create new account
							</Link>
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
