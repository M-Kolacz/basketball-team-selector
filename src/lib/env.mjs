import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	server: {
		JWT_SECRET: z.string(),
		DATABASE_URL: z.string(),
		NODE_ENV: z.enum(['development', 'test', 'production']),
	},
	client: {},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		JWT_SECRET: process.env.JWT_SECRET,
		NODE_ENV: process.env.NODE_ENV,
	},
	skipValidation: Boolean(process.env.CI),
})
