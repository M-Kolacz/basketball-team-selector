import { test } from '#app/tests/playwright-utils'

test('login with new login flow', async ({ page, login }) => {
	const user = await login()
	await page.goto('/games')
})
