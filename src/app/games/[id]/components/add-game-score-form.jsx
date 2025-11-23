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
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { Trash } from 'lucide-react';
import { useActionState, useState } from 'react';
import { Button } from '#app/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from '#app/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel, } from '#app/components/ui/field';
import { Input } from '#app/components/ui/input';
import { recordGameResultAction, } from '#app/lib/actions/game-sessions';
import { GameResultSchema } from '#app/lib/validations/game-session';
export var AddGameScoreForm = function (_a) {
    var gameSessionId = _a.gameSessionId, teams = _a.teams, addOptimisticScore = _a.addOptimisticScore;
    var _b = useState(false), open = _b[0], setOpen = _b[1];
    var _c = useActionState(function (prevState, formData) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            addOptimisticScore(formData);
            return [2 /*return*/, recordGameResultAction(prevState, formData)];
        });
    }); }, undefined), lastResult = _c[0], formAction = _c[1], isSubmitting = _c[2];
    var _d = useForm({
        constraint: getZodConstraint(GameResultSchema),
        lastResult: lastResult === null || lastResult === void 0 ? void 0 : lastResult.result,
        onValidate: function (_a) {
            var formData = _a.formData;
            return parseWithZod(formData, { schema: GameResultSchema });
        },
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
        defaultValue: {
            gameSessionId: gameSessionId,
        },
        onSubmit: function () {
            setOpen(false);
        },
    }), form = _d[0], fields = _d[1];
    var scoreList = fields.scores.getFieldList();
    console.log({ scoreList: scoreList, value: scoreList.values() });
    return (<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Add new game score</Button>
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
						<input {...getInputProps(fields.gameSessionId, { type: 'hidden' })}/>
						<Field orientation={'horizontal'}>
							{teams.map(function (team) { return (<Button key={team.id} {...form.insert.getButtonProps({
            name: fields.scores.name,
            defaultValue: { teamId: team.id },
        })}>
									Add team {team.name}
								</Button>); })}
						</Field>

						<FieldGroup>
							{scoreList.map(function (score, index) {
            var scoreFields = score.getFieldset();
            var team = teams.find(function (t) { return t.id === scoreFields.teamId.value; });
            if (!team)
                return null;
            return (<Field key={score.id}>
										<input {...getInputProps(scoreFields.teamId, {
                type: 'hidden',
            })}/>

										<FieldLabel htmlFor={scoreFields.points.id}>
											Team {team.name} score
										</FieldLabel>
										<Input {...getInputProps(scoreFields.points, {
                type: 'number',
            })} disabled={isSubmitting}/>

										<Button variant="destructive" className="w-fit!" {...form.remove.getButtonProps({
                name: fields.scores.name,
                index: index,
            })}>
											<Trash />
										</Button>
										<FieldError errors={scoreFields.points.errors}/>
									</Field>);
        })}
						</FieldGroup>
						<FieldError errors={form.errors}/>
						<Field orientation={'horizontal'}></Field>
					</FieldGroup>
				</form>
				{scoreList.length === 2 ? (<DialogFooter>
						<Button type="button" variant="outline" disabled={isSubmitting} onClick={function () { return setOpen(false); }}>
							Cancel
						</Button>
						<Button type="submit" form={form.id}>
							{isSubmitting ? 'Adding game...' : 'Add Game'}
						</Button>
					</DialogFooter>) : null}
			</DialogContent>
		</Dialog>);
};
