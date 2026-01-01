import { test as base } from '@playwright/test'
import {
	getPasswordHash,
	getSessionExpirationDate,
	createAuthCookie,
	createAuthToken,
} from '#app/lib/auth.server'
import { prisma, type User } from '#app/lib/db.server'
import { createUser } from '#app/tests/db-utils'

export const test = base.extend<{
	login(options?: GetOrInsertUserOptions): Promise<User>
}>({
	login: async ({ page }, use) => {
		let userId: string | undefined = undefined
		// eslint-disable-next-line react-hooks/rules-of-hooks
		await use(async (options) => {
			const user = await getOrInsertUser(options)
			userId = user.id
			const session = await prisma.session.create({
				data: {
					expirationDate: getSessionExpirationDate(),
					userId: user.id,
				},
				select: { id: true, expirationDate: true },
			})

			const token = createAuthToken(session.id)
			const authCookie = createAuthCookie(token)
			const newConfig = {
				...authCookie,
				domain: 'localhost',
				expires: authCookie.expires.getTime() / 1000,
				sameSite: 'Lax' as 'Lax',
			}

			await page.context().addCookies([newConfig])
			return user
		})
		await prisma.user.deleteMany({ where: { id: userId } })
	},
})

type GetOrInsertUserOptions = {
	id?: string
	username?: User['username']
	password?: string
	role?: User['role']
}

const getOrInsertUser = async ({
	id,
	username,
	password,
	role = 'user',
}: GetOrInsertUserOptions = {}): Promise<User> => {
	const select = {
		id: true,
		username: true,
		role: true,
		createdAt: true,
		updatedAt: true,
	}
	if (id) {
		return await prisma.user.findUniqueOrThrow({
			select,
			where: { id: id },
		})
	} else {
		const userData = createUser()
		username ??= userData.username
		password ??= userData.username

		return await prisma.user.create({
			select,
			data: {
				...userData,
				username,
				role,
				password: { create: { hash: await getPasswordHash(password) } },
			},
		})
	}
}
