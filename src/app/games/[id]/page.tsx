import { GameDetailsHeader } from '#app/app/games/[id]/components/game-details-header'
import { GameScoresSection } from '#app/app/games/[id]/components/game-scores-section'
import { PropositionsSection } from '#app/app/games/[id]/components/propositions-section'
import { SelectedTeamsSection } from '#app/app/games/[id]/components/selected-teams-section'
import { getGameSession } from '#app/lib/actions/game-sessions'
import { getOptionalUser } from '#app/lib/auth.server'

type PageProps = {
	params: Promise<{ id: string }>
}

export default async function GameDetailsPage({ params }: PageProps) {
	const { id } = await params
	const gameSession = await getGameSession(id)

	const currentUser = await getOptionalUser()
	const isAdmin = currentUser?.role === 'admin'

	return (
		<main className="container mx-auto px-4 py-8">
			<div className="mx-auto max-w-7xl space-y-8">
				<GameDetailsHeader
					gameDatetime={gameSession.gameDatetime}
					description={gameSession.description}
				/>

				<PropositionsSection
					propositions={gameSession.propositions}
					gameSessionId={gameSession.id}
					hasSelectedProposition={gameSession.selectedProposition !== null}
				/>

				{gameSession.selectedProposition ? (
					<SelectedTeamsSection teams={gameSession.selectedProposition.teams} />
				) : (
					<div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
						No teams finalized yet
					</div>
				)}

				<GameScoresSection
					gameSessionId={gameSession.id}
					games={gameSession.games}
					teams={gameSession.selectedProposition?.teams ?? null}
					isAdmin={isAdmin}
				/>
			</div>
		</main>
	)
}
