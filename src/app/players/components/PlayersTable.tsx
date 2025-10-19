'use client'

import type { PlayerAdminDto, PlayerUserDto, Position, SkillTier } from '#app/types/dto'
import type { SortOption, FilterState } from '../types'
import { PlayerRow } from './PlayerRow'
import { POSITION_LABELS, SKILL_TIER_LABELS } from '../constants'

type PlayersTableProps = {
	players: PlayerAdminDto[] | PlayerUserDto[]
	isAdmin: boolean
	filterState: FilterState
	sortBy: SortOption
	selectedPlayerIds: Set<string>
	onFilterChange: (filterState: FilterState) => void
	onSortChange: (sortBy: SortOption) => void
	onPlayerSelect: (playerId: string, selected: boolean) => void
	onEdit?: (player: PlayerAdminDto) => void
	onDelete?: (playerId: string) => void
}

export function PlayersTable({
	players,
	isAdmin,
	filterState,
	sortBy,
	selectedPlayerIds,
	onFilterChange,
	onSortChange,
	onPlayerSelect,
	onEdit,
	onDelete,
}: PlayersTableProps) {
	const positions: Position[] = ['PG', 'SG', 'SF', 'PF', 'C']
	const skillTiers: SkillTier[] = ['S', 'A', 'B', 'C', 'D']

	const handleSearchChange = (searchQuery: string) => {
		onFilterChange({ ...filterState, searchQuery })
	}

	const handleSkillTierFilter = (skillTier: SkillTier | undefined) => {
		onFilterChange({ ...filterState, skillTier })
	}

	const handlePositionFilter = (position: Position | undefined) => {
		onFilterChange({ ...filterState, position })
	}

	const SortButton = ({
		value,
		label,
	}: {
		value: SortOption
		label: string
	}) => (
		<button
			onClick={() => onSortChange(value)}
			className={`text-xs font-medium px-2 py-1 rounded ${
				sortBy === value
					? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
					: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
			}`}
		>
			{label}
		</button>
	)

	return (
		<div className="space-y-4">
			{/* Search and Filters (Admin only) */}
			{isAdmin && (
				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{/* Search */}
						<div>
							<label
								htmlFor="search"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Search
							</label>
							<input
								id="search"
								type="text"
								value={filterState.searchQuery}
								onChange={e => handleSearchChange(e.target.value)}
								placeholder="Search by name..."
								className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>

						{/* Skill Tier Filter */}
						<div>
							<label
								htmlFor="skillTierFilter"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Skill Tier
							</label>
							<select
								id="skillTierFilter"
								value={filterState.skillTier || ''}
								onChange={e =>
									handleSkillTierFilter(
										e.target.value ? (e.target.value as SkillTier) : undefined
									)
								}
								className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="">All tiers</option>
								{skillTiers.map(tier => (
									<option key={tier} value={tier}>
										{SKILL_TIER_LABELS[tier]}
									</option>
								))}
							</select>
						</div>

						{/* Position Filter */}
						<div>
							<label
								htmlFor="positionFilter"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Position
							</label>
							<select
								id="positionFilter"
								value={filterState.position || ''}
								onChange={e =>
									handlePositionFilter(
										e.target.value ? (e.target.value as Position) : undefined
									)
								}
								className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="">All positions</option>
								{positions.map(pos => (
									<option key={pos} value={pos}>
										{POSITION_LABELS[pos]}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Sort Options */}
					<div className="mt-4 flex items-center gap-2">
						<span className="text-sm text-gray-600 dark:text-gray-400">
							Sort by:
						</span>
						<SortButton value="name" label="Name" />
						<SortButton value="skill_tier" label="Skill Tier" />
						<SortButton value="created_at" label="Recently Added" />
					</div>

					{/* Active Filters Summary */}
					{(filterState.searchQuery ||
						filterState.skillTier ||
						filterState.position) && (
						<div className="mt-3 flex items-center gap-2 flex-wrap">
							<span className="text-sm text-gray-600 dark:text-gray-400">
								Active filters:
							</span>
							{filterState.searchQuery && (
								<span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded">
									Search: {filterState.searchQuery}
									<button
										onClick={() => handleSearchChange('')}
										className="hover:text-blue-900 dark:hover:text-blue-100"
										aria-label="Clear search"
									>
										×
									</button>
								</span>
							)}
							{filterState.skillTier && (
								<span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded">
									{SKILL_TIER_LABELS[filterState.skillTier]}
									<button
										onClick={() => handleSkillTierFilter(undefined)}
										className="hover:text-blue-900 dark:hover:text-blue-100"
										aria-label="Clear skill tier filter"
									>
										×
									</button>
								</span>
							)}
							{filterState.position && (
								<span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded">
									{POSITION_LABELS[filterState.position]}
									<button
										onClick={() => handlePositionFilter(undefined)}
										className="hover:text-blue-900 dark:hover:text-blue-100"
										aria-label="Clear position filter"
									>
										×
									</button>
								</span>
							)}
							<button
								onClick={() =>
									onFilterChange({ searchQuery: '', skillTier: undefined, position: undefined })
								}
								className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
							>
								Clear all
							</button>
						</div>
					)}
				</div>
			)}

			{/* Table */}
			<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
				{players.length === 0 ? (
					<div className="px-6 py-12 text-center">
						<p className="text-gray-500 dark:text-gray-400">
							{filterState.searchQuery ||
							filterState.skillTier ||
							filterState.position
								? 'No players match the current filters.'
								: 'No players found. Add your first player to get started.'}
						</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
								<tr>
									{isAdmin && (
										<th className="px-4 py-3 text-left">
											<span className="sr-only">Select</span>
										</th>
									)}
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
										Name
									</th>
									{isAdmin && (
										<>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
												Skill Tier
											</th>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
												Positions
											</th>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
												Created At
											</th>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
												Actions
											</th>
										</>
									)}
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
								{players.map(player => (
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
				)}
			</div>

			{/* Results Summary */}
			{players.length > 0 && (
				<div className="text-sm text-gray-600 dark:text-gray-400">
					Showing {players.length} {players.length === 1 ? 'player' : 'players'}
				</div>
			)}
		</div>
	)
}
