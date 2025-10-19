type DeleteConfirmationDialogProps = {
	isOpen: boolean
	playerName?: string
	isBulkDelete?: boolean
	deleteCount?: number
	isDeleting?: boolean
	onConfirm: () => void
	onCancel: () => void
}

export function DeleteConfirmationDialog({
	isOpen,
	playerName,
	isBulkDelete = false,
	deleteCount = 0,
	isDeleting = false,
	onConfirm,
	onCancel,
}: DeleteConfirmationDialogProps) {
	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div
				className="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800"
				role="dialog"
				aria-labelledby="dialog-title"
				aria-describedby="dialog-description"
			>
				{/* Header */}
				<div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
					<h2
						id="dialog-title"
						className="text-lg font-semibold text-gray-900 dark:text-gray-100"
					>
						Confirm Deletion
					</h2>
				</div>

				{/* Content */}
				<div className="px-6 py-4">
					<div className="flex items-start gap-3">
						{/* Warning Icon */}
						<div className="flex-shrink-0">
							<svg
								className="h-6 w-6 text-red-600 dark:text-red-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						</div>

						{/* Message */}
						<div className="flex-1">
							<p
								id="dialog-description"
								className="text-sm text-gray-700 dark:text-gray-300"
							>
								{isBulkDelete ? (
									<>
										Are you sure you want to delete{' '}
										<strong>{deleteCount}</strong>{' '}
										{deleteCount === 1 ? 'player' : 'players'}? This action
										cannot be undone.
									</>
								) : (
									<>
										Are you sure you want to delete{' '}
										<strong>{playerName}</strong>? This action cannot be undone.
									</>
								)}
							</p>
						</div>
					</div>
				</div>

				<div className="flex justify-end gap-3 rounded-b-lg bg-gray-50 px-6 py-4 dark:bg-gray-900">
					<button
						onClick={onCancel}
						disabled={isDeleting}
						className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						disabled={isDeleting}
						className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isDeleting ? 'Deleting...' : 'Delete'}
					</button>
				</div>
			</div>
		</div>
	)
}
