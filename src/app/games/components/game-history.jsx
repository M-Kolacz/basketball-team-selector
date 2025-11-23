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
import { AddGameForm } from '#app/app/games/components/add-game-form';
import { createGameSessionColumns } from '#app/app/games/components/game-sessions-columns';
import { GameSessionsTable } from '#app/app/games/components/game-sessions-table';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, } from '#app/components/ui/empty';
import { CreateGameSessionSchema } from '#app/lib/validations/game-session';
export var GameHistory = function (_a) {
    var gameSessions = _a.gameSessions, isAdmin = _a.isAdmin, players = _a.players;
    var _b = useOptimistic(gameSessions, function (state, newGame) {
        return __spreadArray([newGame], state, true).sort(function (a, b) { return b.gameDatetime.getTime() - a.gameDatetime.getTime(); });
    }), optimisticGames = _b[0], addOptimisticGame = _b[1];
    var addOptimisticGameSession = function (formData) {
        var submission = parseWithZod(formData, {
            schema: CreateGameSessionSchema,
        });
        if (submission.status !== 'success')
            return;
        var _a = submission.value, gameDatetime = _a.gameDatetime, playerIds = _a.playerIds, description = _a.description;
        addOptimisticGame({
            id: "temp-".concat(Date.now()),
            gameDatetime: new Date(gameDatetime),
            gamesCount: 0,
            players: playerIds.map(function (playerId) {
                var _a;
                return (_a = players.find(function (player) { return player.id === playerId; })) !== null && _a !== void 0 ? _a : {
                    id: '',
                    name: '',
                };
            }),
            description: description !== null && description !== void 0 ? description : null,
            propositions: [],
        });
    };
    if (optimisticGames.length === 0) {
        return (<Empty>
				<EmptyHeader>
					<EmptyTitle>No games found</EmptyTitle>
					<EmptyDescription>
						There are no game sessions recorded yet.
					</EmptyDescription>
				</EmptyHeader>
				{isAdmin && (<AddGameForm key={isAdmin.toString()} players={players} addOptimisticGameSession={addOptimisticGameSession}/>)}
			</Empty>);
    }
    return (<div className="w-full">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Game History</h1>
					<p className="text-muted-foreground">
						View all past basketball game sessions
					</p>
				</div>
				{isAdmin && (<AddGameForm players={players} addOptimisticGameSession={addOptimisticGameSession}/>)}
			</div>
			<GameSessionsTable columns={createGameSessionColumns({
            isAdmin: isAdmin,
            players: players,
        })} data={optimisticGames}/>
		</div>);
};
