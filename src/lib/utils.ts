import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const tw = (strings: TemplateStringsArray, ...values: unknown[]) =>
	String.raw({ raw: strings }, ...values)
