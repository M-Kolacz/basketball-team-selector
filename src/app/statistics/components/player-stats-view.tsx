'use client'

import { columns } from '#app/app/statistics/components/columns'
import { DataTable } from '#app/app/statistics/components/data-table'
import { type PlayersStatisticts } from '#app/lib/actions/player-stats'

type PlayerStatsViewProps = {
	playerStats: PlayersStatisticts
}

export const PlayerStatsView = ({ playerStats }: PlayerStatsViewProps) => (
	<div className="max-w-8xl container mx-auto px-4 py-8">
		<div className="mb-8">
			<h1 className="text-3xl font-bold">Player Statistics</h1>
			<p className="mt-2 text-sm text-muted-foreground">
				View player performance and win ratios
			</p>
		</div>

		<DataTable columns={columns} data={playerStats} />
	</div>
)
