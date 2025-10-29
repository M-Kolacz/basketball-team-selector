import epicWeb from '@epic-web/config/eslint'
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths'
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions'
import storybook from 'eslint-plugin-storybook'

const eslintConfig = [
	{
		ignores: [
			'node_modules/**',
			'.next/**',
			'out/**',
			'build/**',
			'next-env.d.ts',
			'generated/**',
		],
	},
	...epicWeb,
	{
		plugins: {
			'no-relative-import-paths': noRelativeImportPaths,
			'prefer-arrow-functions': preferArrowFunctions,
		},
	},
	{
		rules: {
			'import/no-relative-parent-imports': 'error',
			'no-relative-import-paths/no-relative-import-paths': [
				'error',
				{ rootDir: 'src', prefix: '#app' },
			],
			'prefer-arrow-functions/prefer-arrow-functions': [
				'error',
				{
					classPropertiesAllowed: false,
					disallowPrototype: false,
					returnStyle: 'unchanged',
					singleReturnOnly: false,
				},
			],
		},
	},
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
