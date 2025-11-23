/**
 * Maps proposition array index to PropositionType enum value.
 * Based on AI prompt in createTeamPropositions.ts:
 * - Index 0: Skill-Based Balance → skill_balanced
 * - Index 1: Position-Based Balance → position_focused
 * - Index 2: Mixed Approach → general
 * 
 * @param index - The zero-based index of the proposition in the array
 * @returns The PropositionType enum value ('skill_balanced', 'position_focused', or 'general')
 * 
 * @example
 * getPropositionType(0) // Returns 'skill_balanced'
 * getPropositionType(1) // Returns 'position_focused'
 * getPropositionType(2) // Returns 'general'
 * getPropositionType(99) // Returns 'general' (fallback)
 */
export const getPropositionType = (index: number) => {
	const types = ['skill_balanced', 'position_focused', 'general'] as const
	return types[index] ?? 'general'
}
