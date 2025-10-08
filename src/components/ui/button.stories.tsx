import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from '@storybook/test'
import { Plus } from 'lucide-react'
import {
	disableControls,
	getObjectKeys,
	selectControl,
} from '#app/lib/storybook'
import { Button, sizeStyles, variantStyles } from './button'

const buttonVariants = getObjectKeys(variantStyles)
const buttonSizes = getObjectKeys(sizeStyles)

const meta = {
	title: 'UI/Button',
	component: Button,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		variant: selectControl(buttonVariants),
		size: selectControl(buttonSizes),
	},
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const AllVariants: Story = {
	render: (args) => (
		<div className="flex items-center gap-3">
			{buttonVariants.map((variant) => (
				<Button key={variant} {...args} variant={variant}>
					{variant}
				</Button>
			))}
		</div>
	),
	...disableControls<typeof Button>('variant'),
}

export const AllSizes: Story = {
	render: (args) => (
		<div className="flex items-center gap-3">
			{buttonSizes.map((size) => (
				<Button key={size} size={size} {...args}>
					{size === 'icon' ? <Plus /> : size}
				</Button>
			))}
		</div>
	),
	...disableControls('size'),
}

export const AsLink: Story = {
	args: {
		variant: 'link',
		size: 'default',
		children: 'Button as Link',
		asChild: true,
	},
	render: (args) => (
		<Button {...args}>
			<a href="https://example.com" target="_blank" rel="noreferrer">
				{args.children}
			</a>
		</Button>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const link = canvas.getByRole('link', { name: args.children as string })
		await expect(link).toBeVisible()
	},
	...disableControls<typeof Button>('asChild', 'variant', 'size', 'children'),
}
