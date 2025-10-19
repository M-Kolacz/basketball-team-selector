'use client'

import {
	getCollectionProps,
	getFormProps,
	getInputProps,
	useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { useActionState, useState } from 'react'
import { createPlayer } from '#app/actions/players'
import { SKILL_TIER_LABELS } from '#app/app/players/constants'
import { Button } from '#app/components/ui/button'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '#app/components/ui/field'
import { Input } from '#app/components/ui/input'
import { CreatePlayerSchema } from '#app/lib/validations/player'
import { type Position, type SkillTier } from '#app/types/dto'

// TODO: Use existing form and action code as reference

export function AddPlayerForm() {
	const [isExpanded, setIsExpanded] = useState(false)
	const [lastResult, formAction, isSubmitting] = useActionState(
		createPlayer,
		undefined,
	)

	const [form, fields] = useForm({
		lastResult: lastResult?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: CreatePlayerSchema })
		},
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	const positions: Position[] = ['PG', 'SG', 'SF', 'PF', 'C']
	const skillTiers: SkillTier[] = ['S', 'A', 'B', 'C', 'D']

	return (
		<div className="mb-6 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="flex w-full items-center justify-between rounded-t-lg px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50"
				aria-expanded={isExpanded}
			>
				<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
					Add New Player
				</h2>
				<svg
					className={`h-5 w-5 text-gray-500 transition-transform dark:text-gray-400 ${
						isExpanded ? 'rotate-180' : ''
					}`}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{isExpanded && (
				<form action={formAction} {...getFormProps(form)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor={fields.name.id}>Player name</FieldLabel>
							<Input
								{...getInputProps(fields.name, { type: 'text' })}
								defaultValue={fields.name.defaultValue}
								disabled={isSubmitting}
								autoFocus
							/>
							<FieldError errors={fields.name.errors} />
						</Field>
						<Field>
							<FieldLabel htmlFor={fields.skillTier.id}>Skill tier</FieldLabel>
							<select name={fields.skillTier.name} id={fields.skillTier.id}>
								{skillTiers.map((tier) => {
									return (
										<option key={tier} value={tier}>
											{SKILL_TIER_LABELS[tier]}
										</option>
									)
								})}
							</select>
							<FieldError errors={fields.skillTier.errors} />
						</Field>
						<Field orientation={'horizontal'}>
							{getCollectionProps(fields.positions, {
								type: 'checkbox',
								options: positions,
							}).map((position) => (
								<label key={position.id} htmlFor={position.id}>
									<input {...position} key={position.key} />
									<span>{position.value}</span>
								</label>
							))}
							<FieldError errors={fields.name.errors} />
						</Field>
						<FieldError errors={form.errors} />
					</FieldGroup>

					<div>
						<Button variant="outline" type="reset" disabled={isSubmitting}>
							Cancel
						</Button>

						<Button variant="default" type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Adding...' : 'Add Player'}
						</Button>
					</div>
				</form>
			)}
		</div>
	)
}
