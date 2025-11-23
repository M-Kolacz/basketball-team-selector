'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '#app/components/ui/button';
export var LoginLink = function () {
    var pathname = usePathname();
    return (<Link href={"/login?redirectTo=".concat(pathname)} className="w-full">
			<Button variant="ghost" className="w-full justify-start">
				Login
			</Button>
		</Link>);
};
