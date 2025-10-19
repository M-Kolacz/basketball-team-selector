'use server'

import { parseWithZod } from '@conform-to/zod'
import { redirect } from 'next/navigation'
import z from 'zod'
import { CreatePlayerSchema } from '#app/lib/validations/player'
import { getCurrentUser } from '#app/services/auth.server'
import {
	listAllPlayers,
	createPlayer as createPlayerService,
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

				return { ...data }
			}),
		async: true,
	})

	if (submission.status !== 'success') {
		return { result: submission.reply() }
	}

	await createPlayerService(submission.value)

	return { success: true }
}
