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
import * as MenubarPrimitive from '@radix-ui/react-menubar';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '#app/lib/utils';
var Menubar = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <MenubarPrimitive.Root data-slot="menubar" className={cn('flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs', className)} {...props}/>;
};
var MenubarMenu = function (_a) {
    var props = __rest(_a, []);
    return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props}/>;
};
var MenubarGroup = function (_a) {
    var props = __rest(_a, []);
    return <MenubarPrimitive.Group data-slot="menubar-group" {...props}/>;
};
var MenubarPortal = function (_a) {
    var props = __rest(_a, []);
    return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props}/>;
};
var MenubarRadioGroup = function (_a) {
    var props = __rest(_a, []);
    return <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props}/>;
};
var MenubarTrigger = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <MenubarPrimitive.Trigger data-slot="menubar-trigger" className={cn('flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground', className)} {...props}/>;
};
var MenubarContent = function (_a) {
    var className = _a.className, _b = _a.align, align = _b === void 0 ? 'start' : _b, _c = _a.alignOffset, alignOffset = _c === void 0 ? -4 : _c, _d = _a.sideOffset, sideOffset = _d === void 0 ? 8 : _d, props = __rest(_a, ["className", "align", "alignOffset", "sideOffset"]);
    return <MenubarPortal>
			<MenubarPrimitive.Content data-slot="menubar-content" align={align} alignOffset={alignOffset} sideOffset={sideOffset} className={cn('z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95', className)} {...props}/>
		</MenubarPortal>;
};
var MenubarItem = function (_a) {
    var className = _a.className, inset = _a.inset, _b = _a.variant, variant = _b === void 0 ? 'default' : _b, props = __rest(_a, ["className", "inset", "variant"]);
    return <MenubarPrimitive.Item data-slot="menubar-item" data-inset={inset} data-variant={variant} className={cn("relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:!text-destructive", className)} {...props}/>;
};
var MenubarCheckboxItem = function (_a) {
    var className = _a.className, children = _a.children, checked = _a.checked, props = __rest(_a, ["className", "children", "checked"]);
    return <MenubarPrimitive.CheckboxItem data-slot="menubar-checkbox-item" className={cn("relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)} checked={checked} {...props}>
			<span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
				<MenubarPrimitive.ItemIndicator>
					<CheckIcon className="size-4"/>
				</MenubarPrimitive.ItemIndicator>
			</span>
			{children}
		</MenubarPrimitive.CheckboxItem>;
};
var MenubarRadioItem = function (_a) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return <MenubarPrimitive.RadioItem data-slot="menubar-radio-item" className={cn("relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)} {...props}>
			<span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
				<MenubarPrimitive.ItemIndicator>
					<CircleIcon className="size-2 fill-current"/>
				</MenubarPrimitive.ItemIndicator>
			</span>
			{children}
		</MenubarPrimitive.RadioItem>;
};
var MenubarLabel = function (_a) {
    var className = _a.className, inset = _a.inset, props = __rest(_a, ["className", "inset"]);
    return <MenubarPrimitive.Label data-slot="menubar-label" data-inset={inset} className={cn('px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', className)} {...props}/>;
};
var MenubarSeparator = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <MenubarPrimitive.Separator data-slot="menubar-separator" className={cn('-mx-1 my-1 h-px bg-border', className)} {...props}/>;
};
var MenubarShortcut = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <span data-slot="menubar-shortcut" className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)} {...props}/>;
};
var MenubarSub = function (_a) {
    var props = __rest(_a, []);
    return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props}/>;
};
var MenubarSubTrigger = function (_a) {
    var className = _a.className, inset = _a.inset, children = _a.children, props = __rest(_a, ["className", "inset", "children"]);
    return <MenubarPrimitive.SubTrigger data-slot="menubar-sub-trigger" data-inset={inset} className={cn('flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground', className)} {...props}>
			{children}
			<ChevronRightIcon className="ml-auto h-4 w-4"/>
		</MenubarPrimitive.SubTrigger>;
};
var MenubarSubContent = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <MenubarPrimitive.SubContent data-slot="menubar-sub-content" className={cn('z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95', className)} {...props}/>;
};
export { Menubar, MenubarPortal, MenubarMenu, MenubarTrigger, MenubarContent, MenubarGroup, MenubarSeparator, MenubarLabel, MenubarItem, MenubarShortcut, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarSub, MenubarSubTrigger, MenubarSubContent, };
