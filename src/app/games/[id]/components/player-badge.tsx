import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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
	const sortableId = `${propositionId}::${teamId}::${player.id}`
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: sortableId })

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
			className="flex cursor-grab items-center gap-2 rounded-lg border bg-card p-3 active:cursor-grabbing"
		>
			<div className="flex-1">
				<div className="font-medium">{player.name}</div>
			</div>
		</div>
	)
}
