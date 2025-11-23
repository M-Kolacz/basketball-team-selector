'use client';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { DeletePlayerForm } from '#app/app/players/components/delete-player-form';
import { EditPlayerDialog } from '#app/app/players/components/edit-player-form';
import { POSITION_LABELS, SKILL_TIER_COLORS, SKILL_TIER_LABELS, } from '#app/app/players/constants';
import { Badge } from '#app/components/ui/badge';
import { Button } from '#app/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from '#app/components/ui/dropdown-menu';
export var columns = [
    {
        accessorKey: 'name',
        header: function (_a) {
            var column = _a.column;
            return (<Button variant="ghost" onClick={function () { return column.toggleSorting(column.getIsSorted() === 'asc'); }}>
					Player name
					<ArrowUpDown className="ml-2 h-4 w-4"/>
				</Button>);
        },
    },
    {
        id: 'skillTier',
        accessorKey: 'skillTier',
        header: function (_a) {
            var column = _a.column;
            return (<Button variant="ghost" onClick={function () { return column.toggleSorting(column.getIsSorted() === 'asc'); }}>
					Skill Tier
					<ArrowUpDown className="ml-2 h-4 w-4"/>
				</Button>);
        },
        cell: function (_a) {
            var row = _a.row;
            var skillTier = row.getValue('skillTier');
            return (<Badge variant="secondary" className={SKILL_TIER_COLORS[skillTier]}>
					{SKILL_TIER_LABELS[skillTier]}
				</Badge>);
        },
    },
    {
        accessorKey: 'positions',
        header: 'Positions',
        cell: function (_a) {
            var row = _a.row;
            var positions = row.getValue('positions');
            return (<div className="flex flex-wrap gap-1">
					{positions.map(function (pos) { return (<Badge key={pos} variant="outline">
							{POSITION_LABELS[pos]}
						</Badge>); })}
				</div>);
        },
    },
    {
        accessorKey: 'createdAt',
        header: function (_a) {
            var column = _a.column;
            return (<Button variant="ghost" onClick={function () { return column.toggleSorting(column.getIsSorted() === 'asc'); }}>
					Created At
					<ArrowUpDown className="ml-2 h-4 w-4"/>
				</Button>);
        },
        cell: function (_a) {
            var row = _a.row;
            var createdAt = row.getValue('createdAt');
            return (<div className="text-sm text-muted-foreground">
					{new Date(createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })}
				</div>);
        },
    },
    {
        accessorKey: 'actions',
        id: 'Actions',
        header: 'Actions',
        cell: function (_a) {
            var row = _a.row;
            var player = row.original;
            return (<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4"/>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem asChild>
							<EditPlayerDialog player={player}/>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<DeletePlayerForm player={player}/>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>);
        },
    },
];
