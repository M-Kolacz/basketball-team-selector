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
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';
import { cn } from '#app/lib/utils';
var TooltipProvider = function (_a) {
    var _b = _a.delayDuration, delayDuration = _b === void 0 ? 0 : _b, props = __rest(_a, ["delayDuration"]);
    return <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props}/>;
};
var Tooltip = function (_a) {
    var props = __rest(_a, []);
    return <TooltipProvider>
			<TooltipPrimitive.Root data-slot="tooltip" {...props}/>
		</TooltipProvider>;
};
var TooltipTrigger = function (_a) {
    var props = __rest(_a, []);
    return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props}/>;
};
var TooltipContent = function (_a) {
    var className = _a.className, _b = _a.sideOffset, sideOffset = _b === void 0 ? 0 : _b, children = _a.children, props = __rest(_a, ["className", "sideOffset", "children"]);
    return <TooltipPrimitive.Portal>
			<TooltipPrimitive.Content data-slot="tooltip-content" sideOffset={sideOffset} className={cn('z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in rounded-md bg-foreground px-3 py-1.5 text-xs text-balance text-background fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95', className)} {...props}>
				{children}
				<TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground"/>
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>;
};
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
