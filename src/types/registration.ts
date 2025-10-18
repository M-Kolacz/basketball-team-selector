import type { UserDto } from '#app/types/dto'

export type RegistrationFormState = {
	username: string
	password: string
	confirmPassword: string
	isSubmitting: boolean
	errors: RegistrationFormErrors
	passwordStrength: PasswordStrength
}

export type RegistrationFormErrors = {
	username?: string
	password?: string
	confirmPassword?: string
	form?: string
}

export type PasswordStrength = {
	score: 0 | 1 | 2 | 3 | 4
	label: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong'
	color: 'red' | 'orange' | 'yellow' | 'blue' | 'green'
	percentage: number
}

export type PasswordRequirementCheck = {
	minLength: boolean
	hasUpperCase: boolean
	hasLowerCase: boolean
	hasNumber: boolean
	hasSpecialChar: boolean
}

export type RegistrationFormProps = {
	onSuccess?: (user: UserDto) => void
	redirectUrl?: string
}
