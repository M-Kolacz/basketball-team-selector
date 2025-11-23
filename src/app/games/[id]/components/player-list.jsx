'use client';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { PlayerBadge } from '#app/app/games/[id]/components/player-badge';
export var PlayerList = function (_a) {
    var players = _a.players, teamId = _a.teamId, isAdmin = _a.isAdmin, propositionId = _a.propositionId;
    var dropId = "".concat(propositionId, "::").concat(teamId, "::drop");
    var _b = useDroppable({ id: dropId }), setNodeRef = _b.setNodeRef, isOver = _b.isOver;
    return (<SortableContext items={players.map(function (p) { return "".concat(propositionId, "::").concat(teamId, "::").concat(p.id); })} strategy={verticalListSortingStrategy}>
			<div ref={setNodeRef} className={"grid gap-2 sm:grid-cols-2 ".concat(isOver ? 'bg-accent/50' : '')}>
				{players.map(function (player) { return (<PlayerBadge key={player.id} player={player} propositionId={propositionId} teamId={teamId} isAdmin={isAdmin}/>); })}
			</div>
		</SortableContext>);
};
