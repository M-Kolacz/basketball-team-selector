import { type UserDto } from '#app/types/dto'

export type LoginFormState = {
	username: string
	password: string
	isSubmitting: boolean
	errors: LoginFormErrors
}

export type LoginFormErrors = {
	username?: string
	password?: string
	form?: string
}

export type LoginFormProps = {
	onSuccess?: (user: UserDto) => void
	redirectUrl?: string
}
