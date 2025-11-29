import { PropositionItem } from '#app/app/games/[id]/components/proposition-item'
import { type GameSession } from '#app/lib/actions/game-sessions'

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
	return (
		<section className="space-y-4">
			<h2 className="text-2xl font-bold">Generated Propositions</h2>
			<div className="space-y-8">
				{propositions.map((proposition, propIndex) => (
					<PropositionItem
						key={proposition.id}
						proposition={proposition}
						propIndex={propIndex}
						gameSessionId={gameSessionId}
						hasSelectedProposition={hasSelectedProposition}
					/>
				))}
			</div>
		</section>
	)
}
