'use client';
import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, } from '@tanstack/react-table';
import { useState } from 'react';
import { Button } from '#app/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, } from '#app/components/ui/dropdown-menu';
import { Input } from '#app/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '#app/components/ui/table';
export var DataTable = function (_a) {
    var _b, _c, _d;
    var columns = _a.columns, data = _a.data;
    var _e = useState([]), sorting = _e[0], setSorting = _e[1];
    var _f = useState([]), columnFilters = _f[0], setColumnFilters = _f[1];
    var _g = useState({}), columnVisibility = _g[0], setColumnVisibility = _g[1];
    var table = useReactTable({
        data: data,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting: sorting,
            columnFilters: columnFilters,
            columnVisibility: columnVisibility,
        },
    });
    return (<div>
			<div className="flex items-center gap-6 py-4">
				<Input placeholder="Filter players..." value={(_c = (_b = table.getColumn('name')) === null || _b === void 0 ? void 0 : _b.getFilterValue()) !== null && _c !== void 0 ? _c : ''} onChange={function (event) { var _a; return (_a = table.getColumn('name')) === null || _a === void 0 ? void 0 : _a.setFilterValue(event.target.value); }} className="max-w-sm"/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">Columns</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
            .getAllColumns()
            .filter(function (column) { return column.getCanHide(); })
            .map(function (column) {
            return (<DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={function (value) {
                    return column.toggleVisibility(!!value);
                }}>
										{column.id}
									</DropdownMenuCheckboxItem>);
        })}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(function (headerGroup) { return (<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(function (header) {
                return (<TableHead key={header.id}>
											{header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>);
            })}
							</TableRow>); })}
					</TableHeader>
					<TableBody>
						{((_d = table.getRowModel().rows) === null || _d === void 0 ? void 0 : _d.length) ? (table.getRowModel().rows.map(function (row) { return (<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map(function (cell) { return (<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>); })}
								</TableRow>); })) : (<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button variant="outline" size="sm" onClick={function () { return table.previousPage(); }} disabled={!table.getCanPreviousPage()}>
					Previous
				</Button>
				<Button variant="outline" size="sm" onClick={function () { return table.nextPage(); }} disabled={!table.getCanNextPage()}>
					Next
				</Button>
			</div>
		</div>);
};
