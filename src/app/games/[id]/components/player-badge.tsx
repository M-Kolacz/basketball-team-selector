import { type PlayerViewModel } from '#app/app/games/[id]/types'

type PlayerBadgeProps = {
	player: PlayerViewModel
}

export function PlayerBadge({ player }: PlayerBadgeProps) {
	return (
		<div className="flex items-center gap-2 rounded-lg border bg-card p-3">
			<div className="flex-1">
				<div className="font-medium">{player.name}</div>
			</div>
		</div>
	)
}
