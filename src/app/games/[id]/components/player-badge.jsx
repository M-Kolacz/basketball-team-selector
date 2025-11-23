'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '#app/lib/utils';
export var PlayerBadge = function (_a) {
    var player = _a.player, propositionId = _a.propositionId, teamId = _a.teamId, isAdmin = _a.isAdmin;
    var sortableId = "".concat(propositionId, "::").concat(teamId, "::").concat(player.id);
    var _b = useSortable({ id: sortableId, disabled: !isAdmin }), attributes = _b.attributes, listeners = _b.listeners, setNodeRef = _b.setNodeRef, transform = _b.transform, transition = _b.transition, isDragging = _b.isDragging;
    var style = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
        opacity: isDragging ? 0.5 : 1,
    };
    return (<div ref={setNodeRef} style={style} {...attributes} {...listeners} className={cn('flex items-center gap-2 rounded-lg border bg-card p-3', {
            'cursor-grab active:cursor-grabbing': isAdmin,
        })}>
			<div className="flex-1">
				<div className="font-medium">{player.name}</div>
			</div>
		</div>);
};
