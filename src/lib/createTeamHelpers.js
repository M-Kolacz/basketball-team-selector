export var getOptimalTeamConfiguration = function (players) {
    var totalPlayers = players.length;
    var minPlayersPerTeam = 5;
    var maxPossibleTeams = Math.floor(totalPlayers / minPlayersPerTeam);
    if (maxPossibleTeams < 2) {
        throw new Error("Cannot form teams ".concat(maxPossibleTeams, ": need at least 10 players, but only ").concat(players.length, " players provided."));
    }
    var avgPlayersPerTeam = totalPlayers / maxPossibleTeams;
    var minPlayers = Math.floor(avgPlayersPerTeam);
    var maxPlayers = Math.ceil(avgPlayersPerTeam);
    return {
        numberOfTeams: maxPossibleTeams,
        minPlayersPerTeam: minPlayers,
        maxPlayersPerTeam: maxPlayers,
    };
};
