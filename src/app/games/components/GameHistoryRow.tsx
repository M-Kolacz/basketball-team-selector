'use client'

import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { TableRow, TableCell } from '#app/components/ui/table'
import { type GameSessionAction } from '#app/lib/actions/game-sessions'

interface GameHistoryRowProps {
	gameSession: GameSessionAction
}

export function GameHistoryRow({ gameSession }: GameHistoryRowProps) {
	const router = useRouter()

	const handleRowClick = () => {
		router.push(`/games/${gameSession.id}`)
	}

	console.log({ gameSession })

	const formattedDate = format(
		gameSession.gameDatetime,
		"MMM d, yyyy 'at' h:mm a",
	)

	return (
		<TableRow
			onClick={handleRowClick}
			className="cursor-pointer hover:bg-muted/70"
		>
			<TableCell>{formattedDate}</TableCell>
			<TableCell>{gameSession.games.length}</TableCell>
		</TableRow>
	)
}
