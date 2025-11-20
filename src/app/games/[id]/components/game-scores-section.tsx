'use client'

import { parseWithZod } from '@conform-to/zod'
import { useOptimistic } from 'react'
import { AddGameScoreForm } from '#app/app/games/[id]/components/add-game-score-form'
import { GameScoreCard } from '#app/app/games/[id]/components/game-score-card'
import { type GameSession } from '#app/lib/actions/game-sessions'
import { GameResultSchema } from '#app/lib/validations/game-session'

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
	const [optimisticGameScores, addOptimisticGameScore] = useOptimistic<
		GameSession['games'],
		GameSession['games'][number]
	>(games, (currenntGames, newGame) => [...currenntGames, newGame])

	const addOptimisticScore = (formData: FormData) => {
		const submission = parseWithZod(formData, {
			schema: GameResultSchema,
		})
		if (submission.status !== 'success') return

		const { gameSessionId, scores } = submission.value
		addOptimisticGameScore({
			id: `temp-${Date.now()}`,
			createdAt: new Date(),
			updatedAt: new Date(),
			scores: scores.map((score) => ({
				id: `temp-${Date.now()}-${score.teamId}`,
				teamId: score.teamId,
				points: score.points,
				team: {
					name: teams?.find((team) => team.id === score.teamId)?.name ?? '',
				},
			})),
			gameSessionId,
		})
	}

	const canAddGames = isAdmin && teams !== null && teams.length >= 2

	return (
		<section className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Game Scores</h2>
				{canAddGames && (
					<AddGameScoreForm
						gameSessionId={gameSessionId}
						teams={teams}
						addOptimisticScore={addOptimisticScore}
					/>
				)}
			</div>

			{optimisticGameScores.length === 0 ? (
				<div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
					{canAddGames
						? 'No game scores recorded yet. Click "Add New Game" to record the first game.'
						: 'Select a proposition with teams first to record game scores.'}
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{optimisticGameScores.map((game, index) => (
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
