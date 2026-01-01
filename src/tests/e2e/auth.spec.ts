import { faker } from '@faker-js/faker'
import { expect } from '@playwright/test'
import { prisma } from '#app/lib/db.server'
import { createUser, registerUser } from '#app/tests/db-utils'
import { test } from '#app/tests/playwright-utils'

test('User should be able to register', async ({ page }) => {
	const user = createUser()
	const password = faker.internet.password()

	await page.goto('/register')
	const main = page.getByRole('main')
	const header = page.getByRole('banner')

	await main.getByRole('textbox', { name: 'Username' }).fill(user.username)
	await main
		.getByRole('textbox', { name: 'Password', exact: true })
		.fill(password)
	await main.getByRole('textbox', { name: 'Confirm Password' }).fill(password)
	await main.getByRole('button', { name: 'Create account' }).click()

	await expect(header.getByRole('button', { name: 'Logout' })).toBeVisible()

	await prisma.user.deleteMany({ where: { username: user.username } })
})

test('User should be able to log in', async ({ page }) => {
	const { username, password, id } = await registerUser()

	await page.goto('/login')
	const main = page.getByRole('main')
	const header = page.getByRole('banner')

	await page.getByRole('textbox', { name: 'Username' }).fill(username)
	await page.getByRole('textbox', { name: 'Password' }).fill(password)
	await main.getByRole('button', { name: 'Login' }).click()

	await expect(header.getByRole('button', { name: 'Logout' })).toBeVisible()
	await prisma.user.deleteMany({ where: { id } })
})

test('User should be able to log out', async ({ page, login }) => {
	await login()
	await page.goto('/games')

	const header = page.getByRole('banner')
	await header.getByRole('button', { name: 'Logout' }).click()
	await expect(header.getByRole('button', { name: 'Login' })).toBeVisible()
})
