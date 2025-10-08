import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { Avatar, AvatarImage, AvatarFallback } from './avatar'

const meta = {
	title: 'UI/Avatar',
	component: Avatar,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: () => (
		<Avatar>
			<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
			<AvatarFallback>CN</AvatarFallback>
		</Avatar>
	),
}

export const WithFallback: Story = {
	render: () => (
		<Avatar>
			<AvatarImage src="https://invalid-url.com/image.png" alt="@user" />
			<AvatarFallback>JD</AvatarFallback>
		</Avatar>
	),
}

export const FallbackOnly: Story = {
	render: () => (
		<Avatar>
			<AvatarFallback>AB</AvatarFallback>
		</Avatar>
	),
}

export const Multiple: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<Avatar>
				<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarImage src="https://invalid-url.com/image.png" alt="@user" />
				<AvatarFallback>JD</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarFallback>AB</AvatarFallback>
			</Avatar>
		</div>
	),
}
