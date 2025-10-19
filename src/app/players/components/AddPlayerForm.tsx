'use client'

import {
	getCollectionProps,
	getFormProps,
	getInputProps,
	useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { ArrowUp, ArrowDown } from 'lucide-react'
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

const positions: Position[] = ['PG', 'SG', 'SF', 'PF', 'C']
const skillTiers: SkillTier[] = ['S', 'A', 'B', 'C', 'D']

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

	return (
		<div className="mb-6 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
			<Button
				onClick={() => setIsExpanded(!isExpanded)}
				aria-expanded={isExpanded}
			>
				<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
					Add New Player
				</h2>
				{isExpanded ? <ArrowUp /> : <ArrowDown />}
			</Button>

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

					<div className="flex justify-center gap-4">
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
