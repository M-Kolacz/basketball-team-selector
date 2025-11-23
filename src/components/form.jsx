var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { useControl } from '@conform-to/react/future';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '#app/components/ui/button';
import { Calendar } from '#app/components/ui/calendar';
import { Checkbox as ShadcnCheckbox } from '#app/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger, } from '#app/components/ui/popover';
import { SelectTrigger, Select as ShadcnSelect, SelectValue, SelectContent, SelectItem, } from '#app/components/ui/select';
import { cn } from '#app/lib/utils';
export var Select = function (_a) {
    var name = _a.name, items = _a.items, placeholder = _a.placeholder, defaultValue = _a.defaultValue, props = __rest(_a, ["name", "items", "placeholder", "defaultValue"]);
    var selectRef = useRef(null);
    var control = useControl({
        defaultValue: defaultValue,
        onFocus: function () {
            var _a;
            (_a = selectRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        },
    });
    return (<>
			<input name={name} ref={control.register} hidden/>
			<ShadcnSelect value={control.value} onValueChange={function (value) { return control.change(value); }} onOpenChange={function (open) {
            if (!open) {
                control.blur();
            }
        }}>
				<SelectTrigger {...props} ref={selectRef}>
					<SelectValue placeholder={placeholder}/>
				</SelectTrigger>
				<SelectContent>
					{items.map(function (item) {
            return (<SelectItem key={item.value} value={item.value}>
								{item.name}
							</SelectItem>);
        })}
				</SelectContent>
			</ShadcnSelect>
		</>);
};
export var Checkbox = function (_a) {
    var name = _a.name, value = _a.value, defaultChecked = _a.defaultChecked, props = __rest(_a, ["name", "value", "defaultChecked"]);
    var checkboxRef = useRef(null);
    var control = useControl({
        defaultChecked: defaultChecked,
        value: value,
        onFocus: function () {
            var _a;
            (_a = checkboxRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        },
    });
    return (<>
			<input type="checkbox" ref={control.register} name={name} hidden/>
			<ShadcnCheckbox {...props} ref={checkboxRef} checked={control.checked} onCheckedChange={function (checked) { return control.change(checked); }} onBlur={function () { return control.blur(); }} className="focus:ring-2 focus:ring-stone-950 focus:ring-offset-2"/>
		</>);
};
export var DatePicker = function (_a) {
    var _b;
    var name = _a.name, defaultValue = _a.defaultValue, props = __rest(_a, ["name", "defaultValue"]);
    var triggerRef = useRef(null);
    var control = useControl({
        defaultValue: defaultValue,
        onFocus: function () {
            var _a;
            (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        },
    });
    return (<>
			<input ref={control.register} name={name} hidden/>
			<Popover onOpenChange={function (open) {
            if (!open) {
                control.blur();
            }
        }}>
				<PopoverTrigger asChild>
					<Button {...props} ref={triggerRef} variant={'outline'} className={cn('w-64 justify-start text-left font-normal focus:ring-2 focus:ring-stone-950 focus:ring-offset-2', !control.value && 'text-muted-foreground')}>
						<CalendarIcon className="mr-2 h-4 w-4"/>
						{control.value ? (format(control.value, 'PPP')) : (<span>Pick a date</span>)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar mode="single" selected={new Date((_b = control.value) !== null && _b !== void 0 ? _b : '')} onSelect={function (value) { var _a; return control.change((_a = value === null || value === void 0 ? void 0 : value.toISOString()) !== null && _a !== void 0 ? _a : ''); }} autoFocus/>
				</PopoverContent>
			</Popover>
		</>);
};
