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

test('User can see game`s details page', async ({ page }) => {
	await page.goto('/games')

	await page.getByRole('row', { name: /.*\b(AM|PM)\b.*/ }).click()

	await expect(
		page.getByRole('heading', { level: 2, name: 'Generated Propositions' }),
	).toBeVisible()
	await expect(
		page.getByRole('heading', { level: 3, name: 'Proposition' }),
	).toHaveCount(3)
	await expect(
		page.getByRole('heading', { level: 2, name: 'Final Teams' }),
	).toBeVisible()
	await expect(
		page.getByRole('heading', { level: 2, name: 'Game Scores' }),
	).toBeVisible()
})
