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
import { parseWithZod } from '@conform-to/zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import z from 'zod';
import { login, register, requireAnonymous, handleNewSession, getAuthSession, } from '#app/lib/auth.server';
import { prisma } from '#app/lib/db.server';
import { safeRedirect } from '#app/lib/utils';
import { LoginSchema, LogoutSchema, RegisterSchema, } from '#app/lib/validations/auth';
export var loginAction = function (_prevState, formData) { return __awaiter(void 0, void 0, void 0, function () {
    var submission, _a, session, redirectTo;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, requireAnonymous()];
            case 1:
                _b.sent();
                return [4 /*yield*/, parseWithZod(formData, {
                        schema: function (intent) {
                            return LoginSchema.transform(function (data, ctx) { return __awaiter(void 0, void 0, void 0, function () {
                                var session;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (intent !== null)
                                                return [2 /*return*/, __assign(__assign({}, data), { session: null })];
                                            return [4 /*yield*/, login(data)];
                                        case 1:
                                            session = _a.sent();
                                            if (!session) {
                                                ctx.addIssue({
                                                    code: z.ZodIssueCode.custom,
                                                    message: 'Invalid username or password',
                                                });
                                                return [2 /*return*/, z.NEVER];
                                            }
                                            return [2 /*return*/, __assign(__assign({}, data), { session: session })];
                                    }
                                });
                            }); });
                        },
                        async: true,
                    })];
            case 2:
                submission = _b.sent();
                if (submission.status !== 'success' || !submission.value.session) {
                    return [2 /*return*/, { result: submission.reply({ hideFields: ['password'] }) }];
                }
                _a = submission.value, session = _a.session, redirectTo = _a.redirectTo;
                return [4 /*yield*/, handleNewSession(session)];
            case 3:
                _b.sent();
                redirect(safeRedirect(redirectTo));
                return [2 /*return*/];
        }
    });
}); };
export var logout = function (_prevState, formData) { return __awaiter(void 0, void 0, void 0, function () {
    var authSession, submission, redirectTo, cookieStore;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getAuthSession()];
            case 1:
                authSession = _a.sent();
                if (authSession === null || authSession === void 0 ? void 0 : authSession.sessionId) {
                    void prisma.session
                        .delete({ where: { id: authSession.sessionId } })
                        .catch(function () { });
                }
                submission = parseWithZod(formData, {
                    schema: LogoutSchema,
                });
                if (submission.status !== 'success') {
                    return [2 /*return*/, { result: submission.reply() }];
                }
                redirectTo = submission.value.redirectTo;
                return [4 /*yield*/, cookies()];
            case 2:
                cookieStore = _a.sent();
                cookieStore.delete('bts-session');
                redirect(safeRedirect(redirectTo));
                return [2 /*return*/];
        }
    });
}); };
export var registerAction = function (_prevState, formData) { return __awaiter(void 0, void 0, void 0, function () {
    var submission, _a, session, redirectTo;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, requireAnonymous()];
            case 1:
                _b.sent();
                return [4 /*yield*/, parseWithZod(formData, {
                        schema: function (intent) {
                            return RegisterSchema.superRefine(function (data, ctx) { return __awaiter(void 0, void 0, void 0, function () {
                                var existingUser;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, prisma.user.findUnique({
                                                where: { username: data.username },
                                                select: { id: true },
                                            })];
                                        case 1:
                                            existingUser = _a.sent();
                                            if (existingUser) {
                                                ctx.addIssue({
                                                    path: ['username'],
                                                    code: z.ZodIssueCode.custom,
                                                    message: 'A user already exists with this username',
                                                });
                                                return [2 /*return*/];
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); }).transform(function (data) { return __awaiter(void 0, void 0, void 0, function () {
                                var session;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (intent !== null)
                                                return [2 /*return*/, __assign(__assign({}, data), { session: null })];
                                            return [4 /*yield*/, register(data)];
                                        case 1:
                                            session = _a.sent();
                                            return [2 /*return*/, __assign(__assign({}, data), { session: session })];
                                    }
                                });
                            }); });
                        },
                        async: true,
                    })];
            case 2:
                submission = _b.sent();
                if (submission.status !== 'success' || !submission.value.session) {
                    return [2 /*return*/, {
                            result: submission.reply({ hideFields: ['password', 'confirmPassword'] }),
                        }];
                }
                _a = submission.value, session = _a.session, redirectTo = _a.redirectTo;
                return [4 /*yield*/, handleNewSession(session)];
            case 3:
                _b.sent();
                redirect(safeRedirect(redirectTo));
                return [2 /*return*/];
        }
    });
}); };
