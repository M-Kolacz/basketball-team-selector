import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
	await page.goto('/')

	const loginHeader = page.getByRole('heading', {
		name: 'Game History',
		level: 1,
	})

	await expect(loginHeader).toBeVisible()
})
