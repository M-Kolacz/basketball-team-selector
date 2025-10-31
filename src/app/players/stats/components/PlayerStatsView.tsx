'use client'

import { PlayerStatsTable } from '#app/app/players/stats/components/PlayerStatsTable'
import { type PlayerStats } from '#app/lib/actions/player-stats'

type PlayerStatsViewProps = {
	playerStats: PlayerStats
}

export const PlayerStatsView = ({ playerStats }: PlayerStatsViewProps) => <div className="container mx-auto max-w-7xl px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Player Statistics</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					View player performance and win ratios
				</p>
			</div>

			<PlayerStatsTable playerStats={playerStats} />
		</div>;
