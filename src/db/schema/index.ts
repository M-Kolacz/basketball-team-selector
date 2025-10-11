export {
	userRoleEnum,
	skillTierEnum,
	positionEnum,
	propositionTypeEnum,
	type UserRole,
	type SkillTier,
	type Position,
	type PropositionType,
} from './enums'

export { users, type User, type NewUser } from './users'
export { players, type Player, type NewPlayer } from './players'
export {
	gameSessions,
	type GameSession,
	type NewGameSession,
	type Game,
} from './gameSessions'
export {
	propositions,
	type Proposition,
	type NewProposition,
} from './propositions'
export { teams, type Team, type NewTeam } from './teams'
export { gameSessionsRelations, propositionsRelations } from './relations'

export * as schema from './index'
