import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

config({ path: '.env' })

export default defineConfig({
	migrations: {
		seed: 'tsx prisma/seed.ts',
	},
})
