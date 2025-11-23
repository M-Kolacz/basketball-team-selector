'use client';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '#app/components/ui/button';
export var columns = [
    {
        accessorKey: 'name',
        header: function (_a) {
            var column = _a.column;
            return (<Button className="w-full" variant="ghost" onClick={function () { return column.toggleSorting(column.getIsSorted() === 'asc'); }}>
					Player Name
					<ArrowUpDown className="ml-2 h-4 w-4"/>
				</Button>);
        },
        cell: function (_a) {
            var row = _a.row;
            var playerName = row.getValue('name');
            return <span className="block w-full text-left">{playerName}</span>;
        },
    },
    {
        id: 'gameSessions',
        accessorKey: 'gameSessions',
        header: function (_a) {
            var column = _a.column;
            return (<Button className="w-full" variant="ghost" onClick={function () { return column.toggleSorting(column.getIsSorted() === 'asc'); }}>
					Number of the game sessions played
					<ArrowUpDown className="ml-2 h-4 w-4"/>
				</Button>);
        },
        cell: function (_a) {
            var row = _a.row;
            var gameSessions = row.getValue('gameSessions');
            return <span className="block w-full text-right">{gameSessions}</span>;
        },
    },
    {
        id: 'totalGames',
        accessorKey: 'totalGames',
        header: function (_a) {
            var column = _a.column;
            return (<Button className="w-full" variant="ghost" onClick={function () { return column.toggleSorting(column.getIsSorted() === 'asc'); }}>
					Total number of games played
					<ArrowUpDown className="ml-2 h-4 w-4"/>
				</Button>);
        },
        cell: function (_a) {
            var row = _a.row;
            var totalGames = row.getValue('totalGames');
            return <span className="block w-full text-right">{totalGames}</span>;
        },
    },
    {
        id: 'gamesWon',
        accessorKey: 'gamesWon',
        header: function (_a) {
            var column = _a.column;
            return (<Button className="w-full" variant="ghost" onClick={function () { return column.toggleSorting(column.getIsSorted() === 'asc'); }}>
					Total number of won games
					<ArrowUpDown className="ml-2 h-4 w-4"/>
				</Button>);
        },
        cell: function (_a) {
            var row = _a.row;
            var gamesWon = row.getValue('gamesWon');
            return <span className="block w-full text-right">{gamesWon}</span>;
        },
    },
    {
        id: 'gamesLost',
        accessorKey: 'gamesLost',
        header: function (_a) {
            var column = _a.column;
            return (<Button className="w-full" variant="ghost" onClick={function () { return column.toggleSorting(column.getIsSorted() === 'asc'); }}>
					Total number of lost games
					<ArrowUpDown className="ml-2 h-4 w-4"/>
				</Button>);
        },
        cell: function (_a) {
            var row = _a.row;
            var gamesLost = row.getValue('gamesLost');
            return <span className="block w-full text-right">{gamesLost}</span>;
        },
    },
    {
        id: 'winRatio',
        accessorKey: 'winRatio',
        header: function (_a) {
            var column = _a.column;
            return (<Button className="w-full" variant="ghost" onClick={function () { return column.toggleSorting(column.getIsSorted() === 'asc'); }}>
					Win ratio
					<ArrowUpDown className="ml-2 h-4 w-4"/>
				</Button>);
        },
        cell: function (_a) {
            var row = _a.row;
            var ratio = row.getValue('winRatio');
            return (<span className="block w-full text-right">{ratio.toFixed(2)}%</span>);
        },
    },
];
