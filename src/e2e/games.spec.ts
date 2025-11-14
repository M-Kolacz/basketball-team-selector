import { test, expect } from '@playwright/test'

test('User can see game history', async ({ page }) => {
	await page.goto('/games')

	await expect(
		page.getByRole('heading', { name: 'Game History' }),
	).toBeVisible()
	await expect(page.getByRole('cell', { name: 'Date' })).toBeVisible()
	await expect(
		page.getByRole('cell', { name: 'Number of games' }),
	).toBeVisible()

	await expect(page.getByRole('row')).toHaveCount(2)
})

test('User can see game`s details page', async ({ page }) => {
	await page.goto('/games')

	await page
		.getByRole('button', { name: 'Open game history actions' })
		.first()
		.click()

	await page.getByRole('menuitem', { name: 'Check game details' }).click()

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
