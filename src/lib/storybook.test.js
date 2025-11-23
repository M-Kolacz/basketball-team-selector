import { describe, expect, it } from 'vitest';
import { disableControls, getObjectKeys, selectControl, } from '#app/lib/storybook';
describe('disableControls', function () {
    it('should return empty argTypes object when no controls are provided', function () {
        var result = disableControls();
        expect(result).toEqual({ argTypes: {} });
    });
    it('should disable a single control', function () {
        var result = disableControls('onClick');
        expect(result).toEqual({
            argTypes: {
                onClick: { table: { disable: true } },
            },
        });
    });
    it('should disable multiple controls', function () {
        var result = disableControls('onClick', 'className', 'style');
        expect(result).toEqual({
            argTypes: {
                onClick: { table: { disable: true } },
                className: { table: { disable: true } },
                style: { table: { disable: true } },
            },
        });
    });
});
describe('selectControl', function () {
    it('should create a select control with provided options', function () {
        var options = ['option1', 'option2', 'option3'];
        var result = selectControl(options);
        expect(result).toEqual({
            control: 'select',
            options: ['option1', 'option2', 'option3'],
        });
    });
    it('should handle empty options array', function () {
        var options = [];
        var result = selectControl(options);
        expect(result).toEqual({
            control: 'select',
            options: [],
        });
    });
});
describe('getObjectKeys', function () {
    it('should return keys of an object', function () {
        var obj = { name: 'John', age: 30, active: true };
        var keys = getObjectKeys(obj);
        expect(keys).toEqual(['name', 'age', 'active']);
    });
    it('should return empty array for empty object', function () {
        var obj = {};
        var keys = getObjectKeys(obj);
        expect(keys).toEqual([]);
    });
    it('should preserve type information for keys', function () {
        var obj = { foo: 1, bar: 2 };
        var keys = getObjectKeys(obj);
        // Type-level check (will fail at compile time if types are wrong)
        var _typeCheck = keys;
        expect(_typeCheck).toBeDefined();
        expect(keys).toEqual(['foo', 'bar']);
    });
});
