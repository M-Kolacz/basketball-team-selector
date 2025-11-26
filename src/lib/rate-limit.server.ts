import { type ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers'
import { headers } from 'next/headers'
import { RateLimiterPrisma } from 'rate-limiter-flexible'
import { prisma } from '#app/lib/db.server'

const maxMultiple = process.env.NODE_ENV !== 'production' ? 10_000 : 1

const rateLimitConfig = {
	storeClient: prisma,
	tableName: 'RateLimiterFlexible',
	duration: 60,
}

export const strongestRateLimiter = new RateLimiterPrisma({
	...rateLimitConfig,
	points: 10 * maxMultiple,
})

export const strongRateLimiter = new RateLimiterPrisma({
	...rateLimitConfig,
	points: 100 * maxMultiple,
})

export const generalRateLimiter = new RateLimiterPrisma({
	...rateLimitConfig,
	points: 1000 * maxMultiple,
})

export type RateLimitTier = 'strongest' | 'strong' | 'general'

export const getRateLimiter = (tier: RateLimitTier): RateLimiterPrisma => {
	switch (tier) {
		case 'strongest':
			return strongestRateLimiter
		case 'strong':
			return strongRateLimiter
		case 'general':
			return generalRateLimiter
	}
}

export const getClientIp = (headers: ReadonlyHeaders): string => {
	const forwardedFor = headers.get('x-forwarded-for')
	if (forwardedFor) {
		return forwardedFor.split(',')[0]?.trim() ?? 'unknown'
	}

	const realIp = headers.get('x-real-ip')
	if (realIp) {
		return realIp
	}

	return 'unknown'
}

export const checkRateLimit = async (
	identifier: string,
	tier: RateLimitTier = 'general',
) => {
	const limiter = getRateLimiter(tier)

	try {
		await limiter.consume(identifier, 1)
		return { status: 'success' } as const
	} catch (error) {
		if (error instanceof Error) {
			throw error
		}

		const rateLimitError = error as { msBeforeNext: number }
		const retryAfterSeconds = Math.ceil(rateLimitError.msBeforeNext / 1000)
		return { status: 'error', retryAfterSeconds } as const
	}
}

export const requireRateLimit = async (tier: RateLimitTier = 'general') => {
	const headersList = await headers()
	const ip = getClientIp(headersList)
	const result = await checkRateLimit(ip, tier)

	return result
}
