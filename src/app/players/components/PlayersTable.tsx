import { PlayerRow } from '#app/app/players/components/PlayerRow'
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
		<div className="space-y-4">
			<div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
							<tr>
								{isAdmin && (
									<th className="px-4 py-3 text-left">
										<span className="sr-only">Select</span>
									</th>
								)}
								<th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
									Name
								</th>
								{isAdmin && (
									<>
										<th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
											Skill Tier
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
											Positions
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
											Created At
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
											Actions
										</th>
									</>
								)}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
							{players.map((player) => (
								<PlayerRow
									key={player.id}
									player={player}
									isAdmin={isAdmin}
									isSelected={selectedPlayerIds.has(player.id)}
									onSelect={onPlayerSelect}
									onEdit={onEdit}
									onDelete={onDelete}
								/>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
