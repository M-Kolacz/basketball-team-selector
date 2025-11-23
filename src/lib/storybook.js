var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
export var disableControls = function () {
    var controls = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        controls[_i] = arguments[_i];
    }
    return ({
        argTypes: controls.reduce(function (acc, control) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[control] = { table: { disable: true } }, _a)));
        }, {}),
    });
};
export var selectControl = function (options) { return ({
    control: 'select',
    options: __spreadArray([], options, true),
}); };
export var getObjectKeys = function (obj) { return Object.keys(obj); };
