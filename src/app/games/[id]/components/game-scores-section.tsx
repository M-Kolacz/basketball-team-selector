import { GameScoreCard } from '#app/app/games/[id]/components/game-score-card'
import { type GameSession } from '#app/lib/actions/game-sessions.server'

type GameScoresSectionProps = {
	gameSessionId: GameSession['id']
	games: GameSession['games']
	isAdmin: boolean
}

export function GameScoresSection({
	gameSessionId,
	games,
	isAdmin,
}: GameScoresSectionProps) {
	if (!isAdmin) {
		return null
	}

	if (games.length === 0) {
		return (
			<section className="space-y-4">
				<h2 className="text-2xl font-bold">Game Scores</h2>
				<div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
					No game scores recorded yet
				</div>
			</section>
		)
	}

	return (
		<section className="space-y-4">
			<h2 className="text-2xl font-bold">Game Scores</h2>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{games.map((game, index) => (
					<GameScoreCard
						key={index}
						gameSessionId={gameSessionId}
						gameIndex={index}
						game={game}
						isAdmin={isAdmin}
					/>
				))}
			</div>
		</section>
	)
}
