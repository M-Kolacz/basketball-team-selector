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
import { GripVerticalIcon } from 'lucide-react';
import * as React from 'react';
import * as ResizablePrimitive from 'react-resizable-panels';
import { cn } from '#app/lib/utils';
var ResizablePanelGroup = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <ResizablePrimitive.PanelGroup data-slot="resizable-panel-group" className={cn('flex h-full w-full data-[panel-group-direction=vertical]:flex-col', className)} {...props}/>;
};
var ResizablePanel = function (_a) {
    var props = __rest(_a, []);
    return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props}/>;
};
var ResizableHandle = function (_a) {
    var withHandle = _a.withHandle, className = _a.className, props = __rest(_a, ["withHandle", "className"]);
    return <ResizablePrimitive.PanelResizeHandle data-slot="resizable-handle" className={cn('relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2 [&[data-panel-group-direction=vertical]>div]:rotate-90', className)} {...props}>
			{withHandle && (<div className="z-10 flex h-4 w-3 items-center justify-center rounded-xs border bg-border">
					<GripVerticalIcon className="size-2.5"/>
				</div>)}
		</ResizablePrimitive.PanelResizeHandle>;
};
export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
