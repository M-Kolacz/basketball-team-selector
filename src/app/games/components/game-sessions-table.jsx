'use client';
import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, } from '@tanstack/react-table';
import { useState } from 'react';
import { Button } from '#app/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '#app/components/ui/table';
export var GameSessionsTable = function (_a) {
    var _b;
    var columns = _a.columns, data = _a.data;
    var _c = useState([]), sorting = _c[0], setSorting = _c[1];
    var table = useReactTable({
        data: data,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting: sorting,
        },
    });
    return (<div>
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
						{((_b = table.getRowModel().rows) === null || _b === void 0 ? void 0 : _b.length) ? (table.getRowModel().rows.map(function (row) { return (<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
