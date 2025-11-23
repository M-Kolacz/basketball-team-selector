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
import { cn } from '#app/lib/utils';
var Card = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="card" className={cn('flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm', className)} {...props}/>;
};
var CardHeader = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="card-header" className={cn('@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6', className)} {...props}/>;
};
var CardTitle = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="card-title" className={cn('leading-none font-semibold', className)} {...props}/>;
};
var CardDescription = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="card-description" className={cn('text-sm text-muted-foreground', className)} {...props}/>;
};
var CardAction = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="card-action" className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)} {...props}/>;
};
var CardContent = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="card-content" className={cn('px-6', className)} {...props}/>;
};
var CardFooter = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="card-footer" className={cn('flex items-center px-6 [.border-t]:pt-6', className)} {...props}/>;
};
export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent, };
