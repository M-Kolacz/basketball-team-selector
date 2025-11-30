import { type Metadata } from 'next'
import { PlayerStatsView } from '#app/app/statistics/components/player-stats-view'
import { getPlayerStats } from '#app/lib/actions/player-stats'

export const metadata: Metadata = {
	title: 'Player Statistics - Basketball Team Selector',
	description: 'View player performance statistics',
}

export default async function PlayerStatsPage() {
	const playerStats = await getPlayerStats()

	return <PlayerStatsView playerStats={playerStats} />
}
