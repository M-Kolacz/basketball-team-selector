'use client';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors, } from '@dnd-kit/core';
import { useState } from 'react';
import { SavePropositionForm } from '#app/app/games/[id]/components/save-proposition-form';
import { SelectPropositionButton } from '#app/app/games/[id]/components/select-proposition-button';
import { TeamCard } from '#app/app/games/[id]/components/team-card';
export var PropositionItem = function (_a) {
    var initialProposition = _a.proposition, propIndex = _a.propIndex, gameSessionId = _a.gameSessionId, hasSelectedProposition = _a.hasSelectedProposition, isAdmin = _a.isAdmin;
    var _b = useState(initialProposition), proposition = _b[0], setProposition = _b[1];
    var _c = useState(null), activeId = _c[0], setActiveId = _c[1];
    var _d = useState(false), hasChanges = _d[0], setHasChanges = _d[1];
    var sensors = useSensors(useSensor(PointerSensor));
    var handleDragStart = function (event) {
        setActiveId(event.active.id);
    };
    var handleDragEnd = function (event) {
        var active = event.active, over = event.over;
        setActiveId(null);
        if (!over)
            return;
        var activeParts = String(active.id).split('::');
        var overParts = String(over.id).split('::');
        if (activeParts.length !== 3 || overParts.length !== 3)
            return;
        var activePropositionId = activeParts[0], activeTeamId = activeParts[1], activePlayerId = activeParts[2];
        var overPropositionId = overParts[0], overTeamId = overParts[1];
        if (activePropositionId !== overPropositionId)
            return;
        if (activePropositionId !== proposition.id)
            return;
        if (activeTeamId === overTeamId)
            return;
        var sourceTeam = proposition.teams.find(function (t) { return t.id === activeTeamId; });
        var targetTeam = proposition.teams.find(function (t) { return t.id === overTeamId; });
        if (!sourceTeam || !targetTeam)
            return;
        var player = sourceTeam.players.find(function (p) { return p.id === activePlayerId; });
        if (!player)
            return;
        var updatedProposition = __assign(__assign({}, proposition), { teams: proposition.teams.map(function (team) {
                if (team.id === activeTeamId) {
                    return __assign(__assign({}, team), { players: team.players.filter(function (p) { return p.id !== activePlayerId; }) });
                }
                if (team.id === overTeamId) {
                    return __assign(__assign({}, team), { players: __spreadArray(__spreadArray([], team.players, true), [player], false) });
                }
                return team;
            }) });
        setProposition(updatedProposition);
        setHasChanges(true);
    };
    var getActivePlayer = function (activeId) {
        if (!activeId)
            return null;
        var _a = String(activeId).split('::'), ignoredPropositionId = _a[0], ignoredTeamId = _a[1], playerId = _a[2];
        if (!playerId)
            return null;
        return (proposition.teams
            .flatMap(function (t) { return t.players; })
            .find(function (p) { return p.id === playerId; }) || null);
    };
    var activePlayer = getActivePlayer(activeId);
    return (<DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold">Proposition {propIndex + 1}</h3>
					{hasChanges && isAdmin && (<SavePropositionForm key={JSON.stringify(proposition.teams)} updatedTeams={proposition.teams}/>)}
				</div>
				<div className="grid gap-6 md:grid-cols-2">
					{proposition.teams.map(function (team) { return (<TeamCard key={team.id} team={team} teamLabel={team.name} propositionId={proposition.id} isAdmin={isAdmin}/>); })}
				</div>
				{!hasSelectedProposition && isAdmin && (<SelectPropositionButton gameSessionId={gameSessionId} propositionId={proposition.id}/>)}
			</div>
			<DragOverlay>
				{activePlayer ? (<div className="flex cursor-grabbing items-center gap-2 rounded-lg border bg-card p-3 shadow-lg">
						<div className="flex-1">
							<div className="font-medium">{activePlayer.name}</div>
						</div>
					</div>) : null}
			</DragOverlay>
		</DndContext>);
};
