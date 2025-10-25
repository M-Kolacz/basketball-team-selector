'use client'

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Pencil, Trash2 } from 'lucide-react'
import { useActionState } from 'react'
import {
	POSITION_LABELS,
	SKILL_TIER_LABELS,
	SKILL_TIER_COLORS,
} from '#app/app/players/constants'
import { Badge } from '#app/components/ui/badge'
import { Button } from '#app/components/ui/button'
import { TableCell, TableRow } from '#app/components/ui/table'
import { deletePlayer, type Players } from '#app/lib/actions/players'
import { DeletePlayerSchema } from '#app/lib/validations/player'

type Player = Players[number]

type PlayerRowProps = {
	player: Player
	isAdmin: boolean
	onEdit?: (player: Player) => void
}

export function PlayerRow({ player, isAdmin, onEdit }: PlayerRowProps) {
	const [lastResult, formAction, isSubmitting] = useActionState(
		deletePlayer,
		undefined,
	)
	const [form, fields] = useForm({
		lastResult: lastResult?.result,
		defaultValue: {
			id: player.id,
		},
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: DeletePlayerSchema })
		},
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	})

	return (
		<TableRow>
			<TableCell className="font-medium">{player.name}</TableCell>

			{isAdmin && (
				<TableCell>
					<Badge
						variant="secondary"
						className={SKILL_TIER_COLORS[player.skillTier]}
					>
						{SKILL_TIER_LABELS[player.skillTier]}
					</Badge>
				</TableCell>
			)}

			{isAdmin && (
				<TableCell>
					<div className="flex flex-wrap gap-1">
						{player.positions.map((pos) => (
							<Badge key={pos} variant="outline">
								{POSITION_LABELS[pos]}
							</Badge>
						))}
					</div>
				</TableCell>
			)}

			{isAdmin && (
				<TableCell className="text-sm text-muted-foreground">
					{player.createdAt.toString()}
				</TableCell>
			)}

			{isAdmin && (
				<TableCell>
					<div className="flex gap-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onEdit?.(player)}
							aria-label={`Edit ${player.name}`}
						>
							<Pencil className="h-4 w-4" />
						</Button>
						<form action={formAction} {...getFormProps(form)}>
							<input
								{...getInputProps(fields.id, {
									type: 'hidden',
								})}
							/>
							<Button
								variant="ghost"
								size="sm"
								disabled={isSubmitting}
								type="submit"
								aria-label={`Delete ${player.name}`}
								className="text-destructive hover:text-destructive"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</form>
					</div>
				</TableCell>
			)}
		</TableRow>
	)
}
