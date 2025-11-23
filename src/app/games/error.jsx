'use client';
import { useEffect } from 'react';
import { Button } from '#app/components/ui/button';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, } from '#app/components/ui/empty';
export default function GamesError(_a) {
    var error = _a.error, reset = _a.reset;
    useEffect(function () {
        console.error('Games page error:', error);
    }, [error]);
    return (<main className="container mx-auto px-4 py-8">
			<Empty>
				<EmptyHeader>
					<EmptyTitle>Failed to load games</EmptyTitle>
					<EmptyDescription>
						An error occurred while fetching game sessions. Please try again.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button onClick={reset}>Try again</Button>
				</EmptyContent>
			</Empty>
		</main>);
}
