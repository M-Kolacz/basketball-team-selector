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
import { Slot } from '@radix-ui/react-slot';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import * as React from 'react';
import { cn } from '#app/lib/utils';
var Breadcrumb = function (_a) {
    var props = __rest(_a, []);
    return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props}/>;
};
var BreadcrumbList = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <ol data-slot="breadcrumb-list" className={cn('flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground sm:gap-2.5', className)} {...props}/>;
};
var BreadcrumbItem = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <li data-slot="breadcrumb-item" className={cn('inline-flex items-center gap-1.5', className)} {...props}/>;
};
var BreadcrumbLink = function (_a) {
    var asChild = _a.asChild, className = _a.className, props = __rest(_a, ["asChild", "className"]);
    var Comp = asChild ? Slot : 'a';
    return (<Comp data-slot="breadcrumb-link" className={cn('transition-colors hover:text-foreground', className)} {...props}/>);
};
var BreadcrumbPage = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <span data-slot="breadcrumb-page" role="link" aria-disabled="true" aria-current="page" className={cn('font-normal text-foreground', className)} {...props}/>;
};
var BreadcrumbSeparator = function (_a) {
    var children = _a.children, className = _a.className, props = __rest(_a, ["children", "className"]);
    return <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" className={cn('[&>svg]:size-3.5', className)} {...props}>
			{children !== null && children !== void 0 ? children : <ChevronRight />}
		</li>;
};
var BreadcrumbEllipsis = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <span data-slot="breadcrumb-ellipsis" role="presentation" aria-hidden="true" className={cn('flex size-9 items-center justify-center', className)} {...props}>
			<MoreHorizontal className="size-4"/>
			<span className="sr-only">More</span>
		</span>;
};
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis, };
