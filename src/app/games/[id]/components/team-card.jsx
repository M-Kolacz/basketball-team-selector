import { PlayerList } from '#app/app/games/[id]/components/player-list';
import { Card, CardContent, CardHeader, CardTitle, } from '#app/components/ui/card';
export var TeamCard = function (_a) {
    var team = _a.team, teamLabel = _a.teamLabel, propositionId = _a.propositionId, isAdmin = _a.isAdmin;
    return (<Card>
		<CardHeader>
			<CardTitle className="flex items-center justify-between">
				<span>{teamLabel}</span>
				<span className="text-sm font-normal text-muted-foreground">
					{team.players.length} players
				</span>
			</CardTitle>
		</CardHeader>
		<CardContent>
			<PlayerList players={team.players} teamId={team.id} propositionId={propositionId} isAdmin={isAdmin}/>
		</CardContent>
	</Card>);
};
