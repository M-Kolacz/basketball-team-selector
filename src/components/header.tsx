import { MenuIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { LoginLink } from '#app/components/login-link'
import { LogoutButton } from '#app/components/logout-button'
import { Button } from '#app/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '#app/components/ui/dropdown-menu'
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from '#app/components/ui/navigation-menu'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '#app/components/ui/sheet'
import { getOptionalUser } from '#app/lib/auth.server'

export const Header = async () => {
	const currentUser = await getOptionalUser()

	const navLinks = [
		{ href: '/games', label: 'Games' },
		{ href: '/players', label: 'Players' },
		{ href: '/statistics', label: 'Statistics' },
	]

	return (
		<header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-14 items-center px-6">
				<div className="mr-4 flex">
					<Link href="/games" className="mr-6 flex items-center gap-2">
						<span className="font-bold">Basketball Teams</span>
					</Link>
				</div>

				<NavigationMenu className="hidden md:flex">
					<NavigationMenuList>
						{navLinks.map((link) => (
							<NavigationMenuItem key={link.href}>
								<NavigationMenuLink
									className={navigationMenuTriggerStyle()}
									asChild
								>
									<Link href={link.href}>{link.label}</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>

				<div className="ml-auto flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="hidden md:flex">
								<UserIcon className="size-5" />
								<span className="sr-only">User menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>
								<div className="flex flex-col gap-1">
									<p className="text-sm font-medium">
										{currentUser?.username || 'Guest'}
									</p>
									<p className="text-xs text-muted-foreground">
										{currentUser?.role === 'admin' ? 'Admin' : 'User'}
									</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								{currentUser?.id ? <LogoutButton /> : <LoginLink />}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Sheet>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="md:hidden">
								<MenuIcon className="size-5" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right">
							<SheetHeader>
								<SheetTitle>Menu</SheetTitle>
							</SheetHeader>
							<div className="flex flex-col gap-4 pt-4">
								<div className="flex flex-col gap-1">
									<p className="text-sm font-medium">
										{currentUser?.username || 'Guest'}
									</p>
									<p className="text-xs text-muted-foreground">
										{currentUser?.role === 'admin' ? 'Admin' : 'User'}
									</p>
								</div>
								<div className="flex flex-col gap-2">
									{navLinks.map((link) => (
										<Link key={link.href} href={link.href}>
											<Button variant="ghost" className="w-full justify-start">
												{link.label}
											</Button>
										</Link>
									))}
								</div>
								<div className="border-t pt-4">
									{currentUser?.id ? <LogoutButton /> : <LoginLink />}
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	)
}
