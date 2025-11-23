'use client';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useActionState } from 'react';
import { Checkbox, Select } from '#app/components/form';
import { Button } from '#app/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from '#app/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel, } from '#app/components/ui/field';
import { Input } from '#app/components/ui/input';
import { createPlayer } from '#app/lib/actions/players';
import { CreatePlayerSchema } from '#app/lib/validations/player';
var positions = ['PG', 'SG', 'SF', 'PF', 'C'];
var skillTiers = ['S', 'A', 'B', 'C', 'D'];
export var AddPlayerForm = function () {
    var _a = useActionState(createPlayer, undefined), lastResult = _a[0], formAction = _a[1], isSubmitting = _a[2];
    var _b = useForm({
        lastResult: lastResult === null || lastResult === void 0 ? void 0 : lastResult.result,
        onValidate: function (_a) {
            var formData = _a.formData;
            return parseWithZod(formData, { schema: CreatePlayerSchema });
        },
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
    }), form = _b[0], fields = _b[1];
    return (<Dialog>
			<DialogTrigger asChild>
				<Button>Add new player</Button>
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
				</form>
				<DialogFooter>
					<Button type="submit" disabled={isSubmitting} form={form.id}>
						{isSubmitting ? 'Adding...' : 'Add Player'}
					</Button>
					<DialogClose asChild>
						<Button disabled={isSubmitting} variant="outline">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>);
};
