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
import { Edit } from 'lucide-react';
import { useState } from 'react';
import { ScoreInputForm } from '#app/app/games/[id]/components/score-input-form';
import { Button } from '#app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, } from '#app/components/ui/card';
import { Spinner } from '#app/components/ui/spinner';
export var GameScoreCard = function (_a) {
    var gameIndex = _a.gameIndex, game = _a.game, isAdmin = _a.isAdmin;
    var _b = useState(false), isEditing = _b[0], setIsEditing = _b[1];
    if (isEditing) {
        return (<Card>
				<CardHeader>
					<CardTitle>Edit Game {gameIndex + 1} Score</CardTitle>
				</CardHeader>
				<CardContent>
					<ScoreInputForm scores={game.scores} onCancel={function () { return setIsEditing(false); }}/>
				</CardContent>
			</Card>);
    }
    var sortedScores = __spreadArray([], game.scores, true).sort(function (a, b) { return b.points - a.points; });
    var isOptimistic = game.id.startsWith('temp-');
    return (<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<p className="flex gap-4">
						<span className={isOptimistic ? 'opacity-50' : ''}>
							Game {gameIndex + 1}
						</span>
						{isOptimistic ? <Spinner /> : null}
					</p>
					{isAdmin && (<Button disabled={isOptimistic} variant="ghost" size="sm" onClick={function () { return setIsEditing(true); }} className="gap-2">
							<Edit className="h-4 w-4"/>
							Edit
						</Button>)}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{sortedScores.map(function (score, index) { return (<div key={score.id} className={"flex items-center justify-between rounded-lg border p-3 ".concat(index === 0 ? 'border-primary bg-primary/5' : '')}>
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium text-muted-foreground">
									Team {score.team.name}
								</span>
							</div>
							<span className="text-2xl font-bold">{score.points}</span>
						</div>); })}
				</div>
			</CardContent>
		</Card>);
};
