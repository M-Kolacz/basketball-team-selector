'use client'

import { useState } from 'react'
import { GameScoreCard } from '#app/app/games/[id]/components/game-score-card'
import { GameScoreForm } from '#app/app/games/[id]/components/game-score-form'
import { Button } from '#app/components/ui/button'
import { type GameSession } from '#app/lib/actions/game-sessions'

type GameScoresSectionProps = {
	gameSessionId: GameSession['id']
	games: GameSession['games']
	teams: NonNullable<GameSession['selectedProposition']>['teams'] | null
	isAdmin: boolean
}

export function GameScoresSection({
	gameSessionId,
	games,
	teams,
	isAdmin,
}: GameScoresSectionProps) {
	const [showAddForm, setShowAddForm] = useState(false)

	if (!isAdmin) {
		return null
	}

	// Can only add games if teams are selected
	const canAddGames = teams !== null && teams.length === 2

	return (
		<section className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Game Scores</h2>
				{canAddGames && !showAddForm && (
					<Button onClick={() => setShowAddForm(true)}>Add New Game</Button>
				)}
			</div>

			{showAddForm && canAddGames && (
				<GameScoreForm
					gameSessionId={gameSessionId}
					teams={teams}
					onCancel={() => setShowAddForm(false)}
				/>
			)}

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
						/>
					))}
				</div>
			)}
		</section>
	)
}
