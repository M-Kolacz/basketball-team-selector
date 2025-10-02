import epicWeb from '@epic-web/config/eslint'
import storybook from 'eslint-plugin-storybook'

const eslintConfig = [
	{
		ignores: [
			'node_modules/**',
			'.next/**',
			'out/**',
			'build/**',
			'next-env.d.ts',
		],
	},
	...epicWeb,
	{
		files: ['.storybook/**/*.ts', '.storybook/**/*.tsx'],
		languageOptions: {
			parserOptions: {
				projectService: {
					allowDefaultProject: ['.storybook/*.ts'],
				},
			},
		},
	},
	...storybook.configs['flat/recommended'],
]

export default eslintConfig
