import { describe, expect, it } from 'vitest'
import {
	disableControls,
	getObjectKeys,
	selectControl,
} from '#app/lib/storybook'

describe('disableControls', () => {
	it('should return empty argTypes object when no controls are provided', () => {
		const result = disableControls()
		expect(result).toEqual({ argTypes: {} })
	})

	it('should disable a single control', () => {
		const result = disableControls<'button'>('onClick')
		expect(result).toEqual({
			argTypes: {
				onClick: { table: { disable: true } },
			},
		})
	})

	it('should disable multiple controls', () => {
		const result = disableControls<'button'>('onClick', 'className', 'style')
		expect(result).toEqual({
			argTypes: {
				onClick: { table: { disable: true } },
				className: { table: { disable: true } },
				style: { table: { disable: true } },
			},
		})
	})
})

describe('selectControl', () => {
	it('should create a select control with provided options', () => {
		const options = ['option1', 'option2', 'option3'] as const
		const result = selectControl(options)

		expect(result).toEqual({
			control: 'select',
			options: ['option1', 'option2', 'option3'],
		})
	})

	it('should handle empty options array', () => {
		const options = [] as const
		const result = selectControl(options)

		expect(result).toEqual({
			control: 'select',
			options: [],
		})
	})
})

describe('getObjectKeys', () => {
	it('should return keys of an object', () => {
		const obj = { name: 'John', age: 30, active: true }
		const keys = getObjectKeys(obj)

		expect(keys).toEqual(['name', 'age', 'active'])
	})

	it('should return empty array for empty object', () => {
		const obj = {}
		const keys = getObjectKeys(obj)

		expect(keys).toEqual([])
	})

	it('should preserve type information for keys', () => {
		const obj = { foo: 1, bar: 2 } as const
		const keys = getObjectKeys(obj)

		// Type-level check (will fail at compile time if types are wrong)
		const _typeCheck: ('foo' | 'bar')[] = keys
		expect(_typeCheck).toBeDefined()
		expect(keys).toEqual(['foo', 'bar'])
	})
})
