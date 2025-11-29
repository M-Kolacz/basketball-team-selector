import { MenuIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { LoginLink } from '#app/components/login-link'
import { LogoutButton } from '#app/components/logout-button'
import { Avatar, AvatarImage, AvatarFallback } from '#app/components/ui/avatar'
import { Button } from '#app/components/ui/button'
import {
	DrawerTrigger,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
	DrawerFooter,
	DrawerClose,
	Drawer,
} from '#app/components/ui/drawer'
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
					<div className="hidden items-center gap-2 md:flex">
						{currentUser?.role === 'admin' ? (
							<Avatar>
								<AvatarImage
									src="https://github.com/shadcn.png"
									alt="@shadcn"
								/>
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
						) : null}
						{currentUser ? <LogoutButton /> : <LoginLink />}
					</div>

					<Drawer direction="right">
						<DrawerTrigger asChild>
							<Button variant="ghost" size="icon" className="md:hidden">
								<MenuIcon className="size-5" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</DrawerTrigger>
						<DrawerContent>
							<DrawerHeader>
								<DrawerTitle>Basketball Teams</DrawerTitle>
							</DrawerHeader>
							<div className="flex flex-col gap-2 p-4">
								{navLinks.map((link) => (
									<DrawerClose key={link.href} asChild>
										<Link href={link.href}>
											<Button variant="outline" className="w-full">
												{link.label}
											</Button>
										</Link>
									</DrawerClose>
								))}
								<div className="border-t pt-4">
									{currentUser?.id ? (
										<LogoutButton />
									) : (
										<DrawerClose asChild>
											<LoginLink />
										</DrawerClose>
									)}
								</div>
							</div>

							<DrawerFooter>
								<DrawerClose asChild>
									<Button variant="outline">Close</Button>
								</DrawerClose>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>
				</div>
			</div>
		</header>
	)
}
