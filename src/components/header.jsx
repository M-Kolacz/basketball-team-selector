var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { MenuIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { LoginLink } from '#app/components/login-link';
import { LogoutButton } from '#app/components/logout-button';
import { Button } from '#app/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from '#app/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle, } from '#app/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, } from '#app/components/ui/sheet';
import { getOptionalUser } from '#app/lib/auth.server';
export var Header = function () { return __awaiter(void 0, void 0, void 0, function () {
    var currentUser, navLinks;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getOptionalUser()];
            case 1:
                currentUser = _a.sent();
                navLinks = [
                    { href: '/games', label: 'Games' },
                    { href: '/players', label: 'Players' },
                    { href: '/statistics', label: 'Statistics' },
                ];
                return [2 /*return*/, (<header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-14 items-center px-6">
				<div className="mr-4 flex">
					<Link href="/games" className="mr-6 flex items-center gap-2">
						<span className="font-bold">Basketball Teams</span>
					</Link>
				</div>

				<NavigationMenu className="hidden md:flex">
					<NavigationMenuList>
						{navLinks.map(function (link) { return (<NavigationMenuItem key={link.href}>
								<NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
									<Link href={link.href}>{link.label}</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>); })}
					</NavigationMenuList>
				</NavigationMenu>

				<div className="ml-auto flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="hidden md:flex">
								<UserIcon className="size-5"/>
								<span className="sr-only">User menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>
								<div className="flex flex-col gap-1">
									<p className="text-sm font-medium">
										{(currentUser === null || currentUser === void 0 ? void 0 : currentUser.username) || 'Guest'}
									</p>
									<p className="text-xs text-muted-foreground">
										{(currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) === 'admin' ? 'Admin' : 'User'}
									</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								{(currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) ? <LogoutButton /> : <LoginLink />}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Sheet>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="md:hidden">
								<MenuIcon className="size-5"/>
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
										{(currentUser === null || currentUser === void 0 ? void 0 : currentUser.username) || 'Guest'}
									</p>
									<p className="text-xs text-muted-foreground">
										{(currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) === 'admin' ? 'Admin' : 'User'}
									</p>
								</div>
								<div className="flex flex-col gap-2">
									{navLinks.map(function (link) { return (<Link key={link.href} href={link.href}>
											<Button variant="ghost" className="w-full justify-start">
												{link.label}
											</Button>
										</Link>); })}
								</div>
								<div className="border-t pt-4">
									{(currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) ? <LogoutButton /> : <LoginLink />}
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>)];
        }
    });
}); };
