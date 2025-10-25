import { PlayerList } from '#app/app/games/[id]/components/player-list'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card'
import { type GameSession } from '#app/lib/actions/game-sessions.server'

type TeamCardProps = {
	team: NonNullable<GameSession['selectedProposition']>['teams'][number]
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
