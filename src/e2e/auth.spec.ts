import { test, expect } from '@playwright/test'

test.skip('Login as admin user', async ({ page }) => {
	await page.goto('/games')

	await page.getByRole('button', { name: 'User menu' }).click()
	await page.getByRole('button', { name: 'Login' }).click()

	await page.getByRole('textbox', { name: 'Username' }).fill('kody')
	await page.getByRole('textbox', { name: 'Password' }).fill('kodylovesyou')

	await page.getByRole('button', { name: 'Login' }).click()
	await page.getByRole('button', { name: 'User menu' }).click()

	await expect(page.getByText('Admin')).toBeVisible()
})

test.skip('Logout from application', async ({ page }) => {
	await page.goto('/games')

	await page.getByRole('button', { name: 'User menu' }).click()
	await page.getByRole('button', { name: 'Login' }).click()

	await page.getByRole('textbox', { name: 'Username' }).click()
	await page.getByRole('textbox', { name: 'Username' }).fill('kody')

	await page.getByRole('textbox', { name: 'Password' }).fill('kodylovesyou')

	await page.getByRole('button', { name: 'Login' }).click()

	await page.getByRole('button', { name: 'User menu' }).click()
	await page.getByRole('button', { name: 'Logout' }).click()
})
