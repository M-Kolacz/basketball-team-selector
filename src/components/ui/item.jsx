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
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { Separator } from '#app/components/ui/separator';
import { cn } from '#app/lib/utils';
var ItemGroup = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div role="list" data-slot="item-group" className={cn('group/item-group flex flex-col', className)} {...props}/>;
};
var ItemSeparator = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <Separator data-slot="item-separator" orientation="horizontal" className={cn('my-0', className)} {...props}/>;
};
var itemVariants = cva('group/item flex items-center border border-transparent text-sm rounded-md transition-colors [a]:hover:bg-accent/50 [a]:transition-colors duration-100 flex-wrap outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]', {
    variants: {
        variant: {
            default: 'bg-transparent',
            outline: 'border-border',
            muted: 'bg-muted/50',
        },
        size: {
            default: 'p-4 gap-4 ',
            sm: 'py-3 px-4 gap-2.5',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});
var Item = function (_a) {
    var className = _a.className, _b = _a.variant, variant = _b === void 0 ? 'default' : _b, _c = _a.size, size = _c === void 0 ? 'default' : _c, _d = _a.asChild, asChild = _d === void 0 ? false : _d, props = __rest(_a, ["className", "variant", "size", "asChild"]);
    var Comp = asChild ? Slot : 'div';
    return (<Comp data-slot="item" data-variant={variant} data-size={size} className={cn(itemVariants({ variant: variant, size: size, className: className }))} {...props}/>);
};
var itemMediaVariants = cva('flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none group-has-[[data-slot=item-description]]/item:translate-y-0.5', {
    variants: {
        variant: {
            default: 'bg-transparent',
            icon: "size-8 border rounded-sm bg-muted [&_svg:not([class*='size-'])]:size-4",
            image: 'size-10 rounded-sm overflow-hidden [&_img]:size-full [&_img]:object-cover',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});
var ItemMedia = function (_a) {
    var className = _a.className, _b = _a.variant, variant = _b === void 0 ? 'default' : _b, props = __rest(_a, ["className", "variant"]);
    return <div data-slot="item-media" data-variant={variant} className={cn(itemMediaVariants({ variant: variant, className: className }))} {...props}/>;
};
var ItemContent = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="item-content" className={cn('flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none', className)} {...props}/>;
};
var ItemTitle = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="item-title" className={cn('flex w-fit items-center gap-2 text-sm leading-snug font-medium', className)} {...props}/>;
};
var ItemDescription = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <p data-slot="item-description" className={cn('line-clamp-2 text-sm leading-normal font-normal text-balance text-muted-foreground', '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary', className)} {...props}/>;
};
var ItemActions = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="item-actions" className={cn('flex items-center gap-2', className)} {...props}/>;
};
var ItemHeader = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="item-header" className={cn('flex basis-full items-center justify-between gap-2', className)} {...props}/>;
};
var ItemFooter = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="item-footer" className={cn('flex basis-full items-center justify-between gap-2', className)} {...props}/>;
};
export { Item, ItemMedia, ItemContent, ItemActions, ItemGroup, ItemSeparator, ItemTitle, ItemDescription, ItemHeader, ItemFooter, };
