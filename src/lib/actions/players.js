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
import z from 'zod';
import { getOptionalUser } from '#app/lib/auth.server';
import { prisma } from '#app/lib/db.server';
import { CreatePlayerSchema, DeletePlayerSchema, UpdatePlayerSchema, } from '#app/lib/validations/player';
import { redirect } from 'next/navigation';
export var getPlayers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var currentUser, isAdminUser, players;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getOptionalUser()];
            case 1:
                currentUser = _a.sent();
                isAdminUser = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) === 'admin';
                return [4 /*yield*/, prisma.player.findMany({
                        select: {
                            id: true,
                            name: true,
                            skillTier: isAdminUser,
                            positions: isAdminUser,
                            createdAt: isAdminUser,
                            updatedAt: isAdminUser,
                        },
                    })];
            case 2:
                players = _a.sent();
                return [2 /*return*/, players];
        }
    });
}); };
export var createPlayer = function (_prevState, formData) { return __awaiter(void 0, void 0, void 0, function () {
    var submission, _a, name, positions, skillTier;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, parseWithZod(formData, {
                    schema: function (intent) {
                        return CreatePlayerSchema.transform(function (data, ctx) { return __awaiter(void 0, void 0, void 0, function () {
                            var currentUser, player;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (intent !== null)
                                            return [2 /*return*/, __assign({}, data)];
                                        return [4 /*yield*/, getOptionalUser()];
                                    case 1:
                                        currentUser = _a.sent();
                                        if (!currentUser || currentUser.role !== 'admin') {
                                            ctx.addIssue({
                                                code: z.ZodIssueCode.custom,
                                                message: 'Something went wrong',
                                            });
                                            return [2 /*return*/, z.NEVER];
                                        }
                                        return [4 /*yield*/, prisma.player.findUnique({
                                                where: { name: data.name },
                                            })];
                                    case 2:
                                        player = _a.sent();
                                        if (player) {
                                            ctx.addIssue({
                                                code: z.ZodIssueCode.custom,
                                                message: 'Player with this name already exists',
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
            case 1:
                submission = _b.sent();
                if (submission.status !== 'success') {
                    return [2 /*return*/, { result: submission.reply() }];
                }
                _a = submission.value, name = _a.name, positions = _a.positions, skillTier = _a.skillTier;
                return [4 /*yield*/, prisma.player.create({
                        data: {
                            name: name,
                            skillTier: skillTier,
                            positions: positions,
                        },
                        select: {
                            id: true,
                        },
                    })];
            case 2:
                _b.sent();
                redirect('/players');
                return [2 /*return*/];
        }
    });
}); };
export var deletePlayer = function (_prevState, formData) { return __awaiter(void 0, void 0, void 0, function () {
    var submission, id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, parseWithZod(formData, {
                    schema: function (intent) {
                        return DeletePlayerSchema.transform(function (data, ctx) { return __awaiter(void 0, void 0, void 0, function () {
                            var currentUser, player;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (intent !== null)
                                            return [2 /*return*/, __assign({}, data)];
                                        return [4 /*yield*/, getOptionalUser()];
                                    case 1:
                                        currentUser = _a.sent();
                                        if (!currentUser || currentUser.role !== 'admin') {
                                            ctx.addIssue({
                                                code: z.ZodIssueCode.custom,
                                                message: 'Something went wrong',
                                            });
                                            return [2 /*return*/, z.NEVER];
                                        }
                                        return [4 /*yield*/, prisma.player.findUnique({
                                                where: { id: data.id },
                                                select: { id: true },
                                            })];
                                    case 2:
                                        player = _a.sent();
                                        if (!player) {
                                            ctx.addIssue({
                                                code: z.ZodIssueCode.custom,
                                                message: 'Player not found',
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
            case 1:
                submission = _a.sent();
                if (submission.status !== 'success') {
                    return [2 /*return*/, { result: submission.reply() }];
                }
                id = submission.value.id;
                return [4 /*yield*/, prisma.player.delete({
                        where: { id: id },
                    })];
            case 2:
                _a.sent();
                redirect('/players');
                return [2 /*return*/];
        }
    });
}); };
export var updatePlayer = function (_prevState, formData) { return __awaiter(void 0, void 0, void 0, function () {
    var submission, _a, id, updateData;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, parseWithZod(formData, {
                    schema: function (intent) {
                        return UpdatePlayerSchema.transform(function (data, ctx) { return __awaiter(void 0, void 0, void 0, function () {
                            var currentUser, existingPlayer, playerWithName;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (intent !== null)
                                            return [2 /*return*/, __assign({}, data)];
                                        return [4 /*yield*/, getOptionalUser()];
                                    case 1:
                                        currentUser = _a.sent();
                                        if (!currentUser || currentUser.role !== 'admin') {
                                            ctx.addIssue({
                                                code: z.ZodIssueCode.custom,
                                                message: 'Something went wrong',
                                            });
                                            return [2 /*return*/, z.NEVER];
                                        }
                                        return [4 /*yield*/, prisma.player.findUnique({
                                                where: { id: data.id },
                                                select: { id: true, name: true },
                                            })];
                                    case 2:
                                        existingPlayer = _a.sent();
                                        if (!existingPlayer) {
                                            ctx.addIssue({
                                                code: z.ZodIssueCode.custom,
                                                message: 'Player not found',
                                                path: ['id'],
                                            });
                                            return [2 /*return*/, z.NEVER];
                                        }
                                        if (!(data.name && data.name !== existingPlayer.name)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, prisma.player.findUnique({
                                                where: { name: data.name },
                                                select: { id: true },
                                            })];
                                    case 3:
                                        playerWithName = _a.sent();
                                        if (playerWithName) {
                                            ctx.addIssue({
                                                code: z.ZodIssueCode.custom,
                                                message: 'Player with this name already exists',
                                                path: ['name'],
                                            });
                                            return [2 /*return*/, z.NEVER];
                                        }
                                        _a.label = 4;
                                    case 4: return [2 /*return*/, __assign({}, data)];
                                }
                            });
                        }); });
                    },
                    async: true,
                })];
            case 1:
                submission = _b.sent();
                if (submission.status !== 'success') {
                    return [2 /*return*/, { result: submission.reply() }];
                }
                _a = submission.value, id = _a.id, updateData = __rest(_a, ["id"]);
                return [4 /*yield*/, prisma.player.update({
                        where: { id: id },
                        data: __assign({}, updateData),
                        select: {
                            id: true,
                        },
                    })];
            case 2:
                _b.sent();
                redirect('/players');
                return [2 /*return*/];
        }
    });
}); };
