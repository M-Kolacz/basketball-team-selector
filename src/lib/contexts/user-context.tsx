'use client'

import { invariant } from '@epic-web/invariant'
import { createContext, use } from 'react'
import { type User } from '#app/lib/db.server'

type UserContextType = User | null

const UserContext = createContext<null | UserContextType>(null)

export const UserProvider = ({
	children,
	user,
}: {
	children: React.ReactNode
	user: User | null
}) => {
	const value = user
	return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useOptionalUser = () => {
	const context = use(UserContext)

	return context
}

export const useUser = () => {
	const user = useOptionalUser()
	invariant(user, 'useUser must be used when user is guaranteed to be present')

	return user
}
