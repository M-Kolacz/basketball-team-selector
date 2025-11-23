'use client';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { Trash } from 'lucide-react';
import { useActionState } from 'react';
import { Button } from '#app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, } from '#app/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel, } from '#app/components/ui/field';
import { Input } from '#app/components/ui/input';
import { recordGameResultAction, } from '#app/lib/actions/game-sessions';
import { GameResultSchema } from '#app/lib/validations/game-session';
export var GameScoreForm = function (_a) {
    var gameSessionId = _a.gameSessionId, teams = _a.teams, onCancel = _a.onCancel;
    var _b = useActionState(recordGameResultAction, undefined), lastResult = _b[0], formAction = _b[1], isSubmitting = _b[2];
    var _c = useForm({
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
    }), form = _c[0], fields = _c[1];
    var scoreList = fields.scores.getFieldList();
    return (<Card>
			<CardHeader>
				<CardTitle>{'Add New Game'}</CardTitle>
			</CardHeader>
			<CardContent>
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
						<Field orientation={'horizontal'}>
							<Button type="submit">
								{isSubmitting ? 'Adding game...' : 'Add Game'}
							</Button>
							<Button type="button" variant="outline" disabled={isSubmitting} onClick={onCancel}>
								Cancel
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>);
};
