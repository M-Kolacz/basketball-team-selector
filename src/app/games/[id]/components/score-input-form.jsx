'use client';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { useActionState } from 'react';
import { Button } from '#app/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '#app/components/ui/field';
import { Input } from '#app/components/ui/input';
import { updateGameScore, } from '#app/lib/actions/game-sessions';
import { EditGameScoreSchema } from '#app/lib/validations/game-session';
export var ScoreInputForm = function (_a) {
    var scores = _a.scores, onCancel = _a.onCancel;
    var _b = useActionState(updateGameScore, undefined), lastResult = _b[0], formAction = _b[1], isSubmitting = _b[2];
    var _c = useForm({
        constraint: getZodConstraint(EditGameScoreSchema),
        lastResult: lastResult === null || lastResult === void 0 ? void 0 : lastResult.result,
        onValidate: function (_a) {
            var formData = _a.formData;
            return parseWithZod(formData, { schema: EditGameScoreSchema });
        },
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
        defaultValue: {
            scores: scores,
        },
    }), form = _c[0], fields = _c[1];
    var scoreFields = fields.scores.getFieldList();
    return (<form {...getFormProps(form)} action={formAction}>
			<FieldGroup>
				<div className="space-y-4">
					{scoreFields.map(function (score, index) {
            var scoreFields = score.getFieldset();
            return (<div key={score.id}>
								<input {...getInputProps(scoreFields.id, { type: 'hidden' })}/>

								<Field>
									<FieldLabel htmlFor={scoreFields.points.id}>
										Team {index + 1} Score
									</FieldLabel>
									<Input {...getInputProps(scoreFields.points, { type: 'number' })}/>
								</Field>
							</div>);
        })}
				</div>

				<div className="flex gap-2">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Saving...' : 'Save Score'}
					</Button>
					<Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
						Cancel
					</Button>
				</div>
			</FieldGroup>
		</form>);
};
