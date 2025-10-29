'use client'

import { LogOutIcon } from 'lucide-react'
import { Button } from '#app/components/ui/button'
import { DropdownMenuItem } from '#app/components/ui/dropdown-menu'
import { logout } from '#app/lib/actions/auth'

export const LogoutButton = ({
	variant = 'dropdown',
}: {
	variant?: 'dropdown' | 'button'
}) => {
	const handleLogout = async () => {
		await logout()
	}

	if (variant === 'dropdown') {
		return (
			<DropdownMenuItem onClick={handleLogout}>
				<LogOutIcon className="size-4" />
				Logout
			</DropdownMenuItem>
		)
	}

	return (
		<Button
			variant="ghost"
			className="w-full justify-start"
			onClick={handleLogout}
		>
			<LogOutIcon className="size-4" />
			Logout
		</Button>
	)
}
