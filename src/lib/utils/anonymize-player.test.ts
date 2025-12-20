import { describe, expect, test } from 'vitest'
import { formatPlayerName } from '#app/lib/utils/anonymize-player'

describe('formatPlayerName', () => {
	test('admin sees full name with two words', () => {
		const result = formatPlayerName('John Doe', true)
		expect(result).toBe('John Doe')
	})

	test('admin sees full name with single word', () => {
		const result = formatPlayerName('John', true)
		expect(result).toBe('John')
	})

	test('admin sees full name with multiple words', () => {
		const result = formatPlayerName('John Michael Doe', true)
		expect(result).toBe('John Michael Doe')
	})

	test('non-admin sees anonymized name with two words', () => {
		const result = formatPlayerName('John Doe', false)
		expect(result).toBe('John D')
	})

	test('non-admin sees single word name unchanged', () => {
		const result = formatPlayerName('John', false)
		expect(result).toBe('John ')
	})

	test('non-admin sees anonymized name with multiple words (uses last name)', () => {
		const result = formatPlayerName('John Michael Doe', false)
		expect(result).toBe('John M')
	})

	test('handles empty surname gracefully for non-admin', () => {
		const result = formatPlayerName('John ', false)
		expect(result).toBe('John ')
	})
})
