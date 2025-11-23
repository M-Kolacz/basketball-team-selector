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
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '#app/lib/utils';
var DropdownMenu = function (_a) {
    var props = __rest(_a, []);
    return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props}/>;
};
var DropdownMenuPortal = function (_a) {
    var props = __rest(_a, []);
    return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props}/>;
};
var DropdownMenuTrigger = function (_a) {
    var props = __rest(_a, []);
    return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props}/>;
};
var DropdownMenuContent = function (_a) {
    var className = _a.className, _b = _a.sideOffset, sideOffset = _b === void 0 ? 4 : _b, props = __rest(_a, ["className", "sideOffset"]);
    return <DropdownMenuPrimitive.Portal>
			<DropdownMenuPrimitive.Content data-slot="dropdown-menu-content" sideOffset={sideOffset} className={cn('z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95', className)} {...props}/>
		</DropdownMenuPrimitive.Portal>;
};
var DropdownMenuGroup = function (_a) {
    var props = __rest(_a, []);
    return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props}/>;
};
var DropdownMenuItem = function (_a) {
    var className = _a.className, inset = _a.inset, _b = _a.variant, variant = _b === void 0 ? 'default' : _b, props = __rest(_a, ["className", "inset", "variant"]);
    return <DropdownMenuPrimitive.Item data-slot="dropdown-menu-item" data-inset={inset} data-variant={variant} className={cn("relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:!text-destructive", className)} {...props}/>;
};
var DropdownMenuCheckboxItem = function (_a) {
    var className = _a.className, children = _a.children, checked = _a.checked, props = __rest(_a, ["className", "children", "checked"]);
    return <DropdownMenuPrimitive.CheckboxItem data-slot="dropdown-menu-checkbox-item" className={cn("relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)} checked={checked} {...props}>
			<span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
				<DropdownMenuPrimitive.ItemIndicator>
					<CheckIcon className="size-4"/>
				</DropdownMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</DropdownMenuPrimitive.CheckboxItem>;
};
var DropdownMenuRadioGroup = function (_a) {
    var props = __rest(_a, []);
    return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props}/>;
};
var DropdownMenuRadioItem = function (_a) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return <DropdownMenuPrimitive.RadioItem data-slot="dropdown-menu-radio-item" className={cn("relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)} {...props}>
			<span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
				<DropdownMenuPrimitive.ItemIndicator>
					<CircleIcon className="size-2 fill-current"/>
				</DropdownMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</DropdownMenuPrimitive.RadioItem>;
};
var DropdownMenuLabel = function (_a) {
    var className = _a.className, inset = _a.inset, props = __rest(_a, ["className", "inset"]);
    return <DropdownMenuPrimitive.Label data-slot="dropdown-menu-label" data-inset={inset} className={cn('px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', className)} {...props}/>;
};
var DropdownMenuSeparator = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <DropdownMenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn('-mx-1 my-1 h-px bg-border', className)} {...props}/>;
};
var DropdownMenuShortcut = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <span data-slot="dropdown-menu-shortcut" className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)} {...props}/>;
};
var DropdownMenuSub = function (_a) {
    var props = __rest(_a, []);
    return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props}/>;
};
var DropdownMenuSubTrigger = function (_a) {
    var className = _a.className, inset = _a.inset, children = _a.children, props = __rest(_a, ["className", "inset", "children"]);
    return <DropdownMenuPrimitive.SubTrigger data-slot="dropdown-menu-sub-trigger" data-inset={inset} className={cn("flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground", className)} {...props}>
			{children}
			<ChevronRightIcon className="ml-auto size-4"/>
		</DropdownMenuPrimitive.SubTrigger>;
};
var DropdownMenuSubContent = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <DropdownMenuPrimitive.SubContent data-slot="dropdown-menu-sub-content" className={cn('z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95', className)} {...props}/>;
};
export { DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, };
