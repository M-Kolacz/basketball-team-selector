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
import { type GameSession } from '#app/lib/actions/game-sessions'

type GameScoreCardProps = {
	gameSessionId: GameSession['games'][number]['id']
	gameIndex: number
	game: GameSession['games'][number]
	isAdmin: boolean
}

export const GameScoreCard = ({
	gameIndex,
	game,
	isAdmin,
}: GameScoreCardProps) => {
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

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>Game {gameIndex + 1}</span>
					{isAdmin && (
						<Button
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
				<div className="grid grid-cols-3 gap-4 text-center">
					<div>
						<div className="text-sm text-muted-foreground">Team A</div>
						<div className="text-3xl font-bold">
							{game.scores[0]?.points ?? 0}
						</div>
					</div>
					<div className="flex items-center justify-center">
						<div className="text-xl font-semibold text-muted-foreground">
							vs
						</div>
					</div>
					<div>
						<div className="text-sm text-muted-foreground">Team B</div>
						<div className="text-3xl font-bold">
							{game.scores[1]?.points ?? 0}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
