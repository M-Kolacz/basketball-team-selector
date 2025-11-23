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
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '#app/lib/db.server';
import { env } from '#app/lib/env.mjs';
export var SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30;
export var getSessionExpirationDate = function () {
    return new Date(Date.now() + SESSION_EXPIRATION_TIME);
};
export var AUTH_SESSION_KEY = 'bts-session';
export var getUserId = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sessionCookie, session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getAuthSession()];
            case 1:
                sessionCookie = _a.sent();
                if (!sessionCookie)
                    return [2 /*return*/, null];
                return [4 /*yield*/, prisma.session.findUnique({
                        where: {
                            id: sessionCookie.sessionId,
                            expirationDate: { gt: new Date() },
                        },
                        select: { userId: true },
                    })];
            case 2:
                session = _a.sent();
                if (!(session === null || session === void 0 ? void 0 : session.userId))
                    return [2 /*return*/, null];
                return [2 /*return*/, session.userId];
        }
    });
}); };
export var getOptionalUser = function () { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getUserId()];
            case 1:
                userId = _a.sent();
                if (!userId)
                    return [2 /*return*/, null];
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { id: userId },
                        select: {
                            id: true,
                            username: true,
                            role: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    })];
            case 2:
                user = _a.sent();
                return [2 /*return*/, user];
        }
    });
}); };
export var requireAdminUser = function () { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getOptionalUser()];
            case 1:
                user = _a.sent();
                if (!user || user.role !== 'admin') {
                    throw new Error('Unauthorized: Admin access required');
                }
                return [2 /*return*/, user];
        }
    });
}); };
export var requireUser = function () { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getOptionalUser()];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new Error('Unauthorized: User access required');
                }
                return [2 /*return*/, user];
        }
    });
}); };
export var requireAnonymous = function () { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getOptionalUser()];
            case 1:
                user = _a.sent();
                if (user) {
                    redirect('/games');
                }
                return [2 /*return*/];
        }
    });
}); };
export var login = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var user, session;
    var username = _b.username, password = _b.password;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, verifyUserPassword(username, password)];
            case 1:
                user = _c.sent();
                if (!user)
                    return [2 /*return*/, null];
                return [4 /*yield*/, prisma.session.create({
                        select: { id: true, expirationDate: true, userId: true },
                        data: {
                            expirationDate: getSessionExpirationDate(),
                            userId: user.id,
                        },
                    })];
            case 2:
                session = _c.sent();
                return [2 /*return*/, session];
        }
    });
}); };
export var register = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var hashedPassword, session;
    var username = _b.username, password = _b.password;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, getPasswordHash(password)];
            case 1:
                hashedPassword = _c.sent();
                return [4 /*yield*/, prisma.session.create({
                        data: {
                            expirationDate: getSessionExpirationDate(),
                            user: {
                                create: {
                                    username: username,
                                    password: {
                                        create: {
                                            hash: hashedPassword,
                                        },
                                    },
                                },
                            },
                        },
                        select: { id: true, expirationDate: true },
                    })];
            case 2:
                session = _c.sent();
                return [2 /*return*/, session];
        }
    });
}); };
export var getPasswordHash = function (password) { return __awaiter(void 0, void 0, void 0, function () {
    var hash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bcrypt.hash(password, 10)];
            case 1:
                hash = _a.sent();
                return [2 /*return*/, hash];
        }
    });
}); };
export var verifyUserPassword = function (username, password) { return __awaiter(void 0, void 0, void 0, function () {
    var userWithPassword, isValid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.user.findUnique({
                    where: { username: username },
                    select: { id: true, password: { select: { hash: true } } },
                })];
            case 1:
                userWithPassword = _a.sent();
                if (!userWithPassword || !userWithPassword.password)
                    return [2 /*return*/, null];
                return [4 /*yield*/, bcrypt.compare(password, userWithPassword.password.hash)];
            case 2:
                isValid = _a.sent();
                if (!isValid)
                    return [2 /*return*/, null];
                return [2 /*return*/, { id: userWithPassword.id }];
        }
    });
}); };
export var handleNewSession = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var token, cookieStore;
    var id = _b.id, expirationDate = _b.expirationDate;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                token = jwt.sign({ sessionId: id }, env.JWT_SECRET, {
                    algorithm: 'HS256',
                    expiresIn: '30d',
                });
                return [4 /*yield*/, cookies()];
            case 1:
                cookieStore = _c.sent();
                cookieStore.set(AUTH_SESSION_KEY, token, {
                    sameSite: 'lax',
                    path: '/',
                    httpOnly: true,
                    secure: env.NODE_ENV === 'production',
                    expires: expirationDate,
                });
                return [2 /*return*/];
        }
    });
}); };
export var getAuthSession = function () { return __awaiter(void 0, void 0, void 0, function () {
    var cookieStore, token, decoded;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, cookies()];
            case 1:
                cookieStore = _a.sent();
                token = cookieStore.get(AUTH_SESSION_KEY);
                if (!token)
                    return [2 /*return*/, null];
                decoded = jwt.verify(token.value, env.JWT_SECRET, {
                    algorithms: ['HS256'],
                });
                return [2 /*return*/, decoded];
        }
    });
}); };
