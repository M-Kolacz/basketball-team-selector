'use server';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { prisma } from '#app/lib/db.server';
export var getPlayerStats = function () { return __awaiter(void 0, void 0, void 0, function () {
    var players, playerStats;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.player.findMany({
                    select: {
                        id: true,
                        name: true,
                        teams: {
                            select: {
                                id: true,
                                scores: {
                                    select: {
                                        points: true,
                                        game: {
                                            select: {
                                                gameSessionId: true,
                                                id: true,
                                                scores: {
                                                    select: {
                                                        points: true,
                                                        teamId: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                })];
            case 1:
                players = _a.sent();
                playerStats = players.map(function (player) {
                    var gamesPlayed = 0;
                    var gamesWon = 0;
                    var gamesLost = 0;
                    // Track unique games to avoid counting the same game multiple times
                    var processedGames = new Set();
                    var uniqueGameSessions = new Set();
                    player.teams.forEach(function (team) {
                        team.scores.forEach(function (score) {
                            var gameId = score.game.id;
                            var gameSessionId = score.game.gameSessionId;
                            // Skip if we already processed this game
                            if (processedGames.has(gameId))
                                return;
                            processedGames.add(gameId);
                            uniqueGameSessions.add(gameSessionId);
                            gamesPlayed++;
                            // Find all scores for this game
                            var allScores = score.game.scores;
                            var myTeamScore = allScores.find(function (s) { return s.teamId === team.id; });
                            var opponentScore = allScores.find(function (s) { return s.teamId !== team.id; });
                            // Determine if player's team won or lost
                            if (myTeamScore && opponentScore) {
                                if (myTeamScore.points > opponentScore.points) {
                                    gamesWon++;
                                }
                                else if (myTeamScore.points < opponentScore.points) {
                                    gamesLost++;
                                }
                            }
                        });
                    });
                    var winRatio = gamesPlayed > 0 ? (gamesWon / gamesPlayed) * 100 : 0;
                    return {
                        id: player.id,
                        name: player.name,
                        gameSessions: uniqueGameSessions.size,
                        totalGames: gamesPlayed,
                        gamesWon: gamesWon,
                        gamesLost: gamesLost,
                        winRatio: winRatio,
                    };
                });
                // Sort by win ratio descending, then by total games
                playerStats.sort(function (a, b) {
                    if (b.winRatio !== a.winRatio) {
                        return b.winRatio - a.winRatio;
                    }
                    return b.totalGames - a.totalGames;
                });
                return [2 /*return*/, playerStats];
        }
    });
}); };
