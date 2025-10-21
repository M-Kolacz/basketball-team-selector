import { type PlayerViewModel } from '#app/app/games/[id]/types'
import { Badge } from '#app/components/ui/badge'

type PlayerBadgeProps = {
	player: PlayerViewModel
}

const skillTierColors = {
	S: 'bg-purple-500 text-white hover:bg-purple-600',
	A: 'bg-blue-500 text-white hover:bg-blue-600',
	B: 'bg-green-500 text-white hover:bg-green-600',
	C: 'bg-yellow-500 text-white hover:bg-yellow-600',
	D: 'bg-gray-500 text-white hover:bg-gray-600',
} as const

export function PlayerBadge({ player }: PlayerBadgeProps) {
	return (
		<div className="flex items-center gap-2 rounded-lg border bg-card p-3">
			<div className="flex-1">
				<div className="font-medium">{player.name}</div>
				<div className="mt-1 flex flex-wrap gap-1 text-xs text-muted-foreground">
					{player.positions.join(', ')}
				</div>
			</div>
			<Badge className={skillTierColors[player.skillTier]}>
				{player.skillTier}
			</Badge>
		</div>
	)
}
