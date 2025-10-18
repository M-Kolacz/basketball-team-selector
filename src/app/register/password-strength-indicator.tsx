import { type PasswordStrength } from '#app/types/registration'

type PasswordStrengthIndicatorProps = {
	strength: PasswordStrength
}

export function PasswordStrengthIndicator({
	strength,
}: PasswordStrengthIndicatorProps) {
	const colorClasses = {
		red: 'bg-red-500',
		orange: 'bg-orange-500',
		yellow: 'bg-yellow-500',
		blue: 'bg-blue-500',
		green: 'bg-green-500',
	}

	const textColorClasses = {
		red: 'text-red-600',
		orange: 'text-orange-600',
		yellow: 'text-yellow-600',
		blue: 'text-blue-600',
		green: 'text-green-600',
	}

	return (
		<div className="mt-2 space-y-1">
			<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
				<div
					className={`h-full transition-all duration-300 ${colorClasses[strength.color]}`}
					style={{ width: `${strength.percentage}%` }}
				/>
			</div>
			<p className={`text-sm font-medium ${textColorClasses[strength.color]}`}>
				{strength.label}
			</p>
		</div>
	)
}
