'use server';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { parseWithZod } from '@conform-to/zod';
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';
import { getOptionalUser, requireAdminUser } from '#app/lib/auth.server';
import { generatePropositions } from '#app/lib/createTeamPropositions';
import { prisma } from '#app/lib/db.server';
import { GetGameSessionSchema, CreateGameSessionSchema, UpdateGameSessionSchema, SelectPropositionSchema, GameResultSchema, SavePropositionSchema, EditGameScoreSchema, DeleteGameSessionSchema, } from '#app/lib/validations/game-session';
export var getGameSessions = function () { return __awaiter(void 0, void 0, void 0, function () {
    var gameSessions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.gameSession.findMany({
                    orderBy: { gameDatetime: 'desc' },
                    select: {
                        id: true,
                        gameDatetime: true,
                        description: true,
                        games: {
                            select: {
                                id: true,
                            },
                        },
                        propositions: {
                            take: 1,
                            select: {
                                teams: {
                                    select: {
                                        players: {
                                            select: { id: true, name: true },
                                        },
                                    },
                                },
                            },
                        },
                    },
                })];
            case 1:
                gameSessions = _a.sent();
                return [2 /*return*/, gameSessions.map(function (_a) {
                        var _b, _c;
                        var games = _a.games, session = __rest(_a, ["games"]);
                        return (__assign(__assign({}, session), { gamesCount: games.length, players: Array.from(new Set((_c = (_b = session.propositions[0]) === null || _b === void 0 ? void 0 : _b.teams.flatMap(function (team) { return team.players; })) !== null && _c !== void 0 ? _c : [])) }));
                    })];
        }
    });
}); };
export var getGameSession = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var gameSessionId, gameSession;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, GetGameSessionSchema.parseAsync({
                    gameSessionId: id,
                })];
            case 1:
                gameSessionId = (_a.sent()).gameSessionId;
                return [4 /*yield*/, prisma.gameSession.findUnique({
                        where: { id: gameSessionId },
                        select: {
                            id: true,
                            gameDatetime: true,
                            description: true,
                            selectedProposition: {
                                include: {
                                    teams: {
                                        select: {
                                            id: true,
                                            name: true,
                                            players: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            propositions: {
                                select: {
                                    id: true,
                                    teams: {
                                        select: {
                                            id: true,
                                            name: true,
                                            players: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            games: {
                                include: {
                                    scores: {
                                        select: {
                                            id: true,
                                            points: true,
                                            teamId: true,
                                            team: {
                                                select: {
                                                    name: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    })];
            case 2:
                gameSession = _a.sent();
                if (!gameSession)
                    notFound();
                return [2 /*return*/, gameSession];
        }
    });
}); };
export var createGameSessionAction = function (_prevState, formData) { return __awaiter(void 0, void 0, void 0, function () {
    var submission, _a, gameDatetime, description, playerIds, players, propositions, gameSession, _i, _b, proposition, teams, _c, _d, team, newTeam;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, parseWithZod(formData, {
                    schema: function (intent) {
                        return CreateGameSessionSchema.transform(function (data, ctx) { return __awaiter(void 0, void 0, void 0, function () {
                            var user, players;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (intent !== null)
                                            return [2 /*return*/, __assign({}, data)];
                                        return [4 /*yield*/, getOptionalUser()];
                                    case 1:
                                        user = _a.sent();
                                        if (!user || user.role !== 'admin') {
                                            ctx.addIssue({
                                                code: z.ZodIssueCode.custom,
                                                message: 'Unauthorized access',
                                            });
                                            return [2 /*return*/, z.NEVER];
                                        }
                                        // Player count validation
                                        if (data.playerIds.length < 10) {
                                            ctx.addIssue({
                                                code: z.ZodIssueCode.custom,
                                                message: 'Minimum 10 players required',
                                                path: ['playerIds'],
                                            });
                                            return [2 /*return*/, z.NEVER];
                                        }
                                        if (data.playerIds.length > 20) {
                                            ctx.addIssue({
                                                code: z.ZodIssueCode.custom,
                                                message: 'Maximum 20 players allowed',
                                                path: ['playerIds'],
                                            });
                                            return [2 /*return*/, z.NEVER];
                                        }
                                        return [4 /*yield*/, prisma.player.findMany({
                                                where: { id: { in: data.playerIds } },
                                            })];
                                    case 2:
                                        players = _a.sent();
                                        if (players.length !== data.playerIds.length) {
                                            ctx.addIssue({
                                                code: z.ZodIssueCode.custom,
                                                message: 'Some players do not exist',
                                                path: ['playerIds'],
                                            });
                                            return [2 /*return*/, z.NEVER];
                                        }
                                        return [2 /*return*/, __assign(__assign({}, data), { players: players })];
                                }
                            });
                        }); });
                    },
                    async: true,
                })];
            case 1:
                submission = _e.sent();
                if (submission.status !== 'success') {
                    return [2 /*return*/, { result: submission.reply() }];
                }
                _a = submission.value, gameDatetime = _a.gameDatetime, description = _a.description, playerIds = _a.playerIds;
                return [4 /*yield*/, prisma.player.findMany({
                        where: { id: { in: playerIds } },
                    })];
            case 2:
                players = _e.sent();
                return [4 /*yield*/, generatePropositions(players)];
            case 3:
                propositions = _e.sent();
                return [4 /*yield*/, prisma.gameSession.create({
                        data: {
                            gameDatetime: new Date(gameDatetime),
                            description: description !== null && description !== void 0 ? description : null,
                        },
                        select: {
                            id: true,
                        },
                    })];
            case 4:
                gameSession = _e.sent();
                _i = 0, _b = propositions.object.propositions;
                _e.label = 5;
            case 5:
                if (!(_i < _b.length)) return [3 /*break*/, 12];
                proposition = _b[_i];
                teams = [];
                _c = 0, _d = proposition.teams;
                _e.label = 6;
            case 6:
                if (!(_c < _d.length)) return [3 /*break*/, 9];
                team = _d[_c];
                return [4 /*yield*/, prisma.team.create({
                        data: {
                            name: "Team ".concat(teams.length + 1),
                            players: {
                                connect: team.map(function (playerName) {
                                    var player = players.find(function (p) { return p.name === playerName; });
                                    return { id: player.id };
                                }),
                            },
                        },
                    })];
            case 7:
                newTeam = _e.sent();
                teams.push(newTeam.id);
                _e.label = 8;
            case 8:
                _c++;
                return [3 /*break*/, 6];
            case 9: return [4 /*yield*/, prisma.proposition.create({
                    data: {
                        type: 'general',
                        teams: {
                            connect: teams.map(function (teamId) { return ({ id: teamId }); }),
                        },
                        gameSession: {
                            connect: { id: gameSession.id },
                        },
                    },
                })];
            case 10:
                _e.sent();
                _e.label = 11;
            case 11:
                _i++;
                return [3 /*break*/, 5];
            case 12:
                revalidatePath('/games');
                return [2 /*return*/];
        }
    });
}); };
export var updateGameSessionAction = function (_prevState, formData) { return __awaiter(void 0, void 0, void 0, function () {
    var submission, _a, id, gameDatetime, description, playerIds, players, propositions, existingPropositions, teamIds, _i, _b, proposition, teams, _c, _d, team, newTeam;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, requireAdminUser()];
            case 1:
                _e.sent();
                return [4 /*yield*/, parseWithZod(formData, {
                        schema: function (intent) {
                            return UpdateGameSessionSchema.transform(function (data, ctx) { return __awaiter(void 0, void 0, void 0, function () {
                                var gameSession, players;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (intent !== null)
                                                return [2 /*return*/, __assign({}, data)];
                                            return [4 /*yield*/, prisma.gameSession.findUnique({
                                                    where: { id: data.id },
                                                    select: { id: true },
                                                })];
                                        case 1:
                                            gameSession = _a.sent();
                                            if (!gameSession) {
                                                ctx.addIssue({
                                                    code: z.ZodIssueCode.custom,
                                                    message: 'Game session not found',
                                                    path: ['id'],
                                                });
                                                return [2 /*return*/, z.NEVER];
                                            }
                                            return [4 /*yield*/, prisma.player.findMany({
                                                    where: { id: { in: data.playerIds } },
                                                })];
                                        case 2:
                                            players = _a.sent();
                                            if (players.length !== data.playerIds.length) {
                                                ctx.addIssue({
                                                    code: z.ZodIssueCode.custom,
                                                    message: 'Some players do not exist',
                                                    path: ['playerIds'],
                                                });
                                                return [2 /*return*/, z.NEVER];
                                            }
                                            return [2 /*return*/, __assign(__assign({}, data), { players: players })];
                                    }
                                });
                            }); });
                        },
                        async: true,
                    })];
            case 2:
                submission = _e.sent();
                if (submission.status !== 'success') {
                    return [2 /*return*/, { result: submission.reply() }];
                }
                _a = submission.value, id = _a.id, gameDatetime = _a.gameDatetime, description = _a.description, playerIds = _a.playerIds;
                return [4 /*yield*/, prisma.player.findMany({
                        where: { id: { in: playerIds } },
                    })];
            case 3:
                players = _e.sent();
                return [4 /*yield*/, generatePropositions(players)];
            case 4:
                propositions = _e.sent();
                return [4 /*yield*/, prisma.proposition.findMany({
                        where: { gameSessionId: id },
                        select: {
                            id: true,
                            teams: { select: { id: true } },
                        },
                    })];
            case 5:
                existingPropositions = _e.sent();
                teamIds = existingPropositions.flatMap(function (prop) {
                    return prop.teams.map(function (team) { return team.id; });
                });
                return [4 /*yield*/, prisma.$transaction([
                        prisma.proposition.deleteMany({
                            where: { gameSessionId: id },
                        }),
                        prisma.team.deleteMany({
                            where: { id: { in: teamIds } },
                        }),
                        prisma.gameSession.update({
                            where: { id: id },
                            data: {
                                gameDatetime: new Date(gameDatetime),
                                description: description !== null && description !== void 0 ? description : null,
                            },
                        }),
                    ])];
            case 6:
                _e.sent();
                _i = 0, _b = propositions.object.propositions;
                _e.label = 7;
            case 7:
                if (!(_i < _b.length)) return [3 /*break*/, 14];
                proposition = _b[_i];
                teams = [];
                _c = 0, _d = proposition.teams;
                _e.label = 8;
            case 8:
                if (!(_c < _d.length)) return [3 /*break*/, 11];
                team = _d[_c];
                return [4 /*yield*/, prisma.team.create({
                        data: {
                            name: "Team ".concat(teams.length + 1),
                            players: {
                                connect: team.map(function (playerName) {
                                    var player = players.find(function (p) { return p.name === playerName; });
                                    return { id: player.id };
                                }),
                            },
                        },
                    })];
            case 9:
                newTeam = _e.sent();
                teams.push(newTeam.id);
                _e.label = 10;
            case 10:
                _c++;
                return [3 /*break*/, 8];
            case 11: return [4 /*yield*/, prisma.proposition.create({
                    data: {
                        type: 'general',
                        teams: {
                            connect: teams.map(function (teamId) { return ({ id: teamId }); }),
                        },
                        gameSession: {
                            connect: { id: id },
                        },
                    },
                })];
            case 12:
                _e.sent();
                _e.label = 13;
            case 13:
                _i++;
                return [3 /*break*/, 7];
            case 14:
                revalidatePath('/games');
                revalidatePath("/games/".concat(id));
                return [2 /*return*/];
        }
    });
}); };
export var updateGameScore = function (_prevState, formData) { return __awaiter(void 0, void 0, void 0, function () {
    var submission, scores;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, requireAdminUser()];
            case 1:
                _a.sent();
                return [4 /*yield*/, parseWithZod(formData, {
                        schema: function (intent) {
                            return EditGameScoreSchema.transform(function (data, ctx) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, data];
                                });
                            }); });
                        },
                        async: true,
                    })];
            case 2:
                submission = _a.sent();
                if (submission.status !== 'success') {
                    return [2 /*return*/, { result: submission.reply() }];
                }
                scores = submission.value.scores;
                return [4 /*yield*/, prisma.$transaction(scores.map(function (score) {
                        return prisma.score.update({
                            where: { id: score.id },
                            data: { points: score.points },
                        });
                    }))];
            case 3:
                _a.sent();
                return [2 /*return*/, {}];
        }
    });
}); };
export var selectPropositionAction = function (_prevState, formData) { return __awaiter(void 0, void 0, void 0, function () {
    var submission, _a, gameSessionId, propositionId, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, parseWithZod(formData, {
                    schema: SelectPropositionSchema.transform(function (data, ctx) { return __awaiter(void 0, void 0, void 0, function () {
                        var user, proposition, gameSession;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getOptionalUser()];
                                case 1:
                                    user = _a.sent();
                                    if (!user || user.role !== 'admin') {
                                        ctx.addIssue({
                                            code: z.ZodIssueCode.custom,
                                            message: 'Unauthorized access',
                                        });
                                        return [2 /*return*/, z.NEVER];
                                    }
                                    return [4 /*yield*/, prisma.proposition.findUnique({
                                            where: { id: data.propositionId },
                                            select: { gameSessionId: true },
                                        })];
                                case 2:
                                    proposition = _a.sent();
                                    if (!proposition) {
                                        ctx.addIssue({
                                            code: z.ZodIssueCode.custom,
                                            message: 'Proposition not found',
                                            path: ['propositionId'],
                                        });
                                        return [2 /*return*/, z.NEVER];
                                    }
                                    if (proposition.gameSessionId !== data.gameSessionId) {
                                        ctx.addIssue({
                                            code: z.ZodIssueCode.custom,
                                            message: 'Proposition does not belong to this game session',
                                            path: ['propositionId'],
                                        });
                                        return [2 /*return*/, z.NEVER];
                                    }
                                    return [4 /*yield*/, prisma.gameSession.findUnique({
                                            where: { id: data.gameSessionId },
                                            select: { selectedPropositionId: true },
                                        })];
                                case 3:
                                    gameSession = _a.sent();
                                    if (!gameSession) {
                                        ctx.addIssue({
                                            code: z.ZodIssueCode.custom,
                                            message: 'Game session not found',
                                            path: ['gameSessionId'],
                                        });
                                        return [2 /*return*/, z.NEVER];
                                    }
                                    if (gameSession.selectedPropositionId !== null) {
                                        ctx.addIssue({
                                            code: z.ZodIssueCode.custom,
                                            message: 'A proposition has already been selected for this game session',
                                            path: ['propositionId'],
                                        });
                                        return [2 /*return*/, z.NEVER];
                                    }
                                    return [2 /*return*/, data];
                            }
                        });
                    }); }),
                    async: true,
                })];
            case 1:
                submission = _b.sent();
                if (submission.status !== 'success') {
                    return [2 /*return*/, { result: submission.reply() }];
                }
                _a = submission.value, gameSessionId = _a.gameSessionId, propositionId = _a.propositionId;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, prisma.gameSession.update({
                        where: { id: gameSessionId },
                        data: { selectedPropositionId: propositionId },
                    })];
            case 3:
                _b.sent();
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                console.error('Error selecting proposition:', error_1);
                throw new Error('Failed to select proposition');
            case 5:
                revalidatePath("/games/".concat(gameSessionId));
                redirect("/games/".concat(gameSessionId));
                return [2 /*return*/];
        }
    });
}); };
export var updatePropositionTeams = function (prevState, formData) { return __awaiter(void 0, void 0, void 0, function () {
    var submission, updatedTeams;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, requireAdminUser()];
            case 1:
                _a.sent();
                return [4 /*yield*/, parseWithZod(formData, {
                        schema: SavePropositionSchema,
                        async: true,
                    })];
            case 2:
                submission = _a.sent();
                if (submission.status !== 'success') {
                    return [2 /*return*/, { result: submission.reply() }];
                }
                updatedTeams = submission.value.updatedTeams;
                return [4 /*yield*/, prisma.$transaction(updatedTeams.map(function (updatedTeam) {
                        return prisma.team.update({
                            where: { id: updatedTeam.id },
                            data: {
                                players: {
                                    set: updatedTeam.players.map(function (player) { return ({ id: player.id }); }),
                                },
                            },
                        });
                    }))];
            case 3:
                _a.sent();
                revalidatePath("/games");
                return [2 /*return*/];
        }
    });
}); };
export var recordGameResultAction = function (_prevState, formData) { return __awaiter(void 0, void 0, void 0, function () {
    var submission, _a, gameSessionId, scores;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, requireAdminUser()];
            case 1:
                _b.sent();
                return [4 /*yield*/, parseWithZod(formData, {
                        schema: function (intent) {
                            return GameResultSchema.transform(function (data, ctx) { return __awaiter(void 0, void 0, void 0, function () {
                                var gameSession;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (intent !== null)
                                                return [2 /*return*/, data];
                                            return [4 /*yield*/, prisma.gameSession.findUnique({
                                                    where: { id: data.gameSessionId },
                                                    include: {
                                                        selectedProposition: {
                                                            include: { teams: true },
                                                        },
                                                    },
                                                })];
                                        case 1:
                                            gameSession = _a.sent();
                                            if (!gameSession || !gameSession.selectedProposition) {
                                                ctx.addIssue({
                                                    code: z.ZodIssueCode.custom,
                                                    message: 'Game session not found',
                                                    path: ['gameSessionId'],
                                                });
                                                return [2 /*return*/, z.NEVER];
                                            }
                                            return [2 /*return*/, data];
                                    }
                                });
                            }); });
                        },
                        async: true,
                    })];
            case 2:
                submission = _b.sent();
                if (submission.status !== 'success') {
                    return [2 /*return*/, { result: submission.reply() }];
                }
                _a = submission.value, gameSessionId = _a.gameSessionId, scores = _a.scores;
                return [4 /*yield*/, prisma.game.create({
                        data: {
                            gameSessionId: gameSessionId,
                            scores: {
                                create: scores.map(function (score) { return ({
                                    teamId: score.teamId,
                                    points: score.points,
                                }); }),
                            },
                        },
                    })];
            case 3:
                _b.sent();
                revalidatePath("/games/".concat(gameSessionId));
                return [2 /*return*/];
        }
    });
}); };
export var deleteGameSession = function (_prevState, formData) { return __awaiter(void 0, void 0, void 0, function () {
    var submission, id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, requireAdminUser()];
            case 1:
                _a.sent();
                return [4 /*yield*/, parseWithZod(formData, {
                        schema: function (intent) {
                            return DeleteGameSessionSchema.transform(function (data, ctx) { return __awaiter(void 0, void 0, void 0, function () {
                                var gameSession;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (intent !== null)
                                                return [2 /*return*/, __assign({}, data)];
                                            return [4 /*yield*/, prisma.gameSession.findUnique({
                                                    where: { id: data.id },
                                                    select: { id: true },
                                                })];
                                        case 1:
                                            gameSession = _a.sent();
                                            if (!gameSession) {
                                                ctx.addIssue({
                                                    code: z.ZodIssueCode.custom,
                                                    message: 'Game session not found',
                                                    path: ['id'],
                                                });
                                                return [2 /*return*/, z.NEVER];
                                            }
                                            return [2 /*return*/, __assign({}, data)];
                                    }
                                });
                            }); });
                        },
                        async: true,
                    })];
            case 2:
                submission = _a.sent();
                if (submission.status !== 'success') {
                    return [2 /*return*/, { result: submission.reply() }];
                }
                id = submission.value.id;
                return [4 /*yield*/, prisma.gameSession.delete({
                        where: { id: id },
                    })];
            case 3:
                _a.sent();
                redirect('/games');
                return [2 /*return*/];
        }
    });
}); };
