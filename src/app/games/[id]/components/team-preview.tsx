import  { type TeamViewModel } from '#app/app/games/[id]/types'
import { Badge } from '#app/components/ui/badge'

type TeamPreviewProps = {
	team: TeamViewModel
	teamLabel: 'Team A' | 'Team B'
}

export function TeamPreview({ team, teamLabel }: TeamPreviewProps) {
	const playerCount = team.players.length
	const avgSkillTier = calculateAverageSkillTier(team.players)
	const positionDistribution = calculatePositionDistribution(team.players)

	return (
		<div className="space-y-2 rounded-lg border bg-muted/50 p-4">
			<div className="font-medium">{teamLabel}</div>
			<div className="space-y-1 text-sm text-muted-foreground">
				<div>{playerCount} players</div>
				<div>Avg Skill: {avgSkillTier}</div>
				<div className="flex flex-wrap gap-1">
					{Object.entries(positionDistribution).map(([position, count]) => (
						<Badge key={position} variant="outline" className="text-xs">
							{position}: {count}
						</Badge>
					))}
				</div>
			</div>
		</div>
	)
}

function calculateAverageSkillTier(players: TeamViewModel['players']): string {
	const skillValues = { S: 5, A: 4, B: 3, C: 2, D: 1 }
	const skillLabels = ['D', 'C', 'B', 'A', 'S']

	const sum = players.reduce(
		(acc, player) => acc + skillValues[player.skillTier],
		0,
	)
	const avg = Math.round(sum / players.length)

	return skillLabels[avg - 1] || 'B'
}

function calculatePositionDistribution(
	players: TeamViewModel['players'],
): Record<string, number> {
	const distribution: Record<string, number> = {}

	players.forEach((player) => {
		player.positions.forEach((position) => {
			distribution[position] = (distribution[position] || 0) + 1
		})
	})

	return distribution
}
