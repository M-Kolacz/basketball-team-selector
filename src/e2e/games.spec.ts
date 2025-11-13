import { test, expect } from '@playwright/test'

test('User can see game history', async ({ page }) => {
	await page.goto('/games')

	await expect(
		page.getByRole('heading', { name: 'Game History' }),
	).toBeVisible()
	await expect(page.getByRole('cell', { name: 'Date' })).toBeVisible()
	await expect(page.getByRole('cell', { name: 'Games Count' })).toBeVisible()

	await expect(page.getByRole('row')).toHaveCount(2)
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
