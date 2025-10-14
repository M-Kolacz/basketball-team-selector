1. Use an enum type (admin, user) in the users table for simplicity in the MVP,
   with potential to expand to a separate roles table later if needed.
2. I don't care about that, so we exclude it from the NDP.
3. Use JSONB fields to store team compositions within propositions since you
   want complete snapshots and won't be querying individual players within
   propositions frequently.
4. Use database triggers to automatically update the statistics table when game
   results are entered to ensure consistency and reduce application complexity.
5. I don't need to track that.
6. Add unique constraints on player names, username for authentication, and a
   composite unique constraint on (game_id, proposition_version) to prevent
   duplicate versions.
7. Use a single timestamp field.
8. Use simple identifiers like "Team A" and "Team B" stored as part of the team
   structure in the JSONB field.
9. No hard database limit, but track the regeneration_count to monitor usage
   patterns.
10. Use CASCADE for deleting propositions when a game is deleted, but use
    RESTRICT for player deletions if they have associated game history.
11. Enforce a minimum length constraint at the database level (e.g., 8
    characters) and handle other password complexity requirements in the
    application layer.
12. I will create by myself this data for the prepositions and skill tiers.
13. For each day where we'll have a game, we'll have multiple games that
    probably will play to the score 32. So we can have 5 games we can play
    during a 2-hour session. It's not like we'll have a single score. We might
    have multiple scores.
14. Validate in the application layer that teams have 5+ players each, but don't
    enforce hard constraints in the database to allow flexibility for different
    game formats.
15. No, I don't care about that.
