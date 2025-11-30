import { defineConfig } from 'evalite/config'

export default defineConfig({
	testTimeout: 60000,
	maxConcurrency: 100,
	scoreThreshold: 80,
	hideTable: false,
	server: {
		port: 3006,
	},
})
