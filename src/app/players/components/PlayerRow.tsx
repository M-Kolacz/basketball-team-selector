import {
	POSITION_LABELS,
	SKILL_TIER_LABELS,
	SKILL_TIER_COLORS,
} from '#app/app/players/constants'
import { formatDateTime } from '#app/app/players/utils'
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
		<tr className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
			{isAdmin && onSelect && (
				<td className="px-4 py-3">
					<input
						type="checkbox"
						checked={isSelected}
						onChange={(e) => onSelect(player.id, e.target.checked)}
						className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
						aria-label={`Select ${player.name}`}
					/>
				</td>
			)}

			<td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
				{player.name}
			</td>

			{isAdmin && adminPlayer && (
				<td className="px-4 py-3">
					<span
						className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${SKILL_TIER_COLORS[adminPlayer.skillTier]}`}
					>
						{SKILL_TIER_LABELS[adminPlayer.skillTier]}
					</span>
				</td>
			)}

			{isAdmin && adminPlayer && (
				<td className="px-4 py-3">
					<div className="flex flex-wrap gap-1">
						{adminPlayer.positions.map((pos) => (
							<span
								key={pos}
								className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
							>
								{POSITION_LABELS[pos]}
							</span>
						))}
					</div>
				</td>
			)}

			{isAdmin && (
				<td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
					{formatDateTime(player.createdAt)}
				</td>
			)}

			{isAdmin && adminPlayer && (
				<td className="px-4 py-3">
					<div className="flex gap-2">
						<button
							onClick={() => onEdit?.(adminPlayer)}
							className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
							aria-label={`Edit ${player.name}`}
						>
							Edit
						</button>
						<button
							onClick={() => onDelete?.(player.id)}
							className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
							aria-label={`Delete ${player.name}`}
						>
							Delete
						</button>
					</div>
				</td>
			)}
		</tr>
	)
}
