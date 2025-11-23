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
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '#app/lib/utils';
var ContextMenu = function (_a) {
    var props = __rest(_a, []);
    return <ContextMenuPrimitive.Root data-slot="context-menu" {...props}/>;
};
var ContextMenuTrigger = function (_a) {
    var props = __rest(_a, []);
    return <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props}/>;
};
var ContextMenuGroup = function (_a) {
    var props = __rest(_a, []);
    return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props}/>;
};
var ContextMenuPortal = function (_a) {
    var props = __rest(_a, []);
    return <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props}/>;
};
var ContextMenuSub = function (_a) {
    var props = __rest(_a, []);
    return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props}/>;
};
var ContextMenuRadioGroup = function (_a) {
    var props = __rest(_a, []);
    return <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props}/>;
};
var ContextMenuSubTrigger = function (_a) {
    var className = _a.className, inset = _a.inset, children = _a.children, props = __rest(_a, ["className", "inset", "children"]);
    return <ContextMenuPrimitive.SubTrigger data-slot="context-menu-sub-trigger" data-inset={inset} className={cn("flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground", className)} {...props}>
			{children}
			<ChevronRightIcon className="ml-auto"/>
		</ContextMenuPrimitive.SubTrigger>;
};
var ContextMenuSubContent = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <ContextMenuPrimitive.SubContent data-slot="context-menu-sub-content" className={cn('z-50 min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95', className)} {...props}/>;
};
var ContextMenuContent = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <ContextMenuPrimitive.Portal>
			<ContextMenuPrimitive.Content data-slot="context-menu-content" className={cn('z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95', className)} {...props}/>
		</ContextMenuPrimitive.Portal>;
};
var ContextMenuItem = function (_a) {
    var className = _a.className, inset = _a.inset, _b = _a.variant, variant = _b === void 0 ? 'default' : _b, props = __rest(_a, ["className", "inset", "variant"]);
    return <ContextMenuPrimitive.Item data-slot="context-menu-item" data-inset={inset} data-variant={variant} className={cn("relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:!text-destructive", className)} {...props}/>;
};
var ContextMenuCheckboxItem = function (_a) {
    var className = _a.className, children = _a.children, checked = _a.checked, props = __rest(_a, ["className", "children", "checked"]);
    return <ContextMenuPrimitive.CheckboxItem data-slot="context-menu-checkbox-item" className={cn("relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)} checked={checked} {...props}>
			<span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
				<ContextMenuPrimitive.ItemIndicator>
					<CheckIcon className="size-4"/>
				</ContextMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</ContextMenuPrimitive.CheckboxItem>;
};
var ContextMenuRadioItem = function (_a) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return <ContextMenuPrimitive.RadioItem data-slot="context-menu-radio-item" className={cn("relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)} {...props}>
			<span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
				<ContextMenuPrimitive.ItemIndicator>
					<CircleIcon className="size-2 fill-current"/>
				</ContextMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</ContextMenuPrimitive.RadioItem>;
};
var ContextMenuLabel = function (_a) {
    var className = _a.className, inset = _a.inset, props = __rest(_a, ["className", "inset"]);
    return <ContextMenuPrimitive.Label data-slot="context-menu-label" data-inset={inset} className={cn('px-2 py-1.5 text-sm font-medium text-foreground data-[inset]:pl-8', className)} {...props}/>;
};
var ContextMenuSeparator = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <ContextMenuPrimitive.Separator data-slot="context-menu-separator" className={cn('-mx-1 my-1 h-px bg-border', className)} {...props}/>;
};
var ContextMenuShortcut = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <span data-slot="context-menu-shortcut" className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)} {...props}/>;
};
export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuRadioItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuGroup, ContextMenuPortal, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuRadioGroup, };
