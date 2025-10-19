import { type BulkAction } from '#app/app/players/types'

type BulkActionBarProps = {
	selectedCount: number
	isAllSelected: boolean
	onSelectAll: (selected: boolean) => void
	onBulkAction: (action: BulkAction) => void
	onClearSelection: () => void
}

export function BulkActionBar({
	selectedCount,
	isAllSelected,
	onSelectAll,
	onBulkAction,
	onClearSelection,
}: BulkActionBarProps) {
	if (selectedCount === 0) return null

	return (
		<div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					{/* Selection Info */}
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={isAllSelected}
							onChange={(e) => onSelectAll(e.target.checked)}
							className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
							aria-label="Select all players"
						/>
						<span className="text-sm font-medium text-gray-900 dark:text-gray-100">
							{selectedCount} {selectedCount === 1 ? 'player' : 'players'}{' '}
							selected
						</span>
					</div>

					{/* Clear Selection */}
					<button
						onClick={onClearSelection}
						className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
					>
						Clear selection
					</button>
				</div>

				{/* Bulk Actions */}
				<div className="flex items-center gap-2">
					<button
						onClick={() => onBulkAction('delete_selected')}
						className="rounded bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
					>
						Delete Selected
					</button>
				</div>
			</div>
		</div>
	)
}
