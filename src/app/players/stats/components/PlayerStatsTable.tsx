import { Card } from '#app/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '#app/components/ui/table'
import { type PlayerStats } from '#app/lib/actions/player-stats'

type PlayerStatsTableProps = {
	playerStats: PlayerStats
}

export function PlayerStatsTable({ playerStats }: PlayerStatsTableProps) {
	return (
		<Card>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Player Name</TableHead>
						<TableHead className="text-right">Total Games</TableHead>
						<TableHead className="text-right">Games Won</TableHead>
						<TableHead className="text-right">Games Lost</TableHead>
						<TableHead className="text-right">Win Ratio</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{playerStats.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={5}
								className="h-24 text-center text-muted-foreground"
							>
								No player statistics available.
							</TableCell>
						</TableRow>
					) : (
						playerStats.map((stat) => (
							<TableRow key={stat.id}>
								<TableCell className="font-medium">{stat.name}</TableCell>
								<TableCell className="text-right">{stat.totalGames}</TableCell>
								<TableCell className="text-right">{stat.gamesWon}</TableCell>
								<TableCell className="text-right">{stat.gamesLost}</TableCell>
								<TableCell className="text-right">
									{stat.winRatio.toFixed(1)}%
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</Card>
	)
}
