'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useOptionalUser } from '#app/lib/contexts/user-context'
import { cn } from '#app/lib/utils'

type PlayerBadgeProps = {
	player: { id: string; name: string }
	propositionId: string
	teamId: string
}

export const PlayerBadge = ({
	player,
	propositionId,
	teamId,
}: PlayerBadgeProps) => {
	const user = useOptionalUser()
	const isAdmin = user?.role === 'admin'
	const sortableId = `${propositionId}::${teamId}::${player.id}`
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: sortableId, disabled: !isAdmin })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className={cn('flex items-center gap-2 rounded-lg border bg-card p-3', {
				'cursor-grab active:cursor-grabbing': isAdmin,
			})}
		>
			<div className="flex-1">
				<div className="font-medium">{player.name}</div>
			</div>
		</div>
	)
}
