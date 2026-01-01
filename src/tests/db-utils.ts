import { faker } from '@faker-js/faker'
import { UniqueEnforcer } from 'enforce-unique'
import { getPasswordHash } from '#app/lib/auth.server'
import { prisma } from '#app/lib/db.server'

const uniqueUsernameEnforcer = new UniqueEnforcer()

export const createUser = () => {
	const firstName = faker.person.firstName()
	const lastName = faker.person.lastName()

	const username = uniqueUsernameEnforcer
		.enforce(() => {
			return (
				faker.string.alphanumeric({ length: 2 }) +
				'_' +
				faker.internet.username({
					firstName: firstName.toLowerCase(),
					lastName: lastName.toLowerCase(),
				})
			)
		})
		.slice(0, 20)
		.toLowerCase()
		.replace(/[^a-z0-9_]/g, '_')
	return {
		username,
	}
}

export const registerUser = async () => {
	const password = faker.internet.password()
	const user = await prisma.user.create({
		data: {
			...createUser(),
			password: { create: { hash: await getPasswordHash(password) } },
		},
	})

	return {
		...user,
		password,
	}
}
