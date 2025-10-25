import { PlayerBadge } from '#app/app/games/[id]/components/player-badge'
import { type GameSession } from '#app/lib/actions/game-sessions.server'

type PlayerListProps = {
	players: NonNullable<
		GameSession['selectedProposition']
	>['teams'][number]['players']
}

export function PlayerList({ players }: PlayerListProps) {
	return (
		<div className="grid gap-2 sm:grid-cols-2">
			{players.map((player) => (
				<PlayerBadge key={player.id} player={player} />
			))}
		</div>
	)
}
