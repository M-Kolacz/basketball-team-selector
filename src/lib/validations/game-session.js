import { z } from 'zod';
export var UpdateGameScoreSchema = z.object({
    firstScoreId: z.string().uuid('Invalid score ID'),
    firstScorePoints: z.number().int().min(0, 'Score must be non-negative'),
    secondScoreId: z.string().uuid('Invalid score ID'),
    secondScorePoints: z.number().int().min(0, 'Score must be non-negative'),
});
export var GetGameSessionSchema = z.object({
    gameSessionId: z.string().uuid('Invalid game session ID'),
});
export var CreateGameSessionSchema = z.object({
    gameDatetime: z
        .string()
        .min(1, 'Game date and time is required')
        .refine(function (datetime) {
        var selectedDate = new Date(datetime);
        return !isNaN(selectedDate.getTime());
    }, 'Invalid date format'),
    description: z.string().max(500).optional(),
    playerIds: z.array(z.string().uuid()),
});
export var SelectPropositionSchema = z.object({
    gameSessionId: z.string().uuid('Invalid game session ID'),
    propositionId: z.string().uuid('Invalid proposition ID'),
});
export var GameResultSchema = z.object({
    gameSessionId: z.string().uuid('Invalid game session ID'),
    scores: z
        .array(z.object({
        teamId: z.string().uuid('Invalid team ID'),
        points: z.coerce
            .number({
            required_error: 'Score is required',
            invalid_type_error: 'Score must be a number',
        })
            .int('Score must be a whole number')
            .min(0, 'Score cannot be negative')
            .max(300, 'Score cannot exceed 300'),
    }))
        .min(2, 'At least 2 team scores required'),
});
export var SavePropositionSchema = z.object({
    updatedTeams: z.array(z.object({
        id: z.string().uuid(),
        players: z.array(z.object({ id: z.string().uuid() })),
    })),
});
export var EditGameScoreSchema = z.object({
    scores: z.array(z.object({
        id: z.string().uuid('Invalid score ID'),
        points: z
            .number({
            required_error: 'Score is required',
            invalid_type_error: 'Score must be a number',
        })
            .int('Score must be a whole number')
            .min(0, 'Score cannot be negative')
            .max(300, 'Score cannot exceed 300'),
    })),
});
export var DeleteGameSessionSchema = z.object({
    id: z.string().uuid('Invalid game session ID format'),
});
export var UpdateGameSessionSchema = z.object({
    id: z.string().uuid('Invalid game session ID'),
    gameDatetime: z
        .string()
        .min(1, 'Game date and time is required')
        .refine(function (datetime) {
        var selectedDate = new Date(datetime);
        return !isNaN(selectedDate.getTime());
    }, 'Invalid date format'),
    description: z.string().max(500).optional(),
    playerIds: z
        .array(z.string().uuid())
        .min(10, 'At least 10 players are required')
        .max(25, 'No more than 25 players are allowed'),
});
