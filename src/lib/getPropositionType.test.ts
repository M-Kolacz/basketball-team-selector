import { describe, expect, it } from 'vitest'
import { getPropositionType } from '#app/lib/getPropositionType'

describe('getPropositionType', () => {
	it('should return skill_balanced for index 0', () => {
		const result = getPropositionType(0)
		expect(result).toBe('skill_balanced')
	})

	it('should return position_focused for index 1', () => {
		const result = getPropositionType(1)
		expect(result).toBe('position_focused')
	})

	it('should return general for index 2', () => {
		const result = getPropositionType(2)
		expect(result).toBe('general')
	})

	it('should return general for out-of-bounds indices', () => {
		expect(getPropositionType(3)).toBe('general')
		expect(getPropositionType(100)).toBe('general')
		expect(getPropositionType(-1)).toBe('general')
	})
})
