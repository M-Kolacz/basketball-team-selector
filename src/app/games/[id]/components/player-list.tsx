'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { PlayerBadge } from '#app/app/games/[id]/components/player-badge'

type PlayerListProps = {
	players: Array<{ id: string; name: string }>
	teamId: string
	propositionId: string
	isAdmin: boolean
}

export const PlayerList = ({
	players,
	teamId,
	isAdmin,
	propositionId,
}: PlayerListProps) => {
	const dropId = `${propositionId}::${teamId}::drop`
	const { setNodeRef, isOver } = useDroppable({ id: dropId })

	return (
		<SortableContext
			items={players.map((p) => `${propositionId}::${teamId}::${p.id}`)}
			strategy={verticalListSortingStrategy}
		>
			<div
				ref={setNodeRef}
				className={`grid gap-2 sm:grid-cols-2 ${isOver ? 'bg-accent/50' : ''}`}
			>
				{players.map((player) => (
					<PlayerBadge
						key={player.id}
						player={player}
						propositionId={propositionId}
						teamId={teamId}
						isAdmin={isAdmin}
					/>
				))}
			</div>
		</SortableContext>
	)
}
