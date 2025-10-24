import { PlayerList } from '#app/app/games/[id]/components/player-list'
import  { type TeamViewModel } from '#app/app/games/[id]/types'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'

type TeamCardProps = {
	team: TeamViewModel
	teamLabel: 'Team A' | 'Team B'
}

export function TeamCard({ team, teamLabel }: TeamCardProps) {
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
				<PlayerList players={team.players} />
			</CardContent>
		</Card>
	)
}
