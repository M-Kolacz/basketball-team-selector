import { test, expect } from '@playwright/test'

test.describe('Player CRUD - Create Player', () => {
	test.beforeEach(async ({ page }) => {
		// Login as admin
		await page.goto('/login')
		await page.getByRole('textbox', { name: 'Username' }).fill('kody')
		await page.getByRole('textbox', { name: 'Password' }).fill('kodylovesyou')
		await page.getByRole('button', { name: 'Login' }).click()
		await expect(
			page.getByRole('banner').getByRole('button', { name: 'Logout' }),
		).toBeVisible()

		// Navigate to players page
		await page.goto('/players')
	})

	test('Admin should be able to create a new player with all fields', async ({
		page,
	}) => {
		// Click "Add new player" button
		await page.getByRole('button', { name: 'Add new player' }).click()

		// Verify dialog opened
		const dialog = page.getByRole('dialog')
		await expect(
			dialog.getByRole('heading', { name: 'Add new player' }),
		).toBeVisible()

		// Fill player name
		const playerName = `TestPlayer_${Date.now()}`
		await dialog.getByRole('textbox', { name: 'Player name' }).fill(playerName)

		// Select skill tier
		await dialog.getByRole('combobox', { name: 'Skill tier' }).click()
		await page.getByRole('option', { name: 'A' }).click()

		// Select positions (PG and SG)
		await dialog.getByRole('checkbox', { name: 'PG' }).check()
		await dialog.getByRole('checkbox', { name: 'SG' }).check()

		// Submit form
		await dialog.getByRole('button', { name: 'Add Player' }).click()

		// Verify dialog closed
		await expect(dialog).not.toBeVisible()

		// Verify player appears in table
		const table = page.getByRole('table')
		await expect(table.getByRole('cell', { name: playerName })).toBeVisible()
	})
})
