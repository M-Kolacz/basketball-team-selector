'use server'

import { parseWithZod } from '@conform-to/zod'
import { invariant } from '@epic-web/invariant'
import { redirect } from 'next/navigation'
import z from 'zod'
import { getOptionalUser } from '#app/lib/auth.server'
import { prisma } from '#app/lib/db.server'
import { requireRateLimit } from '#app/lib/rate-limit.server'
import {
	CreatePlayerSchema,
	DeletePlayerSchema,
	UpdatePlayerSchema,
} from '#app/lib/validations/player'

export const getPlayers = async () => {
	const rateLimit = await requireRateLimit('general')
	invariant(
		rateLimit.status === 'success',
		`Too many requests. Try again in ${rateLimit.retryAfterSeconds} second${rateLimit.retryAfterSeconds !== 1 ? 's' : ''}.`,
	)

	const currentUser = await getOptionalUser()

	const isAdminUser = currentUser?.role === 'admin'

	const players = await prisma.player.findMany({
		select: {
			id: true,
			name: true,
			skillTier: isAdminUser,
			positions: isAdminUser,
			createdAt: isAdminUser,
			updatedAt: isAdminUser,
		},
	})

	return players
}

export type Players = Awaited<ReturnType<typeof getPlayers>>

export const createPlayer = async (_prevState: unknown, formData: FormData) => {
	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			CreatePlayerSchema.superRefine(async (data, ctx) => {
				const rateLimit = await requireRateLimit('strong')
				if (rateLimit.status !== 'success') {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Too many requests. Try again in ${rateLimit.retryAfterSeconds} second${rateLimit.retryAfterSeconds !== 1 ? 's' : ''}.`,
					})
					return
				}
			}).transform(async (data, ctx) => {
				if (intent !== null) return { ...data }

				const currentUser = await getOptionalUser()

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

	redirect('/players')
}

export const deletePlayer = async (_prevState: unknown, formData: FormData) => {
	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			DeletePlayerSchema.superRefine(async (data, ctx) => {
				const rateLimit = await requireRateLimit('strong')
				if (rateLimit.status !== 'success') {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Too many requests. Try again in ${rateLimit.retryAfterSeconds} second${rateLimit.retryAfterSeconds !== 1 ? 's' : ''}.`,
					})
					return
				}
			}).transform(async (data, ctx) => {
				if (intent !== null) return { ...data }

				const currentUser = await getOptionalUser()

				if (!currentUser || currentUser.role !== 'admin') {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Something went wrong',
					})
					return z.NEVER
				}

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

	await prisma.player.delete({
		where: { id },
	})

	redirect('/players')
}

export const updatePlayer = async (_prevState: unknown, formData: FormData) => {
	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			UpdatePlayerSchema.superRefine(async (data, ctx) => {
				const rateLimit = await requireRateLimit('strong')
				if (rateLimit.status !== 'success') {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Too many requests. Try again in ${rateLimit.retryAfterSeconds} second${rateLimit.retryAfterSeconds !== 1 ? 's' : ''}.`,
					})
					return
				}
			}).transform(async (data, ctx) => {
				if (intent !== null) return { ...data }

				const currentUser = await getOptionalUser()

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

	await prisma.player.update({
		where: { id },
		data: {
			...updateData,
		},
		select: {
			id: true,
		},
	})

	redirect('/players')
}
