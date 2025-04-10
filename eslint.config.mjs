// eslint.config.mjs
import nextPlugin from 'eslint-config-next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  // Configuración de Next.js sin depender del parche
  {
    ...nextPlugin,
    files: ['**/*.{js,jsx,ts,tsx}'],
  },

  // Configuración de TypeScript
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
    },
  },
];