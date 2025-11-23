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
import { faker } from '@faker-js/faker';
import bcryptjs from 'bcryptjs';
import { prisma, } from '#app/lib/db.server';
var seed = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, players, _i, players_1, player, teams, _c, teams_1, team, gameSession, numberOfPropositions, _d, numberOfPropositions_1, proposition, selectedPropositionId, selectedProposition, games, _e, games_1, ignored, game, error_1;
    var _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                console.log('🌱 Seeding database...');
                _k.label = 1;
            case 1:
                _k.trys.push([1, 33, , 34]);
                console.log('🗑️  Clearing existing players...');
                return [4 /*yield*/, prisma.player.deleteMany()];
            case 2:
                _k.sent();
                console.log('🗑️  Clearing existing propositions...');
                return [4 /*yield*/, prisma.proposition.deleteMany()];
            case 3:
                _k.sent();
                console.log('🗑️  Clearing existing game sessions...');
                return [4 /*yield*/, prisma.gameSession.deleteMany()];
            case 4:
                _k.sent();
                console.log('🗑️  Clearing existing users...');
                return [4 /*yield*/, prisma.user.deleteMany()];
            case 5:
                _k.sent();
                console.log('🗑️  Clearing existing teams...');
                return [4 /*yield*/, prisma.team.deleteMany()];
            case 6:
                _k.sent();
                console.log('🗑️  Clearing existing games...');
                return [4 /*yield*/, prisma.game.deleteMany()];
            case 7:
                _k.sent();
                console.log('🗑️  Clearing existing scores...');
                return [4 /*yield*/, prisma.score.deleteMany()];
            case 8:
                _k.sent();
                console.log('📝 Inserting seed users data...');
                _b = (_a = prisma.user).create;
                _f = {};
                _g = {
                    id: faker.string.uuid(),
                    username: 'kody',
                    createdAt: faker.date.past({ years: 1 }),
                    updatedAt: faker.date.recent({ days: 10 }),
                    role: 'admin'
                };
                _h = {};
                _j = {};
                return [4 /*yield*/, bcryptjs.hash('kodylovesyou', 12)];
            case 9: return [4 /*yield*/, _b.apply(_a, [(_f.data = (_g.password = (_h.create = (_j.hash = _k.sent(),
                        _j),
                        _h),
                        _g),
                        _f)])];
            case 10:
                _k.sent();
                return [4 /*yield*/, prisma.user.create({
                        data: {
                            id: faker.string.uuid(),
                            username: faker.internet.username(),
                            createdAt: faker.date.past({ years: 1 }),
                            updatedAt: faker.date.recent({ days: 10 }),
                            role: 'user',
                        },
                    })];
            case 11:
                _k.sent();
                console.log('📝 Inserting seed players data...');
                players = Array.from({ length: 20 }, function () { return ({
                    id: faker.string.uuid(),
                    name: faker.person.fullName(),
                    skillTier: faker.helpers.arrayElement(['S', 'A', 'B', 'C', 'D']),
                    positions: faker.helpers.arrayElements(['PG', 'SG', 'SF', 'PF', 'C'], {
                        min: 1,
                        max: 3,
                    }),
                    createdAt: faker.date.past({ years: 1 }),
                    updatedAt: faker.date.recent({ days: 10 }),
                }); });
                _i = 0, players_1 = players;
                _k.label = 12;
            case 12:
                if (!(_i < players_1.length)) return [3 /*break*/, 15];
                player = players_1[_i];
                return [4 /*yield*/, prisma.player.create({ data: player })];
            case 13:
                _k.sent();
                _k.label = 14;
            case 14:
                _i++;
                return [3 /*break*/, 12];
            case 15:
                console.log('📝 Inserting seed teams data...');
                teams = Array.from({ length: 6 }, function () { return ({
                    id: faker.string.uuid(),
                    name: faker.animal.type(),
                    createdAt: faker.date.recent({ days: 10 }),
                    updatedAt: faker.date.recent({ days: 5 }),
                }); });
                _c = 0, teams_1 = teams;
                _k.label = 16;
            case 16:
                if (!(_c < teams_1.length)) return [3 /*break*/, 19];
                team = teams_1[_c];
                return [4 /*yield*/, prisma.team.create({
                        data: __assign(__assign({}, team), { players: {
                                connect: faker.helpers
                                    .arrayElements(players, { min: 5, max: 5 })
                                    .map(function (player) { return ({ id: player.id }); }),
                            } }),
                    })];
            case 17:
                _k.sent();
                _k.label = 18;
            case 18:
                _c++;
                return [3 /*break*/, 16];
            case 19:
                console.log('📝 Inserting seed game session data...');
                return [4 /*yield*/, prisma.gameSession.create({
                        data: {
                            id: faker.string.uuid(),
                            createdAt: faker.date.recent({ days: 10 }),
                            updatedAt: faker.date.recent({ days: 5 }),
                            description: 'Casual Friday Game',
                            gameDatetime: faker.date.soon({ days: 5 }),
                        },
                    })];
            case 20:
                gameSession = _k.sent();
                console.log('📝 Inserting seed propositions data...');
                numberOfPropositions = Array.from({ length: 3 }, function () { return ({
                    id: faker.string.uuid(),
                }); });
                _d = 0, numberOfPropositions_1 = numberOfPropositions;
                _k.label = 21;
            case 21:
                if (!(_d < numberOfPropositions_1.length)) return [3 /*break*/, 24];
                proposition = numberOfPropositions_1[_d];
                return [4 /*yield*/, prisma.proposition.create({
                        data: {
                            id: proposition.id,
                            createdAt: faker.date.recent({ days: 10 }),
                            gameSession: { connect: { id: gameSession.id } },
                            type: 'general',
                            teams: {
                                connect: faker.helpers
                                    .arrayElements(teams, { min: 2, max: 2 })
                                    .map(function (team) { return ({ id: team.id }); }),
                            },
                        },
                    })];
            case 22:
                _k.sent();
                _k.label = 23;
            case 23:
                _d++;
                return [3 /*break*/, 21];
            case 24:
                selectedPropositionId = numberOfPropositions[0].id;
                return [4 /*yield*/, prisma.proposition.findUnique({
                        where: { id: selectedPropositionId },
                        select: { teams: true },
                    })];
            case 25:
                selectedProposition = _k.sent();
                console.log('📝 Inserting seed games and scores data...');
                games = Array.from({ length: 5 });
                _e = 0, games_1 = games;
                _k.label = 26;
            case 26:
                if (!(_e < games_1.length)) return [3 /*break*/, 31];
                ignored = games_1[_e];
                return [4 /*yield*/, prisma.game.create({
                        data: {
                            gameSession: {
                                connect: { id: gameSession.id },
                            },
                        },
                    })];
            case 27:
                game = _k.sent();
                return [4 /*yield*/, prisma.score.create({
                        data: {
                            points: faker.number.int({ min: 0, max: 30 }),
                            game: { connect: { id: game.id } },
                            team: {
                                connect: { id: selectedProposition.teams[0].id },
                            },
                        },
                    })];
            case 28:
                _k.sent();
                return [4 /*yield*/, prisma.score.create({
                        data: {
                            points: faker.number.int({ min: 0, max: 30 }),
                            game: { connect: { id: game.id } },
                            team: {
                                connect: { id: selectedProposition.teams[1].id },
                            },
                        },
                    })];
            case 29:
                _k.sent();
                _k.label = 30;
            case 30:
                _e++;
                return [3 /*break*/, 26];
            case 31:
                console.log('📝 Updating seed game sessions data with propositions...');
                return [4 /*yield*/, prisma.gameSession.update({
                        where: { id: gameSession.id },
                        data: {
                            propositions: {
                                connect: numberOfPropositions.map(function (proposition) { return ({
                                    id: proposition.id,
                                }); }),
                            },
                            selectedProposition: { connect: { id: numberOfPropositions[0].id } },
                        },
                    })];
            case 32:
                _k.sent();
                console.log("\u2705 Successfully seeded database!");
                console.log('🎉 Database seeding completed!');
                return [3 /*break*/, 34];
            case 33:
                error_1 = _k.sent();
                console.error('❌ Error seeding database:', error_1);
                process.exit(1);
                return [3 /*break*/, 34];
            case 34: return [2 /*return*/];
        }
    });
}); };
if (require.main === module) {
    seed()
        .then(function () {
        console.log('🏁 Seeding process finished');
        process.exit(0);
    })
        .catch(function (error) {
        console.error('💥 Fatal error during seeding:', error);
        process.exit(1);
    });
}
export { seed };
