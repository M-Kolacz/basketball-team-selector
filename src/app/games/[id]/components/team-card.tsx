import { PlayerList } from '#app/app/games/[id]/components/player-list'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'

type TeamCardProps = {
	team: {
		id: string
		players: Array<{ id: string; name: string }>
	}
	teamLabel: 'Team A' | 'Team B'
	propositionId: string
}

export function TeamCard({
	team,
	teamLabel,
	propositionId,
}: TeamCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>{teamLabel}</span>
					<span className="text-sm font-normal text-muted-foreground">
						{team.players.length} players
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<PlayerList
					players={team.players}
					teamId={team.id}
					propositionId={propositionId}
				/>
			</CardContent>
		</Card>
	)
}
