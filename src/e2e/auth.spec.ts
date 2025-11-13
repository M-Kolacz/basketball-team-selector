import { test, expect } from '@playwright/test'

test('User should be able to log in', async ({ page }) => {
	await page.goto('/login')

	await page.getByRole('textbox', { name: 'Username' }).fill('kody')
	await page.getByRole('textbox', { name: 'Password' }).fill('kodylovesyou')

	await page.getByRole('button', { name: 'Login' }).click()

	await page.getByRole('button', { name: 'User menu' }).click()
	await expect(page.getByText('Admin')).toBeVisible()
})

test('User should be able to log out', async ({ page }) => {
	await page.goto('/login')

	await page.getByRole('textbox', { name: 'Username' }).fill('kody')
	await page.getByRole('textbox', { name: 'Password' }).fill('kodylovesyou')

	await page.getByRole('button', { name: 'Login' }).click()

	await page.getByRole('button', { name: 'User menu' }).click()
	await page.getByRole('button', { name: 'Logout' }).click()

	await page.getByRole('button', { name: 'Login' }).click()
})

test('User should be able to register', async ({ page }) => {
	await page.goto('/register')

	await page.getByRole('textbox', { name: 'Username' }).fill('newUser')
	await page
		.getByRole('textbox', { name: 'Password', exact: true })
		.fill('testing123')
	await page
		.getByRole('textbox', { name: 'Confirm Password' })
		.fill('testing123')

	await page.getByRole('button', { name: 'Create account' }).click()

	await page.getByRole('button', { name: 'User menu' }).click()
	await expect(page.getByText('User', { exact: true })).toBeVisible()
})
