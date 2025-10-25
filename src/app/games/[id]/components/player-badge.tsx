import { type GameSession } from '#app/lib/actions/game-sessions'

type PlayerBadgeProps = {
	player: NonNullable<
		GameSession['selectedProposition']
	>['teams'][number]['players'][number]
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
