'use client'

import { AlertTriangle } from 'lucide-react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '#app/components/ui/alert-dialog'

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
	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<div className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-destructive" />
						<AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
					</div>
					<AlertDialogDescription>
						{isBulkDelete ? (
							<>
								Are you sure you want to delete{' '}
								<strong>{deleteCount}</strong>{' '}
								{deleteCount === 1 ? 'player' : 'players'}? This action cannot
								be undone.
							</>
						) : (
							<>
								Are you sure you want to delete <strong>{playerName}</strong>?
								This action cannot be undone.
							</>
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isDeleting} onClick={onCancel}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						disabled={isDeleting}
						onClick={onConfirm}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						{isDeleting ? 'Deleting...' : 'Delete'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
