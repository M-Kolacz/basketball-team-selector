var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
import { cn, tw } from '#app/lib/utils';
export var variantStyles = {
    default: tw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["bg-primary text-primary-foreground hover:bg-primary/90"], ["bg-primary text-primary-foreground hover:bg-primary/90"]))),
    destructive: tw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40"], ["bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40"]))),
    outline: tw(templateObject_3 || (templateObject_3 = __makeTemplateObject(["border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"], ["border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"]))),
    secondary: tw(templateObject_4 || (templateObject_4 = __makeTemplateObject(["bg-secondary text-secondary-foreground hover:bg-secondary/80"], ["bg-secondary text-secondary-foreground hover:bg-secondary/80"]))),
    ghost: tw(templateObject_5 || (templateObject_5 = __makeTemplateObject(["hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"], ["hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"]))),
    link: tw(templateObject_6 || (templateObject_6 = __makeTemplateObject(["gap-8 text-primary underline-offset-4 hover:underline"], ["gap-8 text-primary underline-offset-4 hover:underline"]))),
};
export var sizeStyles = {
    default: tw(templateObject_7 || (templateObject_7 = __makeTemplateObject(["h-9 px-4 py-2 has-[>svg]:px-3"], ["h-9 px-4 py-2 has-[>svg]:px-3"]))),
    sm: tw(templateObject_8 || (templateObject_8 = __makeTemplateObject(["h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5"], ["h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5"]))),
    lg: tw(templateObject_9 || (templateObject_9 = __makeTemplateObject(["h-10 rounded-md px-6 has-[>svg]:px-4"], ["h-10 rounded-md px-6 has-[>svg]:px-4"]))),
    icon: tw(templateObject_10 || (templateObject_10 = __makeTemplateObject(["size-9"], ["size-9"]))),
};
export var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: variantStyles,
        size: sizeStyles,
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});
export var Button = function (_a) {
    var className = _a.className, variant = _a.variant, size = _a.size, _b = _a.asChild, asChild = _b === void 0 ? false : _b, props = __rest(_a, ["className", "variant", "size", "asChild"]);
    var Comp = asChild ? Slot : 'button';
    return (<Comp data-slot="button" className={cn(buttonVariants({ variant: variant, size: size, className: className }))} {...props}/>);
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
