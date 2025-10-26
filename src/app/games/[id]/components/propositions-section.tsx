import { SelectPropositionButton } from '#app/app/games/[id]/components/select-proposition-button'
import { TeamCard } from '#app/app/games/[id]/components/team-card'
import { type GameSession } from '#app/lib/actions/game-sessions'

type PropositionsSectionProps = {
	propositions: GameSession['propositions']
	gameSessionId: string
	hasSelectedProposition: boolean
}

export function PropositionsSection({
	propositions,
	gameSessionId,
	hasSelectedProposition,
}: PropositionsSectionProps) {
	return (
		<section className="space-y-4">
			<h2 className="text-2xl font-bold">Generated Propositions</h2>
			<div className="space-y-8">
				{propositions.map((proposition, propIndex) => (
					<div key={proposition.id} className="space-y-4">
						<h3 className="text-lg font-semibold">
							Proposition {propIndex + 1}
						</h3>
						<div className="grid gap-6 md:grid-cols-2">
							{proposition.teams.map((team, teamIndex) => (
								<TeamCard
									key={team.id}
									team={team}
									teamLabel={teamIndex === 0 ? 'Team A' : 'Team B'}
								/>
							))}
						</div>
						{!hasSelectedProposition && (
							<SelectPropositionButton
								gameSessionId={gameSessionId}
								propositionId={proposition.id}
							/>
						)}
					</div>
				))}
			</div>
		</section>
	)
}
