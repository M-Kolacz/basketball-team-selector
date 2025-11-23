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
import { Command as CommandPrimitive } from 'cmdk';
import { SearchIcon } from 'lucide-react';
import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '#app/components/ui/dialog';
import { cn } from '#app/lib/utils';
var Command = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <CommandPrimitive data-slot="command" className={cn('flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground', className)} {...props}/>;
};
var CommandDialog = function (_a) {
    var _b = _a.title, title = _b === void 0 ? 'Command Palette' : _b, _c = _a.description, description = _c === void 0 ? 'Search for a command to run...' : _c, children = _a.children, className = _a.className, _d = _a.showCloseButton, showCloseButton = _d === void 0 ? true : _d, props = __rest(_a, ["title", "description", "children", "className", "showCloseButton"]);
    return <Dialog {...props}>
			<DialogHeader className="sr-only">
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
			</DialogHeader>
			<DialogContent className={cn('overflow-hidden p-0', className)} showCloseButton={showCloseButton}>
				<Command className="**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
					{children}
				</Command>
			</DialogContent>
		</Dialog>;
};
var CommandInput = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="command-input-wrapper" className="flex h-9 items-center gap-2 border-b px-3">
			<SearchIcon className="size-4 shrink-0 opacity-50"/>
			<CommandPrimitive.Input data-slot="command-input" className={cn('flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50', className)} {...props}/>
		</div>;
};
var CommandList = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <CommandPrimitive.List data-slot="command-list" className={cn('max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto', className)} {...props}/>;
};
var CommandEmpty = function (_a) {
    var props = __rest(_a, []);
    return <CommandPrimitive.Empty data-slot="command-empty" className="py-6 text-center text-sm" {...props}/>;
};
var CommandGroup = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <CommandPrimitive.Group data-slot="command-group" className={cn('overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground', className)} {...props}/>;
};
var CommandSeparator = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <CommandPrimitive.Separator data-slot="command-separator" className={cn('-mx-1 h-px bg-border', className)} {...props}/>;
};
var CommandItem = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <CommandPrimitive.Item data-slot="command-item" className={cn("relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground", className)} {...props}/>;
};
var CommandShortcut = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <span data-slot="command-shortcut" className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)} {...props}/>;
};
export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator, };
