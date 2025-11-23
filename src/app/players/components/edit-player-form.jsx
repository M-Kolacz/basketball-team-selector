'use client';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Pencil } from 'lucide-react';
import { useActionState } from 'react';
import { Checkbox, Select } from '#app/components/form';
import { Button } from '#app/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '#app/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel, } from '#app/components/ui/field';
import { Input } from '#app/components/ui/input';
import { updatePlayer } from '#app/lib/actions/players';
import { UpdatePlayerSchema } from '#app/lib/validations/player';
var positions = ['PG', 'SG', 'SF', 'PF', 'C'];
var skillTiers = ['S', 'A', 'B', 'C', 'D'];
export var EditPlayerDialog = function (_a) {
    var _b, _c, _d, _e;
    var player = _a.player;
    var _f = useActionState(updatePlayer, undefined), lastResult = _f[0], formAction = _f[1], isSubmitting = _f[2];
    var _g = useForm({
        defaultValue: {
            id: (_b = player === null || player === void 0 ? void 0 : player.id) !== null && _b !== void 0 ? _b : '',
            name: (_c = player === null || player === void 0 ? void 0 : player.name) !== null && _c !== void 0 ? _c : '',
            skillTier: (_d = player === null || player === void 0 ? void 0 : player.skillTier) !== null && _d !== void 0 ? _d : 'C',
            positions: (_e = player === null || player === void 0 ? void 0 : player.positions) !== null && _e !== void 0 ? _e : [],
        },
        lastResult: lastResult === null || lastResult === void 0 ? void 0 : lastResult.result,
        onValidate: function (_a) {
            var formData = _a.formData;
            return parseWithZod(formData, { schema: UpdatePlayerSchema });
        },
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
    }), form = _g[0], fields = _g[1];
    return (<Dialog>
			<DialogTrigger asChild>
				<Button variant={'ghost'}>
					<Pencil className="h-4 w-4"/>
					Edit player
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Edit Player</DialogTitle>
					<DialogDescription>
						Update player information. Click save when you&apos;re done.
					</DialogDescription>
				</DialogHeader>

				<form action={formAction} {...getFormProps(form)}>
					<input {...getInputProps(fields.id, { type: 'hidden' })}/>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor={fields.name.id}>Player name</FieldLabel>
							<Input {...getInputProps(fields.name, { type: 'text' })} disabled={isSubmitting}/>
							<FieldError errors={fields.name.errors}/>
						</Field>

						<Field>
							<FieldLabel htmlFor={fields.skillTier.id}>Skill tier</FieldLabel>
							<Select id={fields.skillTier.id} name={fields.skillTier.name} defaultValue={fields.skillTier.defaultValue} placeholder="Select skill tier" items={skillTiers.map(function (tier) { return ({
            name: tier,
            value: tier,
        }); })}/>

							<FieldError errors={fields.skillTier.errors}/>
						</Field>

						<Field role="group" aria-labelledby={fields.positions.id}>
							<FieldLabel id={fields.positions.id}>Positions</FieldLabel>
							{positions.map(function (position) {
            var _a;
            return (<div key={position} className="flex items-center gap-2">
									<Checkbox id={"".concat(fields.positions.id, "-").concat(position)} name={fields.positions.name} value={position} defaultChecked={(_a = fields.positions.defaultOptions) === null || _a === void 0 ? void 0 : _a.includes(position)}/>
									<label htmlFor={"".concat(fields.positions.id, "-").concat(position)}>
										{position}
									</label>
								</div>);
        })}
							<FieldError errors={fields.positions.errors}/>
						</Field>

						<FieldError errors={form.errors}/>
					</FieldGroup>

					<DialogFooter>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Updating...' : 'Update Player'}
						</Button>
						<Button type="reset" variant="outline" disabled={isSubmitting}>
							Cancel
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>);
};
