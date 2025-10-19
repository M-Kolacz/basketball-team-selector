import {
	type SkillTier,
	type Position,
	type PlayerAdminDto,
	type PlayerUserDto,
} from '#app/types/dto'

export type SortOption = 'name' | 'skill_tier' | 'created_at'

export type FilterState = {
	skillTier?: SkillTier
	position?: Position
	searchQuery: string
}

export type BulkSelectionState = {
	selectedPlayerIds: Set<string>
	isAllSelected: boolean
}

export type BulkAction = 'delete_selected'

export type PlayersListViewModel = {
	players: PlayerAdminDto[] | PlayerUserDto[]
	filteredPlayers: PlayerAdminDto[] | PlayerUserDto[]
	isAdmin: boolean
	filterState: FilterState
	sortBy: SortOption
	bulkSelection: BulkSelectionState
}

export type AddPlayerFormData = {
	name: string
	skillTier: SkillTier | ''
	positions: Position[]
}

export type EditPlayerFormData = {
	name: string
	skillTier: SkillTier
	positions: Position[]
}

export type ValidationErrors = {
	name?: string[]
	skillTier?: string[]
	positions?: string[]
}

export type FormState =
	| { status: 'idle' }
	| { status: 'submitting' }
	| { status: 'success'; message: string }
	| { status: 'error'; message: string; errors?: ValidationErrors }
