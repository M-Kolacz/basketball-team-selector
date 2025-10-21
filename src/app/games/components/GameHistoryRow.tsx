'use client'

import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { type GameHistoryViewModel } from '#app/app/games/utils/transform'
import { TableRow, TableCell } from '#app/components/ui/table'

interface GameHistoryRowProps {
	game: GameHistoryViewModel
}

export function GameHistoryRow({ game }: GameHistoryRowProps) {
	const router = useRouter()

	const handleRowClick = () => {
		router.push(`/games/${game.id}`)
	}

	const formattedDate = format(game.gameDatetime, "MMM d, yyyy 'at' h:mm a")

	return (
		<TableRow
			onClick={handleRowClick}
			className="cursor-pointer hover:bg-muted/70"
		>
			<TableCell>{formattedDate}</TableCell>
			<TableCell>{game.games.length}</TableCell>
		</TableRow>
	)
}
