import type { PlayerViewModel } from '../types'
import { PlayerBadge } from './player-badge'

type PlayerListProps = {
	players: PlayerViewModel[]
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
