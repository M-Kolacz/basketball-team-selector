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
import { SelectPropositionButton } from '#app/app/games/[id]/components/select-proposition-button'
import { TeamCard } from '#app/app/games/[id]/components/team-card'
import { Button } from '#app/components/ui/button'
import {
	type GameSession,
	updatePropositionTeams,
} from '#app/lib/actions/game-sessions'

type PropositionsSectionProps = {
	propositions: GameSession['propositions']
	gameSessionId: string
	hasSelectedProposition: boolean
}

export const PropositionsSection = ({
	propositions,
	gameSessionId,
	hasSelectedProposition,
}: PropositionsSectionProps) => {
	const [teamPropositions, setTeamPropositions] =
		useState<GameSession['propositions']>(propositions)

	const [activeId, setActiveId] = useState<string | number | null>(null)
	const [isSaving, setIsSaving] = useState(false)
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

		setTeamPropositions((previousPropositions) => {
			const updated = previousPropositions.map((prevProposition) => {
				if (prevProposition.id !== activePropositionId) return prevProposition

				if (activeTeamId === overTeamId) return prevProposition

				const sourceTeam = prevProposition.teams.find(
					(t) => t.id === activeTeamId,
				)
				const targetTeam = prevProposition.teams.find(
					(t) => t.id === overTeamId,
				)

				if (!sourceTeam || !targetTeam) return prevProposition

				const player = sourceTeam.players.find((p) => p.id === activePlayerId)
				if (!player) return prevProposition

				return {
					...prevProposition,
					teams: prevProposition.teams.map((team) => {
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
			})

			setHasChanges(true)
			return updated
		})
	}

	const handleSave = async () => {
		setIsSaving(true)
		try {
			for (const composition of teamPropositions) {
				const teamUpdates = composition.teams.map((team) => ({
					teamId: team.id,
					playerIds: team.players.map((p) => p.id),
				}))

				await updatePropositionTeams(composition.id, teamUpdates)
			}
			setHasChanges(false)
		} catch (error) {
			console.error('Failed to save team compositions:', error)
		} finally {
			setIsSaving(false)
		}
	}

	const getActivePlayer = (activeId: string | number | null) => {
		if (!activeId) return null

		const [ignoredPropositionId, ignoredTeamId, playerId] =
			String(activeId).split('::')

		if (!playerId) return null

		return (
			teamPropositions
				.flatMap((c) => c.teams)
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
			<section className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold">Generated Propositions</h2>
					{hasChanges && (
						<Button onClick={handleSave} disabled={isSaving}>
							{isSaving ? 'Saving...' : 'Save Changes'}
						</Button>
					)}
				</div>
				<div className="space-y-8">
					{teamPropositions.map((composition, propIndex) => (
						<div key={composition.id} className="space-y-4">
							<h3 className="text-lg font-semibold">
								Proposition {propIndex + 1}
							</h3>
							<div className="grid gap-6 md:grid-cols-2">
								{composition.teams.map((team, teamIndex) => (
									<TeamCard
										key={team.id}
										team={team}
										teamLabel={teamIndex === 0 ? 'Team A' : 'Team B'}
										propositionId={composition.id}
									/>
								))}
							</div>
							{!hasSelectedProposition && (
								<SelectPropositionButton
									gameSessionId={gameSessionId}
									propositionId={composition.id}
								/>
							)}
						</div>
					))}
				</div>
			</section>
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
