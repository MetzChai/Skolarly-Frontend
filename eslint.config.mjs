import parser from '@typescript-eslint/parser'
import tsEslintPlugin from '@typescript-eslint/eslint-plugin'

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['node_modules/**', '.next/**', 'dist/**', 'build/**'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: ['./tsconfig.json'],
      },
      globals: {
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsEslintPlugin,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-undef': 'off',
    },
  },
]