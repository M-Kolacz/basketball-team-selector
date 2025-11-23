/**
 * Maps proposition array index to PropositionType enum value.
 * Based on AI prompt in createTeamPropositions.ts:
 * - Index 0: Skill-Based Balance → skill_balanced
 * - Index 1: Position-Based Balance → position_focused
 * - Index 2: Mixed Approach → general
 */
export const getPropositionType = (index: number) => {
	const types = ['skill_balanced', 'position_focused', 'general'] as const
	return types[index] ?? 'general'
}
