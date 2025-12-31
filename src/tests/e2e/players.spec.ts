import { test, expect } from '@playwright/test'

test('User can see players table', async ({ page }) => {
	await page.goto('/players')

	await expect(
		page.getByRole('heading', { name: 'Players', level: 1 }),
	).toBeVisible()
	await expect(page.getByRole('button', { name: 'Player name' })).toBeVisible()
})
