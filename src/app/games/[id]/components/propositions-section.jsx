import { PropositionItem } from '#app/app/games/[id]/components/proposition-item';
export var PropositionsSection = function (_a) {
    var propositions = _a.propositions, gameSessionId = _a.gameSessionId, hasSelectedProposition = _a.hasSelectedProposition, isAdmin = _a.isAdmin;
    return (<section className="space-y-4">
			<h2 className="text-2xl font-bold">Generated Propositions</h2>
			<div className="space-y-8">
				{propositions.map(function (proposition, propIndex) { return (<PropositionItem key={proposition.id} proposition={proposition} propIndex={propIndex} gameSessionId={gameSessionId} hasSelectedProposition={hasSelectedProposition} isAdmin={isAdmin}/>); })}
			</div>
		</section>);
};
