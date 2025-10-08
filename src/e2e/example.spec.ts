import { test, expect } from '@playwright/test'

test('has deploy button', async ({ page }) => {
	await page.goto('/')

	const deployButton = page.getByRole('link', { name: /Deploy now/ })

	await expect(deployButton).toBeVisible()
})
