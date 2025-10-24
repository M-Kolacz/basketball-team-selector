export type GameDetailsViewModel = {
	id: string
	gameDatetime: Date
	description: string | null
	games: GameScoreViewModel[]
	selectedProposition: {
		id: string
		type: PropositionType
		teams: TeamViewModel[]
	} | null
	allPropositions: PropositionViewModel[]
}

export type GameScoreViewModel = { score: number; teamId: string }[]

export type TeamViewModel = {
	id: string
	players: PlayerViewModel[]
}

export type PlayerViewModel = {
	id: string
	name: string
	skillTier: 'S' | 'A' | 'B' | 'C' | 'D'
	positions: ('PG' | 'SG' | 'SF' | 'PF' | 'C')[]
}

export type PropositionViewModel = {
	id: string
	type: PropositionType
	teams: TeamViewModel[]
}

export type PropositionType = 'position_focused' | 'skill_balanced' | 'general'
