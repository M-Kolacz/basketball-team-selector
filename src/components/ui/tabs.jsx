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
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';
import { cn } from '#app/lib/utils';
var Tabs = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <TabsPrimitive.Root data-slot="tabs" className={cn('flex flex-col gap-2', className)} {...props}/>;
};
var TabsList = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <TabsPrimitive.List data-slot="tabs-list" className={cn('inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground', className)} {...props}/>;
};
var TabsTrigger = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <TabsPrimitive.Trigger data-slot="tabs-trigger" className={cn("inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:shadow-sm dark:text-muted-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)} {...props}/>;
};
var TabsContent = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <TabsPrimitive.Content data-slot="tabs-content" className={cn('flex-1 outline-none', className)} {...props}/>;
};
export { Tabs, TabsList, TabsTrigger, TabsContent };
