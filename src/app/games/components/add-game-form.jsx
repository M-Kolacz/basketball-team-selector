'use client';
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
import { getFormProps, getTextareaProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useActionState, useState } from 'react';
import { Checkbox, DatePicker } from '#app/components/form';
import { Button } from '#app/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from '#app/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel, } from '#app/components/ui/field';
import { Textarea } from '#app/components/ui/textarea';
import { createGameSessionAction } from '#app/lib/actions/game-sessions';
import { CreateGameSessionSchema } from '#app/lib/validations/game-session';
export var AddGameForm = function (_a) {
    var players = _a.players, addOptimisticGameSession = _a.addOptimisticGameSession;
    var _b = useState(false), open = _b[0], setOpen = _b[1];
    var _c = useActionState(function (prevState, formData) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    addOptimisticGameSession(formData);
                    return [4 /*yield*/, createGameSessionAction(prevState, formData)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }, undefined), lastResult = _c[0], formAction = _c[1], isSubmitting = _c[2];
    var _d = useForm({
        lastResult: lastResult === null || lastResult === void 0 ? void 0 : lastResult.result,
        onValidate: function (_a) {
            var formData = _a.formData;
            return parseWithZod(formData, { schema: CreateGameSessionSchema });
        },
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
        onSubmit: function () {
            setOpen(false);
        },
    }), form = _d[0], fields = _d[1];
    return (<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Add new game</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add new player</DialogTitle>
					<DialogDescription>
						Fill out the form below to add a new player to the roster.
					</DialogDescription>
				</DialogHeader>

				<form action={formAction} {...getFormProps(form)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor={fields.gameDatetime.id}>
								Game Date & Time
							</FieldLabel>
							<DatePicker id={fields.gameDatetime.id} name={fields.gameDatetime.name} defaultValue={fields.gameDatetime.defaultValue}/>
							<FieldError errors={fields.gameDatetime.errors}/>
						</Field>

						<Field>
							<FieldLabel htmlFor={fields.description.id}>
								Description (optional)
							</FieldLabel>
							<Textarea {...getTextareaProps(fields.description)} disabled={isSubmitting} placeholder="Enter game description..." rows={3}/>
							<FieldError errors={fields.description.errors}/>
						</Field>

						<Field role="group" aria-labelledby={fields.playerIds.id}>
							<FieldLabel id={fields.playerIds.id}>Players</FieldLabel>
							<div className="grid grid-cols-2 gap-2">
								{players.map(function (player) {
            var _a;
            return (<div key={player.id} className="flex items-center gap-2">
										<Checkbox id={"".concat(fields.playerIds.id, "-").concat(player.id)} name={fields.playerIds.name} value={player.id} defaultChecked={(_a = fields.playerIds.defaultOptions) === null || _a === void 0 ? void 0 : _a.includes(player.id)}/>
										<label htmlFor={"".concat(fields.playerIds.id, "-").concat(player)}>
											{player.name}
										</label>
									</div>);
        })}
							</div>
							<FieldError errors={fields.playerIds.errors}/>
						</Field>

						<FieldError errors={form.errors}/>
					</FieldGroup>
				</form>
				<DialogFooter>
					<Button type="submit" disabled={isSubmitting} form={form.id}>
						{isSubmitting ? 'Creating game...' : 'Create Game'}
					</Button>
					<DialogClose asChild>
						<Button disabled={isSubmitting} variant="outline">
							Cancel
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>);
};
