'use client'

import { invariant } from '@epic-web/invariant'
import { createContext, use } from 'react'
import { type Players } from '#app/lib/actions/players'

const GamesContext = createContext<null | {
	players: Players
	isAdmin: boolean
}>(null)

export const GamesProvider = ({
	children,
	players,
	isAdmin,
}: {
	children: React.ReactNode
	players: Players
	isAdmin: boolean
}) => {
	return (
		<GamesContext.Provider value={{ players, isAdmin }}>
			{children}
		</GamesContext.Provider>
	)
}

export const useGamesContext = () => {
	const context = use(GamesContext)
	invariant(context, 'useGamesContext must be used within a GamesProvider')

	return context
}
