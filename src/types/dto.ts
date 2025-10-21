import {
	type User,
	type Player,
	type Team,
	type GameSession,
	type Proposition,
	type UserRole,
	type SkillTier,
	type Position,
	type PropositionType,
} from '#app/lib/db.server'

export type PaginationDto = {
	page: number
	limit: number
	total: number
	totalPages: number
}

export type LoginCommandDto = {
	username: string
	password: string
}

export type UserDto = Pick<User, 'id' | 'username' | 'role'>

export type LoginResponseDto = {
	user: UserDto
}

export type RegisterCommandDto = {
	username: string
	password: string
	confirmPassword: string
}

export type RegisterResponseDto = {
	user: UserDto
}

export type UserWithTimestampsDto = Omit<User, 'password'>

export type UsersListResponseDto = {
	users: UserWithTimestampsDto[]
	pagination: PaginationDto
}

export type CreateUserCommandDto = {
	username: string
	password: string
	role: UserRole
}

export type CreateUserResponseDto = Pick<
	User,
	'id' | 'username' | 'role' | 'createdAt'
>

export type PlayerAdminDto = Pick<
	Player,
	'id' | 'name' | 'skillTier' | 'positions' | 'createdAt' | 'updatedAt'
>

export type PlayerUserDto = Pick<Player, 'id' | 'name' | 'createdAt'>

export type PlayersListAdminResponseDto = {
	players: PlayerAdminDto[]
	pagination: PaginationDto
}

export type PlayersListUserResponseDto = {
	players: PlayerUserDto[]
	pagination: PaginationDto
}

export type CreatePlayerCommandDto = {
	name: string
	skillTier: SkillTier
	positions: Position[]
}

export type UpdatePlayerCommandDto = Partial<CreatePlayerCommandDto>

export type PlayerResponseDto = PlayerAdminDto

export type GameScoreDto = {
	score: number
	teamId: string
}

type Games = {
	score: number
	teamId: string
}[][]

export type GameDto = GameScoreDto[]

export type GameSessionDto = Pick<
	GameSession,
	'id' | 'gameDatetime' | 'description' | 'selectedPropositionId' | 'createdAt'
> & {
	games: GameDto[]
}

export type GameSessionsListResponseDto = {
	gameSessions: GameSessionDto[]
	pagination: PaginationDto
}

export type CreateGameSessionCommandDto = {
	gameDatetime: Date | string
	description?: string
}

export type GameSessionDetailDto = Pick<
	GameSession,
	| 'id'
	| 'gameDatetime'
	| 'description'
	| 'selectedPropositionId'
	| 'createdAt'
	| 'updatedAt'
> & {
	games: GameDto[]
	availablePlayers: string[]
	propositions: PropositionSummaryDto[]
}

export type SetAvailablePlayersCommandDto = {
	playerIds: string[]
}

export type GeneratePropositionsCommandDto = {
	regenerate: boolean
}

export type SelectPropositionCommandDto = {
	propositionId: string
}

export type RecordGameResultsCommandDto = {
	games: GameDto[]
}

export type TeamDto = Pick<Team, 'id'>

export type TeamWithPlayersDto = Pick<Team, 'id'> & {
	players: PlayerAdminDto[]
}

export type PropositionSummaryDto = Pick<
	Proposition,
	'id' | 'type' | 'createdAt'
>

export type PropositionDto = Pick<Proposition, 'id' | 'type'> & {
	teams: TeamDto[]
}

export type PropositionWithDetailsDto = Pick<
	Proposition,
	'id' | 'gameSessionId' | 'type' | 'createdAt'
> & {
	teams: TeamWithPlayersDto[]
}

export type GeneratePropositionsResponseDto = {
	propositions: PropositionWithDetailsDto[]
}

export type UpdatePropositionTeamsCommandDto = {
	team1PlayerIds: string[]
	team2PlayerIds: string[]
}

export type { UserRole, SkillTier, Position, PropositionType }
