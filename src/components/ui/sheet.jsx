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
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '#app/lib/utils';
var Sheet = function (_a) {
    var props = __rest(_a, []);
    return <SheetPrimitive.Root data-slot="sheet" {...props}/>;
};
var SheetTrigger = function (_a) {
    var props = __rest(_a, []);
    return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props}/>;
};
var SheetClose = function (_a) {
    var props = __rest(_a, []);
    return <SheetPrimitive.Close data-slot="sheet-close" {...props}/>;
};
var SheetPortal = function (_a) {
    var props = __rest(_a, []);
    return <SheetPrimitive.Portal data-slot="sheet-portal" {...props}/>;
};
var SheetOverlay = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <SheetPrimitive.Overlay data-slot="sheet-overlay" className={cn('fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0', className)} {...props}/>;
};
var SheetContent = function (_a) {
    var className = _a.className, children = _a.children, _b = _a.side, side = _b === void 0 ? 'right' : _b, props = __rest(_a, ["className", "children", "side"]);
    return <SheetPortal>
			<SheetOverlay />
			<SheetPrimitive.Content data-slot="sheet-content" className={cn('fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=open]:duration-500', side === 'right' &&
            'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm', side === 'left' &&
            'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm', side === 'top' &&
            'inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top', side === 'bottom' &&
            'inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom', className)} {...props}>
				{children}
				<SheetPrimitive.Close className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary">
					<XIcon className="size-4"/>
					<span className="sr-only">Close</span>
				</SheetPrimitive.Close>
			</SheetPrimitive.Content>
		</SheetPortal>;
};
var SheetHeader = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="sheet-header" className={cn('flex flex-col gap-1.5 p-4', className)} {...props}/>;
};
var SheetFooter = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="sheet-footer" className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props}/>;
};
var SheetTitle = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <SheetPrimitive.Title data-slot="sheet-title" className={cn('font-semibold text-foreground', className)} {...props}/>;
};
var SheetDescription = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <SheetPrimitive.Description data-slot="sheet-description" className={cn('text-sm text-muted-foreground', className)} {...props}/>;
};
export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, };
