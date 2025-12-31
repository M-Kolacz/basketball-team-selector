import { test, expect } from '@playwright/test'

test('User should be able to log in', async ({ page }) => {
	await page.goto('/login')
	const main = page.getByRole('main')
	const header = page.getByRole('banner')

	await page.getByRole('textbox', { name: 'Username' }).fill('kody')
	await page.getByRole('textbox', { name: 'Password' }).fill('kodylovesyou')
	await main.getByRole('button', { name: 'Login' }).click()

	await expect(header.getByRole('button', { name: 'Logout' })).toBeVisible()
})

test('User should be able to log out', async ({ page }) => {
	await page.goto('/login')
	const main = page.getByRole('main')
	const header = page.getByRole('banner')

	await main.getByRole('textbox', { name: 'Username' }).fill('kody')
	await main.getByRole('textbox', { name: 'Password' }).fill('kodylovesyou')
	await main.getByRole('button', { name: 'Login' }).click()

	await header.getByRole('button', { name: 'Logout' }).click()
	await expect(header.getByRole('button', { name: 'Login' })).toBeVisible()
})

test('User should be able to register', async ({ page }) => {
	await page.goto('/register')
	const main = page.getByRole('main')
	const header = page.getByRole('banner')

	await main.getByRole('textbox', { name: 'Username' }).fill('newUser')
	await main
		.getByRole('textbox', { name: 'Password', exact: true })
		.fill('testing123')
	await main
		.getByRole('textbox', { name: 'Confirm Password' })
		.fill('testing123')
	await main.getByRole('button', { name: 'Create account' }).click()

	await expect(header.getByRole('button', { name: 'Logout' })).toBeVisible()
})
