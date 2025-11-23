import { TeamCard } from '#app/app/games/[id]/components/team-card';
export var SelectedTeamsSection = function (_a) {
    var teams = _a.teams, isAdmin = _a.isAdmin;
    return (<section className="space-y-4">
		<h2 className="text-2xl font-bold">Final Teams</h2>
		<div className="grid gap-6 md:grid-cols-2">
			{teams.map(function (team) { return (<TeamCard propositionId={team.id} key={team.id} team={team} isAdmin={isAdmin} teamLabel={team.name}/>); })}
		</div>
	</section>);
};
