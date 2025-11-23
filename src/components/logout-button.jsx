'use client';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { LogOutIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useActionState } from 'react';
import { Button } from '#app/components/ui/button';
import { FieldError } from '#app/components/ui/field';
import { logout } from '#app/lib/actions/auth';
import { LogoutSchema } from '#app/lib/validations/auth';
export var LogoutButton = function () {
    var pathname = usePathname();
    var _a = useActionState(logout, undefined), lastResult = _a[0], formAction = _a[1], isSubmitting = _a[2];
    var _b = useForm({
        defaultValue: {
            redirectTo: pathname,
        },
        lastResult: lastResult === null || lastResult === void 0 ? void 0 : lastResult.result,
        onValidate: function (_a) {
            var formData = _a.formData;
            return parseWithZod(formData, { schema: LogoutSchema });
        },
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
    }), form = _b[0], fields = _b[1];
    return (<form action={formAction} {...getFormProps(form)}>
			<input {...getInputProps(fields.redirectTo, { type: 'hidden' })}/>

			<Button variant="ghost" className="w-full justify-start" disabled={isSubmitting} type="submit">
				<LogOutIcon className="size-4"/>
				{isSubmitting ? 'Logging out...' : 'Logout'}
			</Button>
			<FieldError errors={form.errors}/>
		</form>);
};
