'use client'

import { Edit } from 'lucide-react'
import { useState } from 'react'
import { ScoreInputForm } from '#app/app/games/[id]/components/score-input-form'
import { Button } from '#app/components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'
import { Spinner } from '#app/components/ui/spinner'
import { type GameSession } from '#app/lib/actions/game-sessions'
import { useOptionalUser } from '#app/lib/contexts/user-context'

type GameScoreCardProps = {
	gameSessionId: GameSession['games'][number]['id']
	gameIndex: number
	game: GameSession['games'][number]
}

export const GameScoreCard = ({ gameIndex, game }: GameScoreCardProps) => {
	const user = useOptionalUser()
	const isAdmin = user?.role === 'admin'
	const [isEditing, setIsEditing] = useState(false)

	if (isEditing) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Edit Game {gameIndex + 1} Score</CardTitle>
				</CardHeader>
				<CardContent>
					<ScoreInputForm
						scores={game.scores}
						onCancel={() => setIsEditing(false)}
					/>
				</CardContent>
			</Card>
		)
	}

	const sortedScores = [...game.scores].sort((a, b) => b.points - a.points)

	const isOptimistic = game.id.startsWith('temp-')

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<p className="flex gap-4">
						<span className={isOptimistic ? 'opacity-50' : ''}>
							Game {gameIndex + 1}
						</span>
						{isOptimistic ? <Spinner /> : null}
					</p>
					{isAdmin && (
						<Button
							disabled={isOptimistic}
							variant="ghost"
							size="sm"
							onClick={() => setIsEditing(true)}
							className="gap-2"
						>
							<Edit className="h-4 w-4" />
							Edit
						</Button>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{sortedScores.map((score, index) => (
						<div
							key={score.id}
							className={`flex items-center justify-between rounded-lg border p-3 ${
								index === 0 ? 'border-primary bg-primary/5' : ''
							}`}
						>
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium text-muted-foreground">
									Team {score.team.name}
								</span>
							</div>
							<span className="text-2xl font-bold">{score.points}</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
