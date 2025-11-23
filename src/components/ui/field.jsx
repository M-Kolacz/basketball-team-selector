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
import { cva } from 'class-variance-authority';
import { useMemo } from 'react';
import { Label } from '#app/components/ui/label';
import { Separator } from '#app/components/ui/separator';
import { cn } from '#app/lib/utils';
var FieldSet = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <fieldset data-slot="field-set" className={cn('flex flex-col gap-6', 'has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3', className)} {...props}/>;
};
var FieldLegend = function (_a) {
    var className = _a.className, _b = _a.variant, variant = _b === void 0 ? 'legend' : _b, props = __rest(_a, ["className", "variant"]);
    return <legend data-slot="field-legend" data-variant={variant} className={cn('mb-3 font-medium', 'data-[variant=legend]:text-base', 'data-[variant=label]:text-sm', className)} {...props}/>;
};
var FieldGroup = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="field-group" className={cn('group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4', className)} {...props}/>;
};
var fieldVariants = cva('group/field flex w-full gap-3 data-[invalid=true]:text-destructive', {
    variants: {
        orientation: {
            vertical: ['flex-col [&>*]:w-full [&>.sr-only]:w-auto'],
            horizontal: [
                'flex-row items-center',
                '[&>[data-slot=field-label]]:flex-auto',
                'has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
            ],
            responsive: [
                'flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto',
                '@md/field-group:[&>[data-slot=field-label]]:flex-auto',
                '@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
            ],
        },
    },
    defaultVariants: {
        orientation: 'vertical',
    },
});
var Field = function (_a) {
    var className = _a.className, _b = _a.orientation, orientation = _b === void 0 ? 'vertical' : _b, props = __rest(_a, ["className", "orientation"]);
    return <div role="group" data-slot="field" data-orientation={orientation} className={cn(fieldVariants({ orientation: orientation }), className)} {...props}/>;
};
var FieldContent = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="field-content" className={cn('group/field-content flex flex-1 flex-col gap-1.5 leading-snug', className)} {...props}/>;
};
var FieldLabel = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <Label data-slot="field-label" className={cn('group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50', 'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4', 'has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5 dark:has-data-[state=checked]:bg-primary/10', className)} {...props}/>;
};
var FieldTitle = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <div data-slot="field-label" className={cn('flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50', className)} {...props}/>;
};
var FieldDescription = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return <p data-slot="field-description" className={cn('text-sm leading-normal font-normal text-muted-foreground group-has-[[data-orientation=horizontal]]/field:text-balance', 'last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5', '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary', className)} {...props}/>;
};
var FieldSeparator = function (_a) {
    var children = _a.children, className = _a.className, props = __rest(_a, ["children", "className"]);
    return <div data-slot="field-separator" data-content={!!children} className={cn('relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2', className)} {...props}>
			<Separator className="absolute inset-0 top-1/2"/>
			{children && (<span className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground" data-slot="field-separator-content">
					{children}
				</span>)}
		</div>;
};
var FieldError = function (_a) {
    var className = _a.className, children = _a.children, errors = _a.errors, props = __rest(_a, ["className", "children", "errors"]);
    var content = useMemo(function () {
        if (children) {
            return children;
        }
        if (!(errors === null || errors === void 0 ? void 0 : errors.length)) {
            return null;
        }
        if ((errors === null || errors === void 0 ? void 0 : errors.length) == 1) {
            return errors[0];
        }
        return (<ul className="ml-4 flex list-disc flex-col gap-1">
				{errors.map(function (error, index) { return error && <li key={index}>{error}</li>; })}
			</ul>);
    }, [children, errors]);
    if (!content) {
        return null;
    }
    return (<div role="alert" data-slot="field-error" className={cn('text-sm font-normal text-destructive', className)} {...props}>
			{content}
		</div>);
};
export { Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldLegend, FieldSeparator, FieldSet, FieldContent, FieldTitle, };
