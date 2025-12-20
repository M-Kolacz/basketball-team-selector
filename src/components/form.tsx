import { useControl } from '@conform-to/react/future'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '#app/components/ui/button'
import { Calendar } from '#app/components/ui/calendar'
import { Checkbox as ShadcnCheckbox } from '#app/components/ui/checkbox'
import {
	MultiSelect as ShadcnMultiSelect,
	MultiSelectTrigger,
	MultiSelectValue,
	MultiSelectContent,
	MultiSelectItem,
} from '#app/components/ui/multi-select'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '#app/components/ui/popover'
import {
	SelectTrigger,
	Select as ShadcnSelect,
	SelectValue,
	SelectContent,
	SelectItem,
} from '#app/components/ui/select'
import { cn } from '#app/lib/utils'

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

export type DatePickerProps = {
	id?: string
	name: string
	defaultValue?: string
	['aria-describedby']?: string
}

export const DatePicker = ({
	name,
	defaultValue,
	...props
}: DatePickerProps) => {
	const triggerRef = useRef<HTMLButtonElement>(null)
	const control = useControl({
		defaultValue,
		onFocus: () => {
			triggerRef.current?.focus()
		},
	})

	return (
		<>
			<input ref={control.register} name={name} hidden />
			<Popover
				onOpenChange={(open) => {
					if (!open) {
						control.blur()
					}
				}}
			>
				<PopoverTrigger asChild>
					<Button
						{...props}
						ref={triggerRef}
						variant={'outline'}
						className={cn(
							'w-64 justify-start text-left font-normal focus:ring-2 focus:ring-stone-950 focus:ring-offset-2',
							!control.value && 'text-muted-foreground',
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{control.value ? (
							format(control.value, 'PPP')
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar
						mode="single"
						selected={new Date(control.value ?? '')}
						onSelect={(value) => control.change(value?.toISOString() ?? '')}
						autoFocus
					/>
				</PopoverContent>
			</Popover>
		</>
	)
}

export type MultiSelectProps = {
	id?: string
	name: string
	items: Array<{ name: string; value: string }>
	placeholder: string
	defaultValue?: string[]
	searchPlaceholder?: string
	emptyMessage?: string
	['aria-describedby']?: string
}

export const MultiSelect = ({
	name,
	items,
	placeholder,
	defaultValue,
	searchPlaceholder = 'Search...',
	emptyMessage = 'No results found.',
	...props
}: MultiSelectProps) => {
	const triggerRef = useRef<HTMLButtonElement>(null)
	const control = useControl({
		defaultValue,
		onFocus: () => {
			triggerRef.current?.focus()
		},
	})

	return (
		<>
			<select multiple name={name} ref={control.register} hidden>
				{(control.options ?? []).map((value) => (
					<option key={value} value={value} />
				))}
			</select>
			<ShadcnMultiSelect
				values={control.options ?? []}
				onValuesChange={(values) => control.change(values)}
				onOpenChange={(open) => {
					if (!open) {
						control.blur()
					}
				}}
			>
				<MultiSelectTrigger {...props} ref={triggerRef}>
					<MultiSelectValue placeholder={placeholder} />
				</MultiSelectTrigger>
				<MultiSelectContent
					search={{ placeholder: searchPlaceholder, emptyMessage }}
				>
					{items.map((item) => (
						<MultiSelectItem key={item.value} value={item.value}>
							{item.name}
						</MultiSelectItem>
					))}
				</MultiSelectContent>
			</ShadcnMultiSelect>
		</>
	)
}
