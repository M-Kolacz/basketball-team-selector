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
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '#app/lib/utils';
var Accordion = function (_a) {
    var props = __rest(_a, []);
    return <AccordionPrimitive.Root data-slot="accordion" {...props}/>;
};
var AccordionItem = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <AccordionPrimitive.Item data-slot="accordion-item" className={cn('border-b last:border-b-0', className)} {...props}/>;
};
var AccordionTrigger = function (_a) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return <AccordionPrimitive.Header className="flex">
			<AccordionPrimitive.Trigger data-slot="accordion-trigger" className={cn('flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180', className)} {...props}>
				{children}
				<ChevronDownIcon className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200"/>
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>;
};
var AccordionContent = function (_a) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return <AccordionPrimitive.Content data-slot="accordion-content" className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down" {...props}>
			<div className={cn('pt-0 pb-4', className)}>{children}</div>
		</AccordionPrimitive.Content>;
};
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
