'use client';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useActionState } from 'react';
import { Button } from '#app/components/ui/button';
import { selectPropositionAction } from '#app/lib/actions/game-sessions';
import { SelectPropositionSchema } from '#app/lib/validations/game-session';
export var SelectPropositionButton = function (_a) {
    var gameSessionId = _a.gameSessionId, propositionId = _a.propositionId, _b = _a.disabled, disabled = _b === void 0 ? false : _b;
    var _c = useActionState(selectPropositionAction, undefined), state = _c[0], formAction = _c[1], isPending = _c[2];
    var _d = useForm({
        lastResult: state === null || state === void 0 ? void 0 : state.result,
        onValidate: function (_a) {
            var formData = _a.formData;
            return parseWithZod(formData, { schema: SelectPropositionSchema });
        },
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
        defaultValue: {
            gameSessionId: gameSessionId,
            propositionId: propositionId,
        },
    }), form = _d[0], fields = _d[1];
    return (<form action={formAction} {...getFormProps(form)}>
			<input {...getInputProps(fields.gameSessionId, { type: 'hidden' })}/>
			<input {...getInputProps(fields.propositionId, { type: 'hidden' })}/>
			<Button type="submit" disabled={disabled || isPending} className="w-full">
				{isPending ? 'Selecting...' : 'Select as Final Proposition'}
			</Button>
		</form>);
};
