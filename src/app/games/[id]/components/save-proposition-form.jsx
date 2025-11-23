'use client';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { Fragment, useActionState } from 'react';
import { Button } from '#app/components/ui/button';
import { updatePropositionTeams } from '#app/lib/actions/game-sessions';
import { SavePropositionSchema, } from '#app/lib/validations/game-session';
export var SavePropositionForm = function (_a) {
    var updatedTeams = _a.updatedTeams;
    var _b = useActionState(updatePropositionTeams, undefined), lastResult = _b[0], formAction = _b[1], isSubmitting = _b[2];
    var _c = useForm({
        constraint: getZodConstraint(SavePropositionSchema),
        lastResult: lastResult === null || lastResult === void 0 ? void 0 : lastResult.result,
        defaultValue: {
            updatedTeams: updatedTeams,
        },
        onValidate: function (_a) {
            var formData = _a.formData;
            return parseWithZod(formData, { schema: SavePropositionSchema });
        },
    }), form = _c[0], fields = _c[1];
    var updatedTeamsFieldList = fields.updatedTeams.getFieldList();
    return (<form {...getFormProps(form)} action={formAction}>
			{updatedTeamsFieldList.map(function (teamUpdates) {
            var teamIdField = teamUpdates.getFieldset().id;
            var playersIdFieldList = teamUpdates
                .getFieldset()
                .players.getFieldList();
            return (<Fragment key={teamUpdates.id}>
						<input {...getInputProps(teamIdField, { type: 'hidden' })}/>
						{playersIdFieldList.map(function (playerIdField) {
                    var playerField = playerIdField.getFieldset();
                    return (<input {...getInputProps(playerField.id, {
                        type: 'hidden',
                    })} key={playerField.id.id}/>);
                })}
					</Fragment>);
        })}
			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Saving...' : 'Save Teams'}
			</Button>
		</form>);
};
