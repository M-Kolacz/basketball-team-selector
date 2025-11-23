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
import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';
import { cn } from '#app/lib/utils';
var Drawer = function (_a) {
    var props = __rest(_a, []);
    return <DrawerPrimitive.Root data-slot="drawer" {...props}/>;
};
var DrawerTrigger = function (_a) {
    var props = __rest(_a, []);
    return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props}/>;
};
var DrawerPortal = function (_a) {
    var props = __rest(_a, []);
    return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props}/>;
};
var DrawerClose = function (_a) {
    var props = __rest(_a, []);
    return <DrawerPrimitive.Close data-slot="drawer-close" {...props}/>;
};
var DrawerOverlay = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <DrawerPrimitive.Overlay data-slot="drawer-overlay" className={cn('fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0', className)} {...props}/>;
};
var DrawerContent = function (_a) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return <DrawerPortal data-slot="drawer-portal">
			<DrawerOverlay />
			<DrawerPrimitive.Content data-slot="drawer-content" className={cn('group/drawer-content fixed z-50 flex h-auto flex-col bg-background', 'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b', 'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t', 'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm', 'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm', className)} {...props}>
				<div className="mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block"/>
				{children}
			</DrawerPrimitive.Content>
		</DrawerPortal>;
};
var DrawerHeader = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="drawer-header" className={cn('flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left', className)} {...props}/>;
};
var DrawerFooter = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="drawer-footer" className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props}/>;
};
var DrawerTitle = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <DrawerPrimitive.Title data-slot="drawer-title" className={cn('font-semibold text-foreground', className)} {...props}/>;
};
var DrawerDescription = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <DrawerPrimitive.Description data-slot="drawer-description" className={cn('text-sm text-muted-foreground', className)} {...props}/>;
};
export { Drawer, DrawerPortal, DrawerOverlay, DrawerTrigger, DrawerClose, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, };
