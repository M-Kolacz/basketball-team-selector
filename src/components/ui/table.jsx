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
import { cn } from '#app/lib/utils';
var Table = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="table-container" className="relative w-full overflow-x-auto">
			<table data-slot="table" className={cn('w-full caption-bottom text-sm', className)} {...props}/>
		</div>;
};
var TableHeader = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <thead data-slot="table-header" className={cn('[&_tr]:border-b', className)} {...props}/>;
};
var TableBody = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <tbody data-slot="table-body" className={cn('[&_tr:last-child]:border-0', className)} {...props}/>;
};
var TableFooter = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <tfoot data-slot="table-footer" className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)} {...props}/>;
};
var TableRow = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <tr data-slot="table-row" className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)} {...props}/>;
};
var TableHead = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <th data-slot="table-head" className={cn('h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]', className)} {...props}/>;
};
var TableCell = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <td data-slot="table-cell" className={cn('p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]', className)} {...props}/>;
};
var TableCaption = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <caption data-slot="table-caption" className={cn('mt-4 text-sm text-muted-foreground', className)} {...props}/>;
};
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, };
