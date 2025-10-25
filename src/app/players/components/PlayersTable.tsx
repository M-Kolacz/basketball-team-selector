import { PlayerRow } from '#app/app/players/components/PlayerRow'
import { Card } from '#app/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '#app/components/ui/table'
import { type Players } from '#app/lib/actions/players'

type Player = Players[number]

type PlayersTableProps = {
	players: Players
	isAdmin: boolean
	onEdit?: (player: Player) => void
}

export function PlayersTable({ players, isAdmin, onEdit }: PlayersTableProps) {
	return (
		<Card>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						{isAdmin && (
							<>
								<TableHead>Skill Tier</TableHead>
								<TableHead>Positions</TableHead>
								<TableHead>Created At</TableHead>
								<TableHead>Actions</TableHead>
							</>
						)}
					</TableRow>
				</TableHeader>
				<TableBody>
					{players.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={isAdmin ? 6 : 1}
								className="h-24 text-center text-muted-foreground"
							>
								No players found.
							</TableCell>
						</TableRow>
					) : (
						players.map((player) => (
							<PlayerRow
								key={player.id}
								player={player}
								isAdmin={isAdmin}
								onEdit={onEdit}
							/>
						))
					)}
				</TableBody>
			</Table>
		</Card>
	)
}
