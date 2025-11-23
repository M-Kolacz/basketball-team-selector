'use client';
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
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { CircleIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '#app/lib/utils';
var RadioGroup = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn('grid gap-3', className)} {...props}/>;
};
var RadioGroupItem = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <RadioGroupPrimitive.Item data-slot="radio-group-item" className={cn('aspect-square size-4 shrink-0 rounded-full border border-input text-primary shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40', className)} {...props}>
			<RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" className="relative flex items-center justify-center">
				<CircleIcon className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-primary"/>
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>;
};
export { RadioGroup, RadioGroupItem };
