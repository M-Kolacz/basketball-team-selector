'use client';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { Trash2 } from 'lucide-react';
import { useActionState } from 'react';
import { Button } from '#app/components/ui/button';
import { deleteGameSession } from '#app/lib/actions/game-sessions';
import { DeleteGameSessionSchema } from '#app/lib/validations/game-session';
export var DeleteGameForm = function (_a) {
    var gameId = _a.gameId;
    var _b = useActionState(deleteGameSession, undefined), lastResult = _b[0], formAction = _b[1], isSubmitting = _b[2];
    var _c = useForm({
        lastResult: lastResult === null || lastResult === void 0 ? void 0 : lastResult.result,
        defaultValue: {
            id: gameId,
        },
        onValidate: function (_a) {
            var formData = _a.formData;
            return parseWithZod(formData, { schema: DeleteGameSessionSchema });
        },
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
    }), form = _c[0], fields = _c[1];
    return (<form action={formAction} {...getFormProps(form)}>
			<input {...getInputProps(fields.id, {
        type: 'hidden',
    })}/>
			<Button variant="ghost" size="sm" disabled={isSubmitting} type="submit" className="w-full justify-start text-destructive hover:text-destructive">
				<Trash2 className="h-4 w-4"/>
				{isSubmitting ? 'Deleting...' : 'Delete game session'}
			</Button>
		</form>);
};
