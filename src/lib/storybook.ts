import type React from 'react'

export const disableControls = <T extends React.ElementType>(
	...controls: (keyof React.ComponentProps<T>)[]
) => ({
	argTypes: controls.reduce<Record<string, { table: { disable: boolean } }>>(
		(acc, control) => ({
			...acc,
			[control]: { table: { disable: true } },
		}),
		{},
	),
})

export const selectControl = <T extends readonly string[]>(options: T) => ({
	control: 'select' as const,
	options: [...options],
})

export const getObjectKeys = <T extends Record<string, unknown>>(
	obj: T,
): (keyof T)[] => Object.keys(obj) as (keyof T)[]
