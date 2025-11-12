import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const tw = (strings: TemplateStringsArray, ...values: unknown[]) =>
	String.raw({ raw: strings }, ...values)

const DEFAULT_REDIRECT = '/games'
export const safeRedirect = (
	to: FormDataEntryValue | string | null | undefined,
	defaultRedirect: string = DEFAULT_REDIRECT,
) => {
	if (!to || typeof to !== 'string') return defaultRedirect

	let trimmedTo = to.trim()

	if (
		!trimmedTo.startsWith('/') ||
		trimmedTo.startsWith('//') ||
		trimmedTo.startsWith('/\\') ||
		trimmedTo.includes('..')
	) {
		return defaultRedirect
	}

	return trimmedTo
}
