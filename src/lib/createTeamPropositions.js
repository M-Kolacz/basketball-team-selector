var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { generateObject } from 'ai';
import { z } from 'zod';
import { getOptimalTeamConfiguration } from '#app/lib/createTeamHelpers';
import { createTeamsModel } from '#app/lib/models';
export var generatePropositions = function (selectedPlayers) {
    var randomnessLevel = 0.8;
    var randomSeed = Math.random();
    var _a = getOptimalTeamConfiguration(selectedPlayers), numberOfTeams = _a.numberOfTeams, minNumberOfPlayersInTeam = _a.minPlayersPerTeam, maxNumberOfPlayersInTeam = _a.maxPlayersPerTeam;
    var shuffledPlayers = __spreadArray([], selectedPlayers, true).sort(function () { return Math.random() - 0.5; });
    var generatedProposition = generateObject({
        model: createTeamsModel,
        schemaName: 'TeamSelectionResult',
        schemaDescription: 'Result of the team selection process.',
        schema: getTeamSelectionSchema({
            numberOfTeams: numberOfTeams,
            minNumberOfPlayersInTeam: minNumberOfPlayersInTeam,
            maxNumberOfPlayersInTeam: maxNumberOfPlayersInTeam,
        }),
        temperature: randomnessLevel,
        topP: 0.9,
        seed: Math.floor(randomSeed * 1000000),
        system: "\nYou are an expert basketball team selector. Your role is to create balanced and competitive teams based on a provided list of players.\n\nYou will receive a list of players, each with their name, position(s), and tierListPosition (skill level). You must create exactly 3 team setup propositions, each using a different balancing approach:\n\n**PROPOSITION 1 - Skill-Based Balance**: Create teams based primarily on tierListPosition (skill level). Distribute players across teams to ensure each team has a similar combined skill level. Focus on balancing the tier rankings (S, A, B, C, D) so that each team has roughly equal overall power.\n\n**PROPOSITION 2 - Position-Based Balance**: Create teams based primarily on positions that players can play. Ensure each team has a good mix of positions (Point Guard, Shooting Guard, Small Forward, Power Forward, Center) for strategic diversity and fair play. Focus on positional balance rather than skill balance.\n\n**PROPOSITION 3 - Mixed Approach**: Create teams using both tierListPosition and position information. Balance both skill levels and positional diversity simultaneously. This approach should consider both factors equally to create the most strategically balanced teams.\n\n**Team sizing rule**: Every team must have at least 5 players (minimum for basketball). You must create exactly ".concat(numberOfTeams, " teams with ").concat(minNumberOfPlayersInTeam).concat(minNumberOfPlayersInTeam !== maxNumberOfPlayersInTeam
            ? "-".concat(maxNumberOfPlayersInTeam)
            : '', " players each. Distribute all ").concat(selectedPlayers.length, " players across these teams.\n\nFor each proposition, provide a descriptive title that reflects the balancing strategy used and a clear rationale explaining how you applied that specific approach.\n\nIMPORTANT: You must create exactly ").concat(numberOfTeams, " teams in each proposition, with each team having between ").concat(minNumberOfPlayersInTeam, " and ").concat(maxNumberOfPlayersInTeam, " players.\n"),
        prompt: "\n    <Players>\n    ".concat(shuffledPlayers.map(function (player) {
            return "\n        <Player>\n          <Name>".concat(player.name, "</Name>\n          <Positions>").concat(player.positions.join(', '), "</Positions>\n          <TierListPosition>").concat(player.skillTier, "</TierListPosition>\n        </Player>\n      ");
        }), "\n    </Players>\n\n    Based on the above list of ").concat(selectedPlayers.length, " players, create exactly 3 team setup propositions using the three distinct approaches specified in the system prompt:\n\n    1. **First proposition**: Focus on tierListPosition (skill balance)\n    2. **Second proposition**: Focus on position distribution (positional balance)  \n    3. **Third proposition**: Combined approach using both tierListPosition and position\n\n    You MUST create exactly ").concat(numberOfTeams, " teams in each proposition, with each team having between ").concat(minNumberOfPlayersInTeam, " and ").concat(maxNumberOfPlayersInTeam, " players. Use all players and ensure no player appears in multiple teams within the same proposition.\n    "),
    });
    return generatedProposition;
};
export var getTeamSelectionSchema = function (_a) {
    var numberOfTeams = _a.numberOfTeams, minNumberOfPlayersInTeam = _a.minNumberOfPlayersInTeam, maxNumberOfPlayersInTeam = _a.maxNumberOfPlayersInTeam;
    return z.object({
        propositions: z
            .array(z.object({
            title: z
                .string()
                .describe('A descriptive title for this team setup proposition'),
            rationale: z
                .string()
                .describe('Explanation of the strategy and reasoning behind this team arrangement'),
            teams: z
                .array(z
                .array(z.string().describe('Name of the player in the team.'))
                .describe('List of player names in a basketball team.')
                .min(minNumberOfPlayersInTeam)
                .max(maxNumberOfPlayersInTeam))
                .length(numberOfTeams)
                .describe('Array of teams, where each team is an array of player names.'),
            likes: z
                .number()
                .default(0)
                .describe('Number of likes for this proposition'),
        }))
            .length(3)
            .describe('Array of exactly 3 different team setup propositions, each with different strategic approaches to achieving the most equal power balance between all teams'),
    });
};
export var teamSchema = z
    .array(z.string().describe('Name of the player in the team.'))
    .describe('List of player names in the basketball team.');
export var playerSchema = z.object({
    id: z.string().describe('Unique identifier for the player (UUID).'),
    name: z.string().describe('Full name of the player.'),
    positions: z
        .array(z.enum(['PG', 'SG', 'SF', 'PF', 'C']))
        .describe('Primary position on the court.'),
    skillTier: z
        .enum(['S', 'A', 'B', 'C', 'D'])
        .describe('General skill tier ranking of the player (S = Excellent, A = Very Good, B = Good, C = Average, D = Below Average).'),
});
