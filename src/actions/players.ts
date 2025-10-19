'use server'

import { parseWithZod } from '@conform-to/zod'
import { redirect } from 'next/navigation'
import z from 'zod'
import { prisma } from '#app/lib/db.server'
import {
	CreatePlayerSchema,
	DeletePlayerSchema,
	UpdatePlayerSchema,
} from '#app/lib/validations/player'
import { getCurrentUser } from '#app/services/auth.server'
import {
	listAllPlayers,
	deletePlayer as deletePlayerService,
	updatePlayer as updatePlayerService,
} from '#app/services/player.service'

export async function getPlayers() {
	const currentUser = await getCurrentUser()

	if (!currentUser) redirect('/login')

	const players = await listAllPlayers(currentUser.role)

	return players
}

export async function createPlayer(_prevState: unknown, formData: FormData) {
	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			CreatePlayerSchema.transform(async (data, ctx) => {
				if (intent !== null) return { ...data }

				const currentUser = await getCurrentUser()

				if (!currentUser || currentUser.role !== 'admin') {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Something went wrong',
					})
					return z.NEVER
				}

				const player = await prisma.player.findUnique({
					where: { name: data.name },
				})

				if (player) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Player with this name already exists',
					})
					return z.NEVER
				}

				return { ...data }
			}),
		async: true,
	})

	if (submission.status !== 'success') {
		return { result: submission.reply() }
	}

	const { name, positions, skillTier } = submission.value

	await prisma.player.create({
		data: {
			name,
			skillTier,
			positions,
		},
		select: {
			id: true,
		},
	})

	return { success: true }
}

export async function deletePlayer(_prevState: unknown, formData: FormData) {
	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			DeletePlayerSchema.transform(async (data, ctx) => {
				if (intent !== null) return { ...data }

				// 1. Authentication check
				const currentUser = await getCurrentUser()

				if (!currentUser || currentUser.role !== 'admin') {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Something went wrong',
					})
					return z.NEVER
				}

				// 2. Existence check
				const player = await prisma.player.findUnique({
					where: { id: data.id },
					select: { id: true },
				})

				if (!player) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Player not found',
						path: ['id'],
					})
					return z.NEVER
				}

				return { ...data }
			}),
		async: true,
	})

	if (submission.status !== 'success') {
		return { result: submission.reply() }
	}

	const { id } = submission.value

	await deletePlayerService(id)

	return { success: true }
}

export async function updatePlayer(_prevState: unknown, formData: FormData) {
	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			UpdatePlayerSchema.transform(async (data, ctx) => {
				if (intent !== null) return { ...data }

				const currentUser = await getCurrentUser()

				if (!currentUser || currentUser.role !== 'admin') {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Something went wrong',
					})
					return z.NEVER
				}

				const existingPlayer = await prisma.player.findUnique({
					where: { id: data.id },
					select: { id: true, name: true },
				})

				if (!existingPlayer) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Player not found',
						path: ['id'],
					})
					return z.NEVER
				}

				if (data.name && data.name !== existingPlayer.name) {
					const playerWithName = await prisma.player.findUnique({
						where: { name: data.name },
						select: { id: true },
					})

					if (playerWithName) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: 'Player with this name already exists',
							path: ['name'],
						})
						return z.NEVER
					}
				}

				return { ...data }
			}),
		async: true,
	})

	if (submission.status !== 'success') {
		return { result: submission.reply() }
	}

	const { id, ...updateData } = submission.value

	await updatePlayerService(id, updateData)

	return { success: true }
}
