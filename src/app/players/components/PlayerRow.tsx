import { Pencil, Trash2 } from 'lucide-react'
import {
	POSITION_LABELS,
	SKILL_TIER_LABELS,
	SKILL_TIER_COLORS,
} from '#app/app/players/constants'
import { formatDateTime } from '#app/app/players/utils'
import { Badge } from '#app/components/ui/badge'
import { Button } from '#app/components/ui/button'
import { Checkbox } from '#app/components/ui/checkbox'
import { TableCell, TableRow } from '#app/components/ui/table'
import { type PlayerAdminDto, type PlayerUserDto } from '#app/types/dto'

type PlayerRowProps = {
	player: PlayerAdminDto | PlayerUserDto
	isAdmin: boolean
	isSelected?: boolean
	onSelect?: (playerId: string, selected: boolean) => void
	onEdit?: (player: PlayerAdminDto) => void
	onDelete?: (playerId: string) => void
}

export function PlayerRow({
	player,
	isAdmin,
	isSelected = false,
	onSelect,
	onEdit,
	onDelete,
}: PlayerRowProps) {
	const adminPlayer = isAdmin ? (player as PlayerAdminDto) : null

	return (
		<TableRow>
			{isAdmin && onSelect && (
				<TableCell>
					<Checkbox
						checked={isSelected}
						onCheckedChange={(checked) =>
							onSelect(player.id, checked === true)
						}
						aria-label={`Select ${player.name}`}
					/>
				</TableCell>
			)}

			<TableCell className="font-medium">{player.name}</TableCell>

			{isAdmin && adminPlayer && (
				<TableCell>
					<Badge
						variant="secondary"
						className={SKILL_TIER_COLORS[adminPlayer.skillTier]}
					>
						{SKILL_TIER_LABELS[adminPlayer.skillTier]}
					</Badge>
				</TableCell>
			)}

			{isAdmin && adminPlayer && (
				<TableCell>
					<div className="flex flex-wrap gap-1">
						{adminPlayer.positions.map((pos) => (
							<Badge key={pos} variant="outline">
								{POSITION_LABELS[pos]}
							</Badge>
						))}
					</div>
				</TableCell>
			)}

			{isAdmin && (
				<TableCell className="text-sm text-muted-foreground">
					{formatDateTime(player.createdAt)}
				</TableCell>
			)}

			{isAdmin && adminPlayer && (
				<TableCell>
					<div className="flex gap-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onEdit?.(adminPlayer)}
							aria-label={`Edit ${player.name}`}
						>
							<Pencil className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onDelete?.(player.id)}
							aria-label={`Delete ${player.name}`}
							className="text-destructive hover:text-destructive"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				</TableCell>
			)}
		</TableRow>
	)
}
