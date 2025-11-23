import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { Trash2 } from 'lucide-react';
import { useActionState } from 'react';
import { Button } from '#app/components/ui/button';
import { deletePlayer } from '#app/lib/actions/players';
import { DeletePlayerSchema } from '#app/lib/validations/player';
export var DeletePlayerForm = function (_a) {
    var player = _a.player;
    var _b = useActionState(deletePlayer, undefined), lastResult = _b[0], formAction = _b[1], isSubmitting = _b[2];
    var _c = useForm({
        lastResult: lastResult === null || lastResult === void 0 ? void 0 : lastResult.result,
        defaultValue: {
            id: player.id,
        },
        onValidate: function (_a) {
            var formData = _a.formData;
            return parseWithZod(formData, { schema: DeletePlayerSchema });
        },
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
    }), form = _c[0], fields = _c[1];
    return (<form action={formAction} {...getFormProps(form)}>
			<input {...getInputProps(fields.id, {
        type: 'hidden',
    })}/>
			<Button variant="ghost" size="sm" disabled={isSubmitting} type="submit" aria-label={"Delete ".concat(player.name)} className="text-destructive hover:text-destructive">
				<Trash2 className="h-4 w-4"/>
				{isSubmitting ? 'Deleting...' : 'Delete player'}
			</Button>
		</form>);
};
