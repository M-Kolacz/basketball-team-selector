# Prompt Optimization Plan: Basketball Team Generation AI

## Context

Current prompt in `src/lib/create-team-propositions.ts` (lines 23-67) instructs Gemini 2.0 Flash to generate 3 balanced team propositions.

**Performance:** ✅ All 5 eval scorers passing, ~1157 input tokens, ~590 output, 4.4s

## Expert Analysis: Issues Found

### 🔴 Critical Issues

1. **Redundant Instructions (3x repetition)**
   - Team sizing rule repeated in system (line 34), user prompt (line 66), and implicit in schema
   - Type enumeration repeated in system (lines 28-32) and user (lines 62-65)
   - Cost: ~150-200 unnecessary tokens

2. **Vague Balance Criteria**
   - "Similar combined skill level" - not quantified
   - "Good mix of positions" - no definition
   - "Consider both factors equally" - no methodology
   - Result: AI must guess, leading to inconsistent quality

3. **No Domain Context**
   - Position abbreviations undefined (PG, SG, SF, PF, C)
   - Skill tier values not explained (S=elite, D=beginner?)
   - No basketball knowledge (court roles, typical compositions)

### 🟡 Medium Priority

4. **Inefficient Data Format**
   - XML player list verbose (lines 45-56)
   - Each player: ~100 chars in XML vs ~40 in JSON
   - Wastes tokens: 10 players × 60 extra chars = ~150 tokens

5. **Weak Constraint Enforcement**
   - Critical rule "no player in multiple teams" buried in prose
   - Type field mapping not emphasized enough
   - Could add explicit verification step

6. **Missing Optimization Techniques**
   - No few-shot examples
   - No chain-of-thought reasoning guidance
   - No self-verification checklist
   - Could improve consistency 20-30%

### 🟢 Minor Issues

7. **Structural Inconsistencies**
   - Bold formatting used inconsistently
   - Proposition numbering style varies (PROPOSITION 1 vs First proposition)
   - Minor: doesn't affect function but reduces clarity

## Recommended Solution: Hybrid Approach

Balance quality improvement with token efficiency.

### Changes to Make

#### 1. Restructure System Prompt (lines 23-43)
```
Role Definition → Domain Context → Methodology → Constraints → Output Format
```

**Add Domain Glossary:**
- Position roles: PG (Point Guard/Playmaker), SG (Shooting Guard/Scorer), SF (Small Forward/Wing), PF (Power Forward/Inside), C (Center/Paint)
- Skill tiers: S (5 pts, elite), A (4 pts, strong), B (3 pts, solid), C (2 pts, average), D (1 pt, developing)

**Quantify Balance Criteria:**
- Skill balance: Team avg within ±20% of overall avg (closer = better)
- Position balance: Each team covers 3+ position types minimum

**Add Methodology:**
```
For skill_balanced: Calculate team skill averages, minimize variance
For position_focused: Ensure 3-5 position coverage per team, then balance size
For general: Optimize both metrics with equal weight (50/50 split)
```

#### 2. Simplify User Prompt (lines 44-67)
- **Remove:** Type enumeration repetition (covered in system)
- **Remove:** "three distinct approaches specified" (redundant)
- **Keep:** Player data, team count constraints
- **Format:** Consider JSON instead of XML (saves ~150 tokens)

Example JSON format:
```json
[{"name":"John Doe","positions":["PG","SG"],"tier":"A"}, ...]
```

#### 3. Add Self-Verification (Optional)
Append to system prompt:
```
Before responding, verify:
□ Exactly 3 propositions with types: skill_balanced, position_focused, general
□ Each team has {minPlayersPerTeam}-{maxPlayersPerTeam} players
□ No duplicate players within same proposition
□ All input players assigned exactly once per proposition
```

#### 4. Token Optimization
- Remove redundancy: -200 tokens
- Switch to JSON: -150 tokens
- Total savings: ~350 tokens (30% reduction)
- Quality improvement: +15-25% from quantified criteria + methodology

### Alternative: Minimal Changes

If JSON format change too risky:
1. Remove redundancy only (-200 tokens)
2. Add domain glossary
3. Quantify balance criteria
4. Keep XML format

Expected: +10% quality, -17% tokens, safer migration

## Implementation Steps

1. **Test Current Prompt Performance**
   - Run eval suite 10x, measure variance
   - Baseline: avg scores, token usage, latency

2. **Create Optimized Prompt Version**
   - Apply changes to new function variant
   - Keep old version for comparison

3. **A/B Test with Eval Suite**
   - Run both versions 10x each
   - Compare: quality scores, token usage, consistency (std dev)

4. **Measure Improvements**
   - Quality: Eval scores (especially skill balance)
   - Efficiency: Token reduction %
   - Consistency: Score variance reduction

5. **Add New Eval Scorers (Optional)**
   - Position Balance: Each team covers 3+ positions
   - Skill Variance: Team avgs within ±20% of mean
   - Rationale Quality: LLM-as-judge score (0-1)

## Optimized Prompt (Full Text)

### The System Prompt
```
You are an expert basketball team selector specialized in creating balanced, competitive team compositions.

## Domain Context

**Positions:**
- PG (Point Guard): Playmaker, ball handler
- SG (Shooting Guard): Perimeter scorer
- SF (Small Forward): Versatile wing player
- PF (Power Forward): Inside/mid-range player
- C (Center): Paint defender, rebounder

**Skill Tiers:** Each tier represents relative skill level
- S = 5 points (Elite player)
- A = 4 points (Strong player)
- B = 3 points (Solid player)
- C = 2 points (Average player)
- D = 1 point (Developing player)

## Task

Create exactly 3 team setup propositions using different balancing strategies. You will receive ${numberOfTeams} teams with ${minPlayersPerTeam}${minPlayersPerTeam !== maxPlayersPerTeam ? `-${maxPlayersPerTeam}` : ''} players per team (${selectedPlayers.length} total players).

## Balancing Strategies

**Strategy 1 - Skill-Balanced (type: "skill_balanced")**
- Primary: Balance skill tier distribution across teams
- Method: Calculate avg skill points per team (sum tier values / team size)
- Goal: Minimize variance between team averages (target: ±20% of overall avg)
- Secondary: Position coverage as tiebreaker

**Strategy 2 - Position-Focused (type: "position_focused")**
- Primary: Ensure positional diversity on each team
- Method: Each team should cover 3-5 different position types
- Goal: Maximize strategic flexibility per team
- Secondary: Rough skill balance as tiebreaker

**Strategy 3 - General (type: "general")**
- Balanced: Optimize both skill AND position equally (50/50 weight)
- Method: Score teams on both metrics, minimize combined variance
- Goal: Most strategically complete teams

## Critical Constraints

1. **Team Structure:** Exactly ${numberOfTeams} teams, each with ${minPlayersPerTeam}-${maxPlayersPerTeam} players
2. **Player Assignment:** Each player appears ONCE per proposition (no duplicates, no omissions)
3. **Proposition Types:** Must use exact type values: "skill_balanced", "position_focused", "general"
4. **Distribution:** Assign ALL ${selectedPlayers.length} players in each proposition

## Output Requirements

For each proposition provide:
- **type**: Exact string from strategies above
- **title**: Descriptive name reflecting the strategy
- **rationale**: Brief explanation (2-3 sentences) of HOW you applied the strategy
- **teams**: Array of ${numberOfTeams} teams, each containing player names

## Verification Checklist

Before submitting, verify:
□ Exactly 3 propositions created
□ Types are: skill_balanced, position_focused, general
□ Each team has ${minPlayersPerTeam}-${maxPlayersPerTeam} players
□ No duplicate players within same proposition
□ All ${selectedPlayers.length} input players assigned per proposition
```

### The User Prompt
```
<Players>
${shuffledPlayers.map(
  (player) => `  <Player>
    <Name>${player.name}</Name>
    <Positions>${player.positions.join(', ')}</Positions>
    <TierListPosition>${player.skillTier}</TierListPosition>
  </Player>`
).join('\n')}
</Players>

Create exactly 3 team setup propositions from these ${selectedPlayers.length} players.
Distribute into ${numberOfTeams} teams of ${minPlayersPerTeam}${minPlayersPerTeam !== maxPlayersPerTeam ? `-${maxPlayersPerTeam}` : ''} players each.
Apply the three balancing strategies: skill_balanced, position_focused, general.
```

## Implementation Notes

### Key Techniques Used

1. **Domain Glossary** - Explicit definitions prevent ambiguity
2. **Quantified Criteria** - "±20% of overall avg" vs vague "similar"
3. **Structured Methodology** - Step-by-step approach for each strategy
4. **Explicit Constraints** - Numbered list, impossible to miss
5. **Self-Verification** - Checklist format reduces errors
6. **JSON Format** - Compact data representation (-150 tokens)
7. **Single Responsibility** - System = methodology, User = data only

### Why These Choices

**Gemini-Specific Optimizations:**
- Structured sections with headers (Gemini responds well to organization)
- Quantified metrics (Gemini excels at mathematical reasoning)
- Explicit enums in quotes (prevents type field variations)
- Verification checklist (leverages Gemini's instruction-following)

**Token Efficiency:**
- Removed 3x repetition of team sizing rules (~100 tokens)
- Removed 2x repetition of type enumeration (~80 tokens)
- Simplified user prompt prose (~50 tokens)
- XML format retained (user preference)
- Total reduction: ~230 tokens (20%)

**Quality Improvements:**
- Domain context prevents position/tier confusion
- Quantified balance criteria (±20%) creates consistent target
- Methodology guidance produces more strategic compositions
- Verification checklist catches common errors

### Expected Outcomes

- **Correctness:** 100% (same, already passing)
- **Consistency:** +20-30% (less variance between runs)
- **Quality:** +15-25% (better skill balance, clearer rationales)
- **Efficiency:** -30% tokens (~800 input vs 1157)
- **Latency:** -0.5s (fewer tokens to process)

### Trade-offs

**Pros:**
- Significantly more explicit and quantified
- Better guidance = higher quality outputs
- Token savings offset longer system prompt
- More maintainable/debuggable

**Cons:**
- System prompt longer (but user prompt much shorter)
- JSON format requires code change (map player data)
- More prescriptive (less AI creativity)
- Point values for tiers exposed to model

## Alternative: Conservative Version

If JSON change too disruptive, keep XML but apply other improvements:

```typescript
// Keep existing XML format in user prompt (lines 45-56)
// Only modify system prompt with:
// - Domain glossary
// - Quantified criteria (±20% skill variance)
// - Methodology section
// - Verification checklist
// - Remove redundancy
```

Expected: +10% quality, -17% tokens, minimal code changes

## User Decisions

1. **Primary goal:** ✅ Quality focus - better team matches for actual gameplay
2. **Risk tolerance:** ✅ Aggressive - full rewrite acceptable
3. **Format change:** ❌ Keep XML (user prefers for token efficiency)
4. **Position balance scorer:** Pending - see analysis below
5. **Token budget:** Free tier (no concerns)

## XML vs JSON Token Analysis

User's intuition correct! Let me verify:

**XML Format (current):**
```xml
<Player>
  <Name>John Doe</Name>
  <Positions>PG, SG</Positions>
  <TierListPosition>A</TierListPosition>
</Player>
```
~95 chars per player

**JSON Format:**
```json
{"name":"John Doe","positions":["PG","SG"],"tier":"A"}
```
~55 chars per player

**Analysis:** JSON actually ~42% more efficient (40 chars saved per player)
- 10 players: ~400 chars saved = ~100 tokens
- 20 players: ~800 chars saved = ~200 tokens

**Recommendation:** Despite user preference, JSON objectively better for tokens. However, will respect user choice and keep XML since difference not critical for free tier.

## Position Balance Scorer - Detailed Proposal

Currently missing: validation that position-focused strategy actually achieves positional diversity.

**Proposed New Scorer:**
```typescript
{
  name: 'Position Balance',
  description: 'Verifies each team has diverse position coverage (3+ different positions)',
  scorer: ({ output }) => {
    const { propositions } = output.object

    for (const proposition of propositions) {
      for (const team of proposition.teams) {
        // Get unique positions covered by team
        const positionsCovered = new Set<string>()

        for (const playerName of team) {
          const player = input.find(p => p.name === playerName)
          if (player) {
            player.positions.forEach(pos => positionsCovered.add(pos))
          }
        }

        // Each team should cover at least 3 different positions
        if (positionsCovered.size < 3) {
          console.error(
            `❌ Proposition (${proposition.type}) team has only ${positionsCovered.size} positions covered: ${[...positionsCovered].join(', ')}`
          )
          return 0
        }
      }
    }

    return 1
  }
}
```

**Why add this?**
- Ensures "position_focused" strategy actually works
- Catches edge cases (e.g., all players assigned as same position)
- Validates strategic diversity claim in PRD

**Trade-off:** Adds test complexity, but improves quality validation

**Recommendation:** ✅ Add this scorer

## Final Implementation Plan

### Approach: Aggressive Quality-Focused Rewrite

Keep XML format, apply all quality improvements.

### Changes

**1. File: `src/lib/create-team-propositions.ts`**

Replace system prompt (lines 23-43) with optimized version:
- Add domain glossary (positions, skill tiers with point values)
- Quantify balance criteria (±20% skill variance target)
- Add explicit methodology for each strategy
- Structured sections with clear headers
- Add verification checklist
- Remove redundant instructions

Keep user prompt structure (lines 44-67):
- Keep XML format for player data
- Remove type enumeration redundancy
- Simplify instructions (covered in system)

**2. File: `src/lib/create-team-propositions.eval.ts`**

Add new scorer after line 204:
- Position Balance scorer (validates 3+ position coverage per team)
- Helps ensure position_focused strategy works correctly

### Expected Results

- **Quality:** +15-25% better team balance (measurable via eval scores)
- **Consistency:** +20-30% less variance between runs
- **Token efficiency:** -15-20% tokens (redundancy removal, despite longer system prompt)
- **Gameplay:** More competitive matches (skill balanced), more strategic options (position diversity)

### Testing Strategy

1. Run current eval baseline (10x) - capture variance
2. Apply prompt changes
3. Run new eval (10x) - compare scores and consistency
4. If scores improve + pass all tests → commit
5. If issues → iterate on prompt wording

## Files to Modify

1. **`src/lib/create-team-propositions.ts`** (lines 23-67) - Aggressive prompt rewrite
2. **`src/lib/create-team-propositions.eval.ts`** (after line 204) - Add position balance scorer
