import { useControl } from '@conform-to/react/future'
import { useRef } from 'react'
import { Checkbox as ShadcnCheckbox } from '#app/components/ui/checkbox'
import {
	SelectTrigger,
	Select as ShadcnSelect,
	SelectValue,
	SelectContent,
	SelectItem,
} from '#app/components/ui/select'

export type SelectProps = {
	id?: string
	name: string
	items: Array<{ name: string; value: string }>
	placeholder: string
	defaultValue?: string
	['aria-describedby']?: string
}

export const Select = ({
	name,
	items,
	placeholder,
	defaultValue,
	...props
}: SelectProps) => {
	const selectRef = useRef<React.ElementRef<typeof SelectTrigger>>(null)
	const control = useControl({
		defaultValue,
		onFocus: () => {
			selectRef.current?.focus()
		},
	})

	return (
		<>
			<input name={name} ref={control.register} hidden />
			<ShadcnSelect
				value={control.value}
				onValueChange={(value) => control.change(value)}
				onOpenChange={(open) => {
					if (!open) {
						control.blur()
					}
				}}
			>
				<SelectTrigger {...props} ref={selectRef}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{items.map((item) => {
						return (
							<SelectItem key={item.value} value={item.value}>
								{item.name}
							</SelectItem>
						)
					})}
				</SelectContent>
			</ShadcnSelect>
		</>
	)
}

export type CheckboxProps = {
	id?: string
	name: string
	value?: string
	defaultChecked?: boolean
	['aria-describedby']?: string
}

export const Checkbox = ({
	name,
	value,
	defaultChecked,
	...props
}: CheckboxProps) => {
	const checkboxRef = useRef<React.ElementRef<typeof ShadcnCheckbox>>(null)
	const control = useControl({
		defaultChecked,
		value,
		onFocus: () => {
			checkboxRef.current?.focus()
		},
	})

	return (
		<>
			<input type="checkbox" ref={control.register} name={name} hidden />
			<ShadcnCheckbox
				{...props}
				ref={checkboxRef}
				checked={control.checked}
				onCheckedChange={(checked) => control.change(checked)}
				onBlur={() => control.blur()}
				className="focus:ring-2 focus:ring-stone-950 focus:ring-offset-2"
			/>
		</>
	)
}
