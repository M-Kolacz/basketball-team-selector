import { test, expect } from '@playwright/test'

test('User can see statistics table', async ({ page }) => {
	await page.goto('/statistics')

	await expect(
		page.getByRole('heading', { name: 'Player Statistics', level: 1 }),
	).toBeVisible()
	await expect(page.getByRole('row', { name: 'Player Name' })).toBeVisible()
	await expect(
		page.getByRole('row', { name: 'Number of the game sessions played' }),
	).toBeVisible()
	const playersRows = await page.getByRole('row').count()
	expect(playersRows).toBeGreaterThan(2)
})
