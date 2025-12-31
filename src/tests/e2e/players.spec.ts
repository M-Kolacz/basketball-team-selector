import { test, expect } from '@playwright/test'

test('User can see players table', async ({ page }) => {
	await page.goto('/players')

	await expect(
		page.getByRole('heading', { name: 'Players', level: 1 }),
	).toBeVisible()
	await expect(page.getByRole('row', { name: 'Name' })).toBeVisible()
	const playersRows = await page.getByRole('row').count()
	expect(playersRows).toBeGreaterThan(2)
})
