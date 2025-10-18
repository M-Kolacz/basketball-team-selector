import { test, expect } from '@playwright/test'

test('has deploy button', async ({ page }) => {
	await page.goto('/')

	const loginHeader = page.getByRole('heading', { name: 'Login', level: 1 })

	await expect(loginHeader).toBeVisible()
})
