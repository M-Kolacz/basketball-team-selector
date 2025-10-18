import  { type PasswordRequirementCheck } from '#app/types/registration'

type PasswordRequirementsProps = {
	requirements: PasswordRequirementCheck
}

type RequirementItemProps = {
	met: boolean
	text: string
}

function RequirementItem({ met, text }: RequirementItemProps) {
	return (
		<li className="flex items-center gap-2">
			<span
				className={`flex h-4 w-4 items-center justify-center rounded-full text-xs ${
					met
						? 'bg-green-500 text-white'
						: 'border-2 border-muted-foreground/30'
				}`}
			>
				{met && '✓'}
			</span>
			<span
				className={`text-sm ${met ? 'text-foreground' : 'text-muted-foreground'}`}
			>
				{text}
			</span>
		</li>
	)
}

export function PasswordRequirements({
	requirements,
}: PasswordRequirementsProps) {
	return (
		<div className="mt-3">
			<p className="mb-2 text-sm font-medium">Password must contain:</p>
			<ul className="space-y-1.5">
				<RequirementItem
					met={requirements.minLength}
					text="At least 8 characters"
				/>
				<RequirementItem
					met={requirements.hasUpperCase}
					text="One uppercase letter"
				/>
				<RequirementItem
					met={requirements.hasLowerCase}
					text="One lowercase letter"
				/>
				<RequirementItem met={requirements.hasNumber} text="One number" />
				<RequirementItem
					met={requirements.hasSpecialChar}
					text="One special character (!@#$%^&*)"
				/>
			</ul>
		</div>
	)
}
