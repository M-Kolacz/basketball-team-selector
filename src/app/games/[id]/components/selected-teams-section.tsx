import { TeamCard } from '#app/app/games/[id]/components/team-card'
import { type GameSession } from '#app/lib/actions/game-sessions'

type SelectedTeamsSectionProps = {
	teams: NonNullable<GameSession['selectedProposition']>['teams']
}

export const SelectedTeamsSection = ({
	teams,
}: SelectedTeamsSectionProps) => (
	<section className="space-y-4">
		<h2 className="text-2xl font-bold">Final Teams</h2>
		<div className="grid gap-6 md:grid-cols-2">
			{teams.map((team) => (
				<TeamCard
					propositionId={team.id}
					key={team.id}
					team={team}
					teamLabel={team.name}
				/>
			))}
		</div>
	</section>
)
