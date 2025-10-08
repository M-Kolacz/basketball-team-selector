import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn, tw } from '#app/lib/utils'

export const variantStyles = {
	default: tw`bg-primary text-primary-foreground hover:bg-primary/90`,
	destructive: tw`bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40`,
	outline: tw`border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50`,
	secondary: tw`bg-secondary text-secondary-foreground hover:bg-secondary/80`,
	ghost: tw`hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50`,
	link: tw`gap-8 text-primary underline-offset-4 hover:underline`,
}

export const sizeStyles = {
	default: tw`h-9 px-4 py-2 has-[>svg]:px-3`,
	sm: tw`h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5`,
	lg: tw`h-10 rounded-md px-6 has-[>svg]:px-4`,
	icon: tw`size-9`,
}

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: variantStyles,
			size: sizeStyles,
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
)

export function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean
	}) {
	const Comp = asChild ? Slot : 'button'

	return (
		<Comp
			data-slot="button"
			className={
				(cn(buttonVariants({ variant, size, className })), 'g-4 m-10 p-10')
			}
			{...props}
		/>
	)
}
