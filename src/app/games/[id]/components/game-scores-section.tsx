'use client'

import { AddGameScoreForm } from '#app/app/games/[id]/components/add-game-score-form'
import { GameScoreCard } from '#app/app/games/[id]/components/game-score-card'
import { type GameSession } from '#app/lib/actions/game-sessions'

type GameScoresSectionProps = {
	gameSessionId: GameSession['id']
	games: GameSession['games']
	teams: NonNullable<GameSession['selectedProposition']>['teams'] | null
	isAdmin: boolean
}

export const GameScoresSection = ({
	gameSessionId,
	games,
	teams,
	isAdmin,
}: GameScoresSectionProps) => {
	const canAddGames = isAdmin && teams !== null && teams.length >= 2

	return (
		<section className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Game Scores</h2>
				{canAddGames && (
					<AddGameScoreForm gameSessionId={gameSessionId} teams={teams} />
				)}
			</div>

			{games.length === 0 ? (
				<div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
					{canAddGames
						? 'No game scores recorded yet. Click "Add New Game" to record the first game.'
						: 'Select a proposition with teams first to record game scores.'}
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{games.map((game, index) => (
						<GameScoreCard
							key={index}
							gameSessionId={gameSessionId}
							gameIndex={index}
							game={game}
							isAdmin={isAdmin}
							teams={teams}
						/>
					))}
				</div>
			)}
		</section>
	)
}
