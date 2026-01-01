import { faker } from '@faker-js/faker'
import { expect } from '@playwright/test'
import { prisma } from '#app/lib/db.server'
import { test } from '#app/tests/playwright-utils'

test('Non admin user can see players table', async ({ page }) => {
	await page.goto('/players')

	await expect(
		page.getByRole('heading', { name: 'Players', level: 1 }),
	).toBeVisible()
	await expect(page.getByRole('button', { name: 'Player name' })).toBeVisible()

	const table = page.getByRole('table')
	await expect(table.getByRole('button', { name: /Delete/ })).not.toBeVisible()
	await expect(table.getByRole('button', { name: /Edit/ })).not.toBeVisible()
})

test('Admin user can add a new player', async ({ page, login }) => {
	await login({ role: 'admin' })
	await page.goto('/players')

	await page.getByRole('button', { name: 'Add new player' }).click()

	const dialog = page.getByRole('dialog', { name: 'Add new player' })
	const playerName = faker.person.fullName()

	await dialog.getByRole('textbox', { name: 'Player name' }).fill(playerName)
	await dialog.getByRole('combobox', { name: 'Skill tier' }).click()
	await page.getByRole('option', { name: 'S' }).click()

	await dialog.getByRole('checkbox', { name: 'PG' }).check()

	await dialog.getByRole('button', { name: 'Add Player' }).click()

	await expect(
		page.getByRole('cell', { name: playerName, exact: true }),
	).toBeVisible()

	await prisma.player.deleteMany({ where: { name: playerName } })
})

test('Admin user can delete a player', async ({ page, login }) => {
	const player = await prisma.player.create({
		data: {
			name: faker.person.fullName(),
			skillTier: 'S',
			positions: ['PG'],
		},
	})
	await login({ role: 'admin' })
	await page.goto('/players')

	await expect(
		page.getByRole('cell', { name: player.name, exact: true }),
	).toBeVisible()
	await page.getByRole('button', { name: `Delete ${player.name}` }).click()
	await expect(
		page.getByRole('cell', { name: player.name, exact: true }),
	).not.toBeVisible()
})

test('Admin user can edit a player', async ({ page, login }) => {
	const player = await prisma.player.create({
		data: {
			name: faker.person.fullName(),
			skillTier: 'B',
			positions: ['SG'],
		},
	})
	await login({ role: 'admin' })
	await page.goto('/players')

	await page.getByRole('button', { name: `Edit ${player.name}` }).click()

	const dialog = page.getByRole('dialog', { name: 'Edit Player' })
	const newPlayerName = faker.person.fullName()
	await dialog.getByRole('textbox', { name: 'Player name' }).fill(newPlayerName)
	await dialog.getByRole('combobox', { name: 'Skill tier' }).click()
	await page.getByRole('option', { name: 'A' }).click()
	await dialog.getByRole('checkbox', { name: 'PG' }).check()
	await dialog.getByRole('button', { name: 'Update Player' }).click()

	const row = page.getByTestId(`table-row-${newPlayerName}`)
	await expect(
		row.getByRole('cell', { name: newPlayerName, exact: true }),
	).toBeVisible()
	await expect(row.getByRole('cell', { name: 'A-Tier' })).toBeVisible()
	await expect(
		row.getByRole('cell', { name: 'Point Guard Shooting Guard' }),
	).toBeVisible()

	await prisma.player.deleteMany({ where: { id: player.id } })
})
