'use client'

import Link, { type LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '#app/components/ui/button'

export const LoginLink = (props: Partial<LinkProps>) => {
	const pathname = usePathname()

	return (
		<Link href={`/login?redirectTo=${pathname}`} className="w-full" {...props}>
			<Button variant="ghost" className="w-full justify-start">
				Login
			</Button>
		</Link>
	)
}
