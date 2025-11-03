'use client'

import { useState } from 'react'
import { PropositionItem } from '#app/app/games/[id]/components/proposition-item'
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

	const [isSaving, setIsSaving] = useState(false)
	const [hasChanges, setHasChanges] = useState(false)

	const handlePropositionChange = (
		propositionId: string,
		updatedProposition: GameSession['propositions'][number],
	) => {
		setTeamPropositions((previousPropositions) =>
			previousPropositions.map((prop) =>
				prop.id === propositionId ? updatedProposition : prop,
			),
		)
		setHasChanges(true)
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

	return (
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
					<PropositionItem
						key={composition.id}
						proposition={composition}
						propIndex={propIndex}
						gameSessionId={gameSessionId}
						hasSelectedProposition={hasSelectedProposition}
						onPropositionChange={handlePropositionChange}
					/>
				))}
			</div>
		</section>
	)
}
