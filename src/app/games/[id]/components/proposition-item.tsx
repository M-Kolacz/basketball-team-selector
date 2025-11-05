'use client'

import {
	DndContext,
	DragOverlay,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
	type DragStartEvent,
} from '@dnd-kit/core'
import { useState } from 'react'
import { SavePropositionForm } from '#app/app/games/[id]/components/save-proposition-form'
import { SelectPropositionButton } from '#app/app/games/[id]/components/select-proposition-button'
import { TeamCard } from '#app/app/games/[id]/components/team-card'
import { type GameSession } from '#app/lib/actions/game-sessions'

type PropositionItemProps = {
	proposition: GameSession['propositions'][number]
	propIndex: number
	gameSessionId: GameSession['id']
	hasSelectedProposition: boolean
	isAdmin: boolean
}

export const PropositionItem = ({
	proposition: initialProposition,
	propIndex,
	gameSessionId,
	hasSelectedProposition,
	isAdmin,
}: PropositionItemProps) => {
	const [proposition, setProposition] =
		useState<GameSession['propositions'][number]>(initialProposition)
	const [activeId, setActiveId] = useState<string | number | null>(null)
	const [hasChanges, setHasChanges] = useState(false)

	const sensors = useSensors(useSensor(PointerSensor))

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id)
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		setActiveId(null)

		if (!over) return

		const activeParts = String(active.id).split('::')
		const overParts = String(over.id).split('::')

		if (activeParts.length !== 3 || overParts.length !== 3) return

		const [activePropositionId, activeTeamId, activePlayerId] = activeParts
		const [overPropositionId, overTeamId] = overParts

		if (activePropositionId !== overPropositionId) return
		if (activePropositionId !== proposition.id) return

		if (activeTeamId === overTeamId) return

		const sourceTeam = proposition.teams.find((t) => t.id === activeTeamId)
		const targetTeam = proposition.teams.find((t) => t.id === overTeamId)

		if (!sourceTeam || !targetTeam) return

		const player = sourceTeam.players.find((p) => p.id === activePlayerId)
		if (!player) return

		const updatedProposition = {
			...proposition,
			teams: proposition.teams.map((team) => {
				if (team.id === activeTeamId) {
					return {
						...team,
						players: team.players.filter((p) => p.id !== activePlayerId),
					}
				}
				if (team.id === overTeamId) {
					return {
						...team,
						players: [...team.players, player],
					}
				}
				return team
			}),
		}

		setProposition(updatedProposition)
		setHasChanges(true)
	}

	const getActivePlayer = (activeId: string | number | null) => {
		if (!activeId) return null

		const [ignoredPropositionId, ignoredTeamId, playerId] =
			String(activeId).split('::')

		if (!playerId) return null

		return (
			proposition.teams
				.flatMap((t) => t.players)
				.find((p) => p.id === playerId) || null
		)
	}

	const activePlayer = getActivePlayer(activeId)

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold">Proposition {propIndex + 1}</h3>
					{hasChanges && isAdmin && (
						<SavePropositionForm updatedTeams={proposition.teams} />
					)}
				</div>
				<div className="grid gap-6 md:grid-cols-2">
					{proposition.teams.map((team) => (
						<TeamCard
							key={team.id}
							team={team}
							teamLabel={team.name}
							propositionId={proposition.id}
							isAdmin={isAdmin}
						/>
					))}
				</div>
				{!hasSelectedProposition && isAdmin && (
					<SelectPropositionButton
						gameSessionId={gameSessionId}
						propositionId={proposition.id}
					/>
				)}
			</div>
			<DragOverlay>
				{activePlayer ? (
					<div className="flex cursor-grabbing items-center gap-2 rounded-lg border bg-card p-3 shadow-lg">
						<div className="flex-1">
							<div className="font-medium">{activePlayer.name}</div>
						</div>
					</div>
				) : null}
			</DragOverlay>
		</DndContext>
	)
}
