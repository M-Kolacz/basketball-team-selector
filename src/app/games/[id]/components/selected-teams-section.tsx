import { TeamCard } from '#app/app/games/[id]/components/team-card'
import  { type TeamViewModel } from '#app/app/games/[id]/types'

type SelectedTeamsSectionProps = {
	teams: TeamViewModel[]
}

export function SelectedTeamsSection({ teams }: SelectedTeamsSectionProps) {
	return (
		<section className="space-y-4">
			<h2 className="text-2xl font-bold">Final Teams</h2>
			<div className="grid gap-6 md:grid-cols-2">
				{teams.map((team, index) => (
					<TeamCard
						key={team.id}
						team={team}
						teamLabel={index === 0 ? 'Team A' : 'Team B'}
					/>
				))}
			</div>
		</section>
	)
}
