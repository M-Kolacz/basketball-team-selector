'use client';
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { parseWithZod } from '@conform-to/zod';
import { useOptimistic } from 'react';
import { AddGameScoreForm } from '#app/app/games/[id]/components/add-game-score-form';
import { GameScoreCard } from '#app/app/games/[id]/components/game-score-card';
import { GameResultSchema } from '#app/lib/validations/game-session';
export var GameScoresSection = function (_a) {
    var gameSessionId = _a.gameSessionId, games = _a.games, teams = _a.teams, isAdmin = _a.isAdmin;
    var _b = useOptimistic(games, function (currenntGames, newGame) { return __spreadArray(__spreadArray([], currenntGames, true), [newGame], false); }), optimisticGameScores = _b[0], addOptimisticGameScore = _b[1];
    var addOptimisticScore = function (formData) {
        var submission = parseWithZod(formData, {
            schema: GameResultSchema,
        });
        if (submission.status !== 'success')
            return;
        var _a = submission.value, gameSessionId = _a.gameSessionId, scores = _a.scores;
        addOptimisticGameScore({
            id: "temp-".concat(Date.now()),
            createdAt: new Date(),
            updatedAt: new Date(),
            scores: scores.map(function (score) {
                var _a, _b;
                return ({
                    id: "temp-".concat(Date.now(), "-").concat(score.teamId),
                    teamId: score.teamId,
                    points: score.points,
                    team: {
                        name: (_b = (_a = teams === null || teams === void 0 ? void 0 : teams.find(function (team) { return team.id === score.teamId; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '',
                    },
                });
            }),
            gameSessionId: gameSessionId,
        });
    };
    var canAddGames = isAdmin && teams !== null && teams.length >= 2;
    return (<section className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Game Scores</h2>
				{canAddGames && (<AddGameScoreForm gameSessionId={gameSessionId} teams={teams} addOptimisticScore={addOptimisticScore}/>)}
			</div>

			{optimisticGameScores.length === 0 ? (<div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
					{canAddGames
                ? 'No game scores recorded yet. Click "Add New Game" to record the first game.'
                : 'Select a proposition with teams first to record game scores.'}
				</div>) : (<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{optimisticGameScores.map(function (game, index) { return (<GameScoreCard key={index} gameSessionId={gameSessionId} gameIndex={index} game={game} isAdmin={isAdmin}/>); })}
				</div>)}
		</section>);
};
