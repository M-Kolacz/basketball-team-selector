import type { BulkAction } from '../types'

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
		<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3 mb-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					{/* Selection Info */}
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={isAllSelected}
							onChange={e => onSelectAll(e.target.checked)}
							className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
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
						className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
					>
						Clear selection
					</button>
				</div>

				{/* Bulk Actions */}
				<div className="flex items-center gap-2">
					<button
						onClick={() => onBulkAction('delete_selected')}
						className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded"
					>
						Delete Selected
					</button>
				</div>
			</div>
		</div>
	)
}
