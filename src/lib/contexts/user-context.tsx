'use client'

import { invariant } from '@epic-web/invariant'
import { createContext, use } from 'react'
import { type User } from '#app/lib/db.server'

type UserContextType = {
	user: User | null
}

const UserContext = createContext<null | UserContextType>(null)

export const UserProvider = ({
	children,
	user,
}: {
	children: React.ReactNode
	user: User | null
}) => {
	const value = {
		user,
	}

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUserContext = () => {
	const context = use(UserContext)
	invariant(context, 'useUserContext must be used within a UserProvider')

	return context
}
