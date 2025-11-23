'use client';
import { format } from 'date-fns';
import { ArrowUpDown, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { DeleteGameForm } from '#app/app/games/components/delete-game-form';
import { EditGameForm } from '#app/app/games/components/edit-game-form';
import { Button } from '#app/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from '#app/components/ui/dropdown-menu';
import { Spinner } from '#app/components/ui/spinner';
export var createGameSessionColumns = function (_a) {
    var isAdmin = _a.isAdmin, players = _a.players;
    return [
        {
            accessorKey: 'gameDatetime',
            header: function (_a) {
                var column = _a.column;
                return (<Button variant="ghost" onClick={function () { return column.toggleSorting(column.getIsSorted() === 'asc'); }}>
					Game Date
					<ArrowUpDown className="ml-2 h-4 w-4"/>
				</Button>);
            },
            cell: function (_a) {
                var row = _a.row;
                var gameId = row.original.id;
                var date = row.getValue('gameDatetime');
                var isOptimistic = gameId.startsWith('temp-');
                return (<div className="flex items-center gap-4">
					<span className={isOptimistic ? 'opacity-50' : ''}>
						{format(date, 'MMMM d, yyyy')}
					</span>
					{isOptimistic && <Spinner />}
				</div>);
            },
        },
        {
            id: 'gamesCount',
            accessorKey: 'gamesCount',
            header: function (_a) {
                var column = _a.column;
                return (<Button variant="ghost" onClick={function () { return column.toggleSorting(column.getIsSorted() === 'asc'); }}>
					Number of games
					<ArrowUpDown className="ml-2 h-4 w-4"/>
				</Button>);
            },
            cell: function (_a) {
                var row = _a.row;
                var count = row.getValue('gamesCount');
                return <span>{count}</span>;
            },
        },
        {
            accessorKey: 'actions',
            id: 'Actions',
            header: 'Actions',
            cell: function (_a) {
                var row = _a.row;
                var gameId = row.original.id;
                var gameSession = row.original;
                return (<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open game history actions</span>
							<MoreHorizontal className="h-4 w-4"/>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem asChild>
							<Link href={"/games/".concat(gameId)}>
								<ArrowUpRight className="h-4 w-4"/>
								Check game details
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						{isAdmin && (<DropdownMenuItem asChild>
								<EditGameForm gameSession={gameSession} allPlayers={players}/>
							</DropdownMenuItem>)}
						{isAdmin && (<DropdownMenuItem asChild>
								<DeleteGameForm gameId={gameId}/>
							</DropdownMenuItem>)}
					</DropdownMenuContent>
				</DropdownMenu>);
            },
        },
    ];
};
