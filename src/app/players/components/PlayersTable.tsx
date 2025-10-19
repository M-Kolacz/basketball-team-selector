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
import { type PlayerAdminDto, type PlayerUserDto } from '#app/types/dto'

type PlayersTableProps = {
	players: PlayerAdminDto[] | PlayerUserDto[]
	isAdmin: boolean
	selectedPlayerIds: Set<string>
	onPlayerSelect: (playerId: string, selected: boolean) => void
	onEdit?: (player: PlayerAdminDto) => void
	onDelete?: (playerId: string) => void
}

export function PlayersTable({
	players,
	isAdmin,
	selectedPlayerIds,
	onPlayerSelect,
	onEdit,
	onDelete,
}: PlayersTableProps) {
	return (
		<Card>
			<Table>
				<TableHeader>
					<TableRow>
						{isAdmin && (
							<TableHead className="w-12">
								<span className="sr-only">Select</span>
							</TableHead>
						)}
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
								isSelected={selectedPlayerIds.has(player.id)}
								onSelect={onPlayerSelect}
								onEdit={onEdit}
							/>
						))
					)}
				</TableBody>
			</Table>
		</Card>
	)
}
