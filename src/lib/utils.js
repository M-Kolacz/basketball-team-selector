var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export var cn = function () {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    return twMerge(clsx(inputs));
};
export var tw = function (strings) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    return String.raw.apply(String, __spreadArray([{ raw: strings }], values, false));
};
var DEFAULT_REDIRECT = '/games';
export var safeRedirect = function (to, defaultRedirect) {
    if (defaultRedirect === void 0) { defaultRedirect = DEFAULT_REDIRECT; }
    if (!to || typeof to !== 'string')
        return defaultRedirect;
    var trimmedTo = to.trim();
    if (!trimmedTo.startsWith('/') ||
        trimmedTo.startsWith('//') ||
        trimmedTo.startsWith('/\\') ||
        trimmedTo.includes('..')) {
        return defaultRedirect;
    }
    return trimmedTo;
};
