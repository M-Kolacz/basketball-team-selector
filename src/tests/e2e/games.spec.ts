import { test, expect } from '@playwright/test'

test.describe('Non admin user', () => {
	test('User can see game history', async ({ page }) => {
		await page.goto('/games')

		await expect(
			page.getByRole('heading', { name: 'Game History' }),
		).toBeVisible()
		await expect(
			page.getByRole('button', { name: 'Number of games' }),
		).toBeVisible()
		await expect(
			page.getByRole('columnheader', { name: 'Actions' }),
		).toBeVisible()
	})

	test('User can see game`s details page', async ({ page }) => {
		await page.goto('/games')

		await page
			.getByRole('button', { name: 'Check game details' })
			.first()
			.click()

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
})
