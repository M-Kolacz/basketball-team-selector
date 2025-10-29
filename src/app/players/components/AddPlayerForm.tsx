'use client'

import {
	getCollectionProps,
	getFormProps,
	getInputProps,
	useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { ChevronDown } from 'lucide-react'
import { useActionState, useState } from 'react'
import { SKILL_TIER_LABELS } from '#app/app/players/constants'
import { Button } from '#app/components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '#app/components/ui/collapsible'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '#app/components/ui/field'
import { Input } from '#app/components/ui/input'
import { createPlayer } from '#app/lib/actions/players'
import { type Position, type SkillTier } from '#app/lib/db.server'
import { cn } from '#app/lib/utils'
import { CreatePlayerSchema } from '#app/lib/validations/player'

const positions: Position[] = ['PG', 'SG', 'SF', 'PF', 'C']
const skillTiers: SkillTier[] = ['S', 'A', 'B', 'C', 'D']

export const AddPlayerForm = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [lastResult, formAction, isSubmitting] = useActionState(
		createPlayer,
		undefined,
	)

	const [form, fields] = useForm({
		lastResult: lastResult?.result,
		onValidate: ({ formData }) => parseWithZod(formData, { schema: CreatePlayerSchema }),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	return (
		<Card className="mb-6">
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<CardHeader className="p-4">
					<CollapsibleTrigger asChild>
						<Button
							variant="ghost"
							className="h-auto w-full justify-between p-0 hover:bg-transparent"
						>
							<CardTitle>Add New Player</CardTitle>
							<ChevronDown
								className={cn(
									'h-4 w-4 transition-transform',
									isOpen && 'rotate-180',
								)}
							/>
						</Button>
					</CollapsibleTrigger>
				</CardHeader>

				<CollapsibleContent>
					<CardContent className="pt-0">
						<form action={formAction} {...getFormProps(form)}>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor={fields.name.id}>Player name</FieldLabel>
									<Input
										{...getInputProps(fields.name, { type: 'text' })}
										disabled={isSubmitting}
									/>
									<FieldError errors={fields.name.errors} />
								</Field>

								<Field>
									<FieldLabel htmlFor={fields.skillTier.id}>
										Skill tier
									</FieldLabel>
									<select
										name={fields.skillTier.name}
										id={fields.skillTier.id}
										defaultValue="C"
										disabled={isSubmitting}
									>
										{skillTiers.map((tier) => (
											<option key={tier} value={tier}>
												{SKILL_TIER_LABELS[tier]}
											</option>
										))}
									</select>
									<FieldError errors={fields.skillTier.errors} />
								</Field>

								<Field orientation="horizontal">
									<FieldLabel>Positions</FieldLabel>
									{getCollectionProps(fields.positions, {
										type: 'checkbox',
										options: positions,
									}).map((position) => (
										<label key={position.id} htmlFor={position.id}>
											<input {...position} key={position.key} />
											<span>{position.value}</span>
										</label>
									))}
									<FieldError errors={fields.positions.errors} />
								</Field>

								<FieldError errors={form.errors} />
							</FieldGroup>

							<div className="flex justify-end gap-2 pt-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsOpen(false)}
									disabled={isSubmitting}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? 'Adding...' : 'Add Player'}
								</Button>
							</div>
						</form>
					</CardContent>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	)
};
