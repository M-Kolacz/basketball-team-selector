import type {
	PasswordStrength,
	PasswordRequirementCheck,
} from '#app/types/registration'

export function calculatePasswordStrength(password: string): PasswordStrength {
	const checks = checkPasswordRequirements(password)

	let score = 0
	if (checks.minLength) score++
	if (checks.hasUpperCase) score++
	if (checks.hasLowerCase) score++
	if (checks.hasNumber) score++
	if (checks.hasSpecialChar) score++

	const strengthMap: Record<
		number,
		Pick<PasswordStrength, 'label' | 'color' | 'percentage'>
	> = {
		0: { label: 'Very Weak', color: 'red', percentage: 20 },
		1: { label: 'Very Weak', color: 'red', percentage: 20 },
		2: { label: 'Weak', color: 'orange', percentage: 40 },
		3: { label: 'Fair', color: 'yellow', percentage: 60 },
		4: { label: 'Good', color: 'blue', percentage: 80 },
		5: { label: 'Strong', color: 'green', percentage: 100 },
	}

	const strength = strengthMap[score]

	return {
		score: score as 0 | 1 | 2 | 3 | 4,
		label: strength.label,
		color: strength.color,
		percentage: strength.percentage,
	}
}

export function checkPasswordRequirements(
	password: string,
): PasswordRequirementCheck {
	return {
		minLength: password.length >= 8,
		hasUpperCase: /[A-Z]/.test(password),
		hasLowerCase: /[a-z]/.test(password),
		hasNumber: /[0-9]/.test(password),
		hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
	}
}
